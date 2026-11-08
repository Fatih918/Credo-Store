-- Extend audit log records to include administrator account changes.
-- The service-role-only server actions write these records after successful mutations.

alter table public.audit_logs
  drop constraint if exists audit_logs_entity_type_check;

alter table public.audit_logs
  add constraint audit_logs_entity_type_check
  check (entity_type in ('category', 'subcategory', 'admin_profile'));

comment on column public.audit_logs.entity_type is
  'Entity affected by the audited operation: category, subcategory, or admin_profile.';
