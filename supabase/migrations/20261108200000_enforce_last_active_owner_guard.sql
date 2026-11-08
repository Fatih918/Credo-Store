-- The original RBAC foundation defined this trigger function but did not attach it
-- to admin_profiles. Attach it and serialize concurrent owner-removal attempts.

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
      perform pg_advisory_xact_lock(hashtext('credo_store_last_active_owner_guard'));

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
    perform pg_advisory_xact_lock(hashtext('credo_store_last_active_owner_guard'));

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

drop trigger if exists admin_profiles_prevent_last_owner_removal
  on public.admin_profiles;

create trigger admin_profiles_prevent_last_owner_removal
before update or delete on public.admin_profiles
for each row execute function public.prevent_last_owner_removal();

-- Trigger functions are not application RPC endpoints. Trigger invocation does
-- not require callers to have EXECUTE privileges on the function.
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.prevent_last_owner_removal() from public, anon, authenticated;
revoke all on function public.write_catalog_audit_log() from public, anon, authenticated;
