# Credo Store — Admin Authentication and RBAC

## Implemented in this stage

- Email/password login through Supabase Auth.
- Logout through a server action.
- Server-side session verification using Supabase SSR `auth.getClaims()`.
- Active `admin_profiles` lookup under the current user's RLS policy.
- Central role and permission matrix.
- Protected admin route group. The public storefront has no admin navigation link.
- Login, forbidden, and dashboard routes are marked `noindex`.
- Database trigger enforcement for retaining at least one active owner.

The authentication foundation does not implement category/subcategory CRUD, audit-log UI, or database-backed storefront reads. Owner-only administrator invitations and account management are implemented in the subsequent account-management stage.

## Supabase project configuration

Set these values in local `.env.local` and the deployment environment:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Never place a Supabase secret/service-role key in a `NEXT_PUBLIC_*` variable or browser code. The owner-only account management module also requires `SUPABASE_SERVICE_ROLE_KEY` in the server environment. This key must remain server-only and must never be committed or exposed to the browser.

In Supabase Dashboard, disable public sign-ups for the project. Admin accounts must be provisioned deliberately; the login page is not a registration page.

## Provision the first owner

1. Create the first user from Supabase Dashboard → Authentication → Users → Add user. Use an email controlled by the store owner and set a strong password.
2. Copy that Auth user's UUID.
3. Run the following SQL in the Supabase SQL Editor, replacing the UUID and display name:

```sql
insert into public.admin_profiles (user_id, role, display_name, is_active)
values ('AUTH_USER_UUID', 'owner', 'Store Owner', true);
```

4. Confirm exactly one active owner exists:

```sql
select user_id, role, display_name, is_active
from public.admin_profiles
where role = 'owner' and is_active = true;
```

5. Open `/admin/login` and sign in using the provisioned Auth account.

Do not insert passwords into `admin_profiles`. Supabase Auth owns credentials and password hashes.

## Adding more administrators

The owner-only `/admin/users` page can invite `admin`, `catalog_manager`, and `viewer` accounts, change those roles, and activate/deactivate their access. Owner accounts cannot be created, demoted, or deactivated through this UI; use a deliberate trusted database operation for owner provisioning, while the database trigger prevents removal of the last active owner. Invited users receive an email from Supabase Auth. Configure Supabase Auth email delivery/SMTP before using invitations. The trusted Dashboard/SQL workflow remains available for recovery and initial bootstrap:

1. Create the Auth user in the dashboard.
2. Insert a profile with one of `admin`, `catalog_manager`, or `viewer`.
3. Never grant `owner` except through an explicit trusted owner operation.
4. Verify the role and active state before sharing credentials with the administrator.

Example:

```sql
insert into public.admin_profiles (user_id, role, display_name, is_active)
values ('AUTH_USER_UUID', 'catalog_manager', 'Catalog Staff', true);
```

## Category management

The category page is available to all active administrator roles with `catalog:read`. Create, edit, and activation changes require `catalog:write`; server actions enforce this permission independently of the UI. Category changes are written through the authenticated Supabase SSR client so PostgreSQL RLS and the catalog audit trigger remain in effect. Category records are deactivated rather than hard-deleted.

## Role permissions

| Permission | owner | admin | catalog_manager | viewer |
|---|---:|---:|---:|---:|
| Dashboard | Yes | Yes | Yes | Yes |
| Read catalog | Yes | Yes | Yes | Yes |
| Write catalog | Yes | Yes | Yes | No |
| Read audit log | Yes | Yes | No | No |
| Manage administrators | Yes | No | No | No |

The server checks authorization independently of UI visibility. Database RLS remains the data-access boundary.

## Migration

Apply the new migration after the original catalog/RBAC migration:

```bash
supabase db push
```

For a clean local database:

```bash
supabase db reset
```

The owner guard migration attaches the previously defined trigger function to `admin_profiles`, serializes concurrent last-owner removal attempts, and revokes direct execute privileges from application roles on trigger-only functions.

## Operational security

- Use Supabase Auth's email/password protections and configure appropriate rate limits in the Supabase project.
- Enable email confirmation if the operational flow requires it; provisioned accounts must complete the required verification before login.
- Configure password recovery and secure the owner email account.
- Keep Supabase project secrets and database passwords out of Git.
- Do not treat an unlisted URL or `noindex` as access control.
- Every future admin page and mutation must call the centralized authorization guard or enforce the equivalent role through RLS.
