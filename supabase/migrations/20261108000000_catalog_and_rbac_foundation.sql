-- Credo Store: PostgreSQL catalog foundation, RBAC primitives, and initial catalog seed.
-- Apply with Supabase CLI: supabase db push
-- All monetary values are integer IDR.

create extension if not exists pgcrypto;

create type public.admin_role as enum (
  'owner',
  'admin',
  'catalog_manager',
  'viewer'
);

create type public.catalog_pricing_type as enum (
  'per_star',
  'fixed',
  'tier_progression'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (length(trim(name)) between 1 and 120),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  pricing_type public.catalog_pricing_type not null,
  promo_price bigint not null check (promo_price >= 0),
  original_price bigint check (original_price is null or original_price >= 0),
  unit_label text,
  included_quantity integer check (included_quantity is null or included_quantity > 0),
  bonus_quantity integer not null default 0 check (bonus_quantity >= 0),
  source_rank text,
  target_rank text,
  band_min integer check (band_min is null or band_min >= 0),
  band_max integer check (band_max is null or band_max >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subcategories_category_slug_unique unique (category_id, slug),
  constraint subcategories_band_order check (
    band_min is null or band_max is null or band_min <= band_max
  ),
  constraint subcategories_pricing_shape check (
    (
      pricing_type = 'per_star'
      and unit_label = 'star'
      and included_quantity is null
      and bonus_quantity = 0
      and source_rank is null
      and target_rank is null
    )
    or
    (
      pricing_type = 'fixed'
      and unit_label is null
      and bonus_quantity = 0
      and source_rank is null
      and target_rank is null
      and band_min is null
      and band_max is null
    )
    or
    (
      pricing_type = 'tier_progression'
      and unit_label is null
      and included_quantity is null
      and source_rank is not null
      and target_rank is not null
      and band_min is null
      and band_max is null
    )
  )
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null,
  display_name text check (display_name is null or length(display_name) <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('create', 'update', 'activate', 'deactivate', 'delete')),
  entity_type text not null check (entity_type in ('category', 'subcategory')),
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index subcategories_category_sort_idx
  on public.subcategories(category_id, sort_order, name);
create index subcategories_active_idx
  on public.subcategories(is_active, category_id);
create index audit_logs_created_at_idx
  on public.audit_logs(created_at desc);
create index audit_logs_actor_idx
  on public.audit_logs(actor_user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger subcategories_set_updated_at
before update on public.subcategories
for each row execute function public.set_updated_at();

create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

-- SECURITY DEFINER avoids recursive RLS evaluation on admin_profiles.
create or replace function public.has_admin_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles profile
    where profile.user_id = (select auth.uid())
      and profile.is_active = true
      and profile.role::text = any (allowed_roles)
  );
$$;

revoke all on function public.has_admin_role(text[]) from public;
grant execute on function public.has_admin_role(text[]) to anon, authenticated;

create or replace function public.prevent_last_owner_removal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  remaining_owners integer;
begin
  if tg_op = 'DELETE' then
    if old.role = 'owner' and old.is_active = true then
      select count(*) into remaining_owners
      from public.admin_profiles
      where role = 'owner'
        and is_active = true
        and user_id <> old.user_id;

      if remaining_owners = 0 then
        raise exception 'The last active owner cannot be removed or deactivated';
      end if;
    end if;
    return old;
  end if;

  if old.role = 'owner' and old.is_active = true
     and (new.role <> 'owner' or new.is_active = false) then
    select count(*) into remaining_owners
    from public.admin_profiles
    where role = 'owner'
      and is_active = true
      and user_id <> old.user_id;

    if remaining_owners = 0 then
      raise exception 'The last active owner cannot be removed or deactivated';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.write_catalog_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  entity_id_value uuid;
  before_value jsonb;
  after_value jsonb;
  action_value text;
begin
  if tg_op = 'INSERT' then
    entity_id_value := new.id;
    before_value := null;
    after_value := to_jsonb(new);
    action_value := 'create';
  elsif tg_op = 'UPDATE' then
    entity_id_value := new.id;
    before_value := to_jsonb(old);
    after_value := to_jsonb(new);
    if old.is_active is distinct from new.is_active then
      action_value := case when new.is_active then 'activate' else 'deactivate' end;
    else
      action_value := 'update';
    end if;
  else
    entity_id_value := old.id;
    before_value := to_jsonb(old);
    after_value := null;
    action_value := 'delete';
  end if;

  insert into public.audit_logs (
    actor_user_id, action, entity_type, entity_id, before_data, after_data
  ) values (
    (select auth.uid()),
    action_value,
    case when tg_table_name = 'categories' then 'category' else 'subcategory' end,
    entity_id_value,
    before_value,
    after_value
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.audit_logs enable row level security;

-- Public visitors can read active catalog entries only.
create policy "public_read_active_categories"
on public.categories for select
to anon, authenticated
using (
  is_active = true
  or (select public.has_admin_role(array['owner', 'admin', 'catalog_manager', 'viewer']))
);

create policy "public_read_active_subcategories"
on public.subcategories for select
to anon, authenticated
using (
  (
    is_active = true
    and exists (
      select 1
      from public.categories parent_category
      where parent_category.id = category_id
        and parent_category.is_active = true
    )
  )
  or (select public.has_admin_role(array['owner', 'admin', 'catalog_manager', 'viewer']))
);

-- Only catalog-capable roles may mutate catalog records.
create policy "catalog_roles_insert_categories"
on public.categories for insert
to authenticated
with check ((select public.has_admin_role(array['owner', 'admin', 'catalog_manager'])));

create policy "catalog_roles_update_categories"
on public.categories for update
to authenticated
using ((select public.has_admin_role(array['owner', 'admin', 'catalog_manager'])))
with check ((select public.has_admin_role(array['owner', 'admin', 'catalog_manager'])));

create policy "catalog_roles_insert_subcategories"
on public.subcategories for insert
to authenticated
with check ((select public.has_admin_role(array['owner', 'admin', 'catalog_manager'])));

create policy "catalog_roles_update_subcategories"
on public.subcategories for update
to authenticated
using ((select public.has_admin_role(array['owner', 'admin', 'catalog_manager'])))
with check ((select public.has_admin_role(array['owner', 'admin', 'catalog_manager'])));

-- An administrator can inspect only their own profile; owners can inspect all profiles.
create policy "admins_read_own_profile_or_owner_reads_all"
on public.admin_profiles for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select public.has_admin_role(array['owner']))
);

-- Audit history is visible to owner and admin only. No client write policy exists.
create policy "owner_admin_read_audit_logs"
on public.audit_logs for select
to authenticated
using ((select public.has_admin_role(array['owner', 'admin'])));

-- Seed categories with stable IDs so the migration is repeatable.
insert into public.categories (id, name, slug, description, sort_order)
values
  ('10000000-0000-4000-8000-000000000001', 'Joki Perbintang', 'joki-perbintang', 'Layanan joki dengan harga per star.', 10),
  ('10000000-0000-4000-8000-000000000002', 'Paket Tetap', 'paket-tetap', 'Paket layanan dengan harga tetap.', 20),
  ('10000000-0000-4000-8000-000000000003', 'Tier Progression', 'tier-progression', 'Paket perpindahan rank dengan bonus star.', 30)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- Seed all approved catalog prices. IDs and slugs remain stable for future updates.
insert into public.subcategories (
  id, category_id, name, slug, description, pricing_type,
  promo_price, original_price, unit_label, included_quantity,
  bonus_quantity, source_rank, target_rank, band_min, band_max,
  is_featured, sort_order
)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Grand Master', 'grand-master', null, 'per_star', 3000, 4000, 'star', null, 0, null, null, null, null, false, 10),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Epic', 'epic', null, 'per_star', 4500, 6000, 'star', null, 0, null, null, null, null, false, 20),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Legend', 'legend', null, 'per_star', 5500, 7000, 'star', null, 0, null, null, null, null, false, 30),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'Mythic', 'mythic', null, 'per_star', 10000, 13000, 'star', null, 0, null, null, 0, 25, false, 40),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'Mythic Honor', 'mythic-honor', null, 'per_star', 12500, 15000, 'star', null, 0, null, null, 25, 50, false, 50),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', 'Mythic Glory', 'mythic-glory', null, 'per_star', 17000, 20000, 'star', null, 0, null, null, 50, 100, false, 60),

  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000002', 'Placement Mythic — 10 Matches', 'placement-mythic-10-matches', 'Termasuk seluruh 10 pertandingan.', 'fixed', 99000, 130000, null, 10, 0, null, null, null, null, false, 10),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000002', '10 Stars Epic', 'epic-10-stars', null, 'fixed', 40000, null, null, 10, 0, null, null, null, null, false, 20),
  ('20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000002', '10 Stars Legend', 'legend-10-stars', null, 'fixed', 50000, null, null, 10, 0, null, null, null, null, false, 30),
  ('20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000002', '10 Stars Mythic', 'mythic-10-stars', null, 'fixed', 95000, null, null, 10, 0, null, null, null, null, false, 40),
  ('20000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000002', '10 Stars Honor', 'honor-10-stars', null, 'fixed', 115000, null, null, 10, 0, null, null, null, null, false, 50),

  ('20000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000003', 'Epic V → Legend V', 'epic-v-to-legend-v', null, 'tier_progression', 110000, null, null, null, 1, 'Epic V', 'Legend V', null, null, false, 10),
  ('20000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000003', 'Legend V → Mythic (Graduation)', 'legend-v-to-mythic', null, 'tier_progression', 135000, null, null, null, 1, 'Legend V', 'Mythic', null, null, false, 20),
  ('20000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000003', 'Epic V → Mythic', 'epic-v-to-mythic', null, 'tier_progression', 235000, null, null, null, 1, 'Epic V', 'Mythic', null, null, true, 30),
  ('20000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000003', 'Mythic → Mythic Honor (25 Stars)', 'mythic-to-honor-25', null, 'tier_progression', 230000, null, null, null, 1, 'Mythic', 'Mythic Honor', null, null, false, 40)
on conflict (category_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  pricing_type = excluded.pricing_type,
  promo_price = excluded.promo_price,
  original_price = excluded.original_price,
  unit_label = excluded.unit_label,
  included_quantity = excluded.included_quantity,
  bonus_quantity = excluded.bonus_quantity,
  source_rank = excluded.source_rank,
  target_rank = excluded.target_rank,
  band_min = excluded.band_min,
  band_max = excluded.band_max,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order;

-- Keep service-role-only bootstrap/admin operations out of browser policies.
comment on table public.admin_profiles is
  'Admin identity metadata. Credentials remain in Supabase Auth. Provision profiles only through trusted server-side owner/bootstrap operations.';
comment on table public.audit_logs is
  'Append-only audit history generated by database triggers for catalog mutations.';
comment on column public.subcategories.promo_price is
  'Integer IDR. For per_star this is the price per star; for fixed and tier_progression it is the total fixed price.';

-- Enable audit capture after the initial seed so bootstrap rows are not logged as admin edits.
create trigger categories_audit
after insert or update or delete on public.categories
for each row execute function public.write_catalog_audit_log();

create trigger subcategories_audit
after insert or update or delete on public.subcategories
for each row execute function public.write_catalog_audit_log();

