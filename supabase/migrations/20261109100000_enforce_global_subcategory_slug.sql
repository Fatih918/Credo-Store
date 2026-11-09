-- Public package detail routes use globally unique subcategory slugs.
-- Fail explicitly rather than silently choosing the wrong package if existing data collides.
do $$
begin
  if exists (
    select slug
    from public.subcategories
    group by slug
    having count(*) > 1
  ) then
    raise exception 'Cannot enforce global subcategory slug uniqueness: duplicate slugs already exist';
  end if;
end;
$$;

create unique index if not exists subcategories_slug_global_unique
  on public.subcategories (slug);
