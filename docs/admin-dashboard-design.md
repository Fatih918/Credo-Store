# Credo Store — Admin Dashboard and RBAC Design

## Status
Proposed design. This document extends the original storefront-only MVP architecture. It does not introduce runtime changes or database migrations by itself.

## 1. Goals and boundaries

Add a private admin application that lets authorized staff manage the public service catalog without editing source code.

In scope:
- Multiple administrator accounts.
- Role-based access control (RBAC), enforced on the server and database.
- Category and subcategory CRUD, ordering, activation/deactivation, and price configuration.
- PostgreSQL persistence for catalog, admin profiles, and audit history.
- Public storefront reads active catalog data from the database.
- Admin area is not linked from public navigation or landing-page content.

Out of scope for this phase:
- Customer accounts.
- Order persistence, order tracking, payment processing, and payment verification.
- Automated WhatsApp sending.
- Arbitrary custom permission editor. Roles are fixed presets initially.

The admin route is intentionally private, not secret. Hiding its link or applying noindex is not an access-control mechanism.

## 2. Technology decisions

- Supabase PostgreSQL is the system of record for catalog data.
- Supabase Auth handles administrator identity, password hashing, sessions, and recovery.
- Use the Supabase SSR integration with secure server-managed cookies.
- Use Next.js Server Components for protected admin pages and server-side mutations for writes.
- Use PostgreSQL Row Level Security (RLS) as a second enforcement layer.
- Keep the Supabase service-role key server-only. Never expose it through a client component, public environment variable, or browser request.
- Validate all mutation input on the server; UI visibility is not authorization.

Environment configuration will be required after this feature is implemented:
- Public Supabase project URL and anon/publishable key.
- Supabase service-role key only if a narrowly scoped server-only administrative operation requires it.
- No secret should be committed to Git.

## 3. Route and layout separation

Public routes remain:
- /
- /paket
- /paket/[id]

Private routes:
- /admin/login
- /admin
- /admin/categories
- /admin/subcategories
- /admin/users
- /admin/audit-logs

Rules:
- Do not add admin links to the public header, footer, home page, or customer catalog.
- Admin pages use a separate layout and navigation.
- Unauthenticated requests to protected admin routes redirect to /admin/login.
- Authenticated users without the required permission receive an explicit forbidden response/page.
- Add noindex metadata for admin routes and exclude them from sitemap generation if a sitemap is added.
- Server-side authorization is required on every protected page loader and every mutation. Middleware/proxy redirects may improve navigation but are not the security boundary.

## 4. Roles and permissions

Roles are fixed presets in the first version.

| Capability | owner | admin | catalog_manager | viewer |
|---|---:|---:|---:|---:|
| View dashboard | Yes | Yes | Yes | Yes |
| View catalog | Yes | Yes | Yes | Yes |
| Create/edit categories | Yes | Yes | Yes | No |
| Activate/deactivate categories | Yes | Yes | Yes | No |
| Create/edit subcategories and prices | Yes | Yes | Yes | No |
| Activate/deactivate subcategories | Yes | Yes | Yes | No |
| Reorder catalog entries | Yes | Yes | Yes | No |
| View audit log | Yes | Yes | No | No |
| Invite administrator | Yes | No | No | No |
| Change admin role | Yes | No | No | No |
| Disable/revoke admin access | Yes | No | No | No |

Role semantics:
- owner: full control, including administrator lifecycle and role assignment.
- admin: catalog management plus audit-log visibility; cannot grant privileges or manage accounts.
- catalog_manager: catalog CRUD only.
- viewer: read-only dashboard and catalog access.

The initial owner must be provisioned through a trusted one-time bootstrap procedure, not public self-registration. The application must prevent removal or demotion of the last active owner.

Permission checks must use a central server-side authorization module. Do not scatter ad-hoc role string comparisons throughout UI components.

## 5. Catalog domain model

The hierarchy is:

Category -> Subcategory

Example:
- Category: Joki Perbintang
  - Subcategory: Grand Master — Rp3.000/star
  - Subcategory: Epic — Rp4.500/star
  - Subcategory: Legend — Rp5.500/star
  - Subcategory: Mythic — Rp10.000/star
- Category: Paket Tetap
  - Subcategory: Placement Mythic — 10 Matches
  - Subcategory: 10 Stars Epic
- Category: Tier Progression
  - Subcategory: Epic V → Legend V
  - Subcategory: Epic V → Mythic

A subcategory represents a purchasable catalog entry and owns its pricing configuration. The pricing model determines which fields are applicable:

- per_star: promo price per star and optional original price per star.
- fixed: one fixed price; optional original price and descriptive quantity such as included matches/stars.
- tier_progression: one fixed price, source rank, destination rank, and bonus stars.

Use a typed pricing model and database CHECK constraints so invalid combinations cannot be saved. Do not use an unvalidated arbitrary JSON blob as the primary price model.

### Proposed tables

#### categories
- id UUID primary key.
- name text, required.
- slug text, required; unique.
- description text nullable.
- is_active boolean, default true.
- sort_order integer, default 0.
- created_at and updated_at timestamptz.

#### subcategories
- id UUID primary key.
- category_id UUID foreign key to categories.
- name text, required.
- slug text, required; unique within category.
- description text nullable.
- pricing_type enum: per_star | fixed | tier_progression.
- promo_price bigint, required, non-negative integer rupiah.
- original_price bigint nullable, non-negative when present.
- unit_label text nullable (e.g. star).
- included_quantity integer nullable (e.g. 10 matches or 10 stars).
- bonus_quantity integer nullable, default 0.
- source_rank text nullable.
- target_rank text nullable.
- band_min integer nullable.
- band_max integer nullable.
- is_featured boolean, default false.
- is_active boolean, default true.
- sort_order integer, default 0.
- created_at and updated_at timestamptz.

Constraints:
- promo_price and original_price are stored as integer rupiah, never floating-point.
- per_star entries require unit_label='star'; band values remain nullable because not every tier has a supplied band.
- fixed entries do not multiply promo_price by a customer quantity.
- tier_progression entries require source_rank and target_rank; bonus_quantity is the bonus-star count.
- band_min <= band_max when both are present.
- Slugs are unique within their parent category.
- Category/subcategory deletion should be restricted when it would orphan data; prefer is_active=false for catalog entries that should no longer be offered.
- The precise CHECK constraints and enum migration must be finalized in the implementation PR.

#### admin_profiles
- user_id UUID primary key referencing auth.users(id) with cascade behavior aligned to account deletion policy.
- role enum: owner | admin | catalog_manager | viewer.
- display_name text nullable.
- is_active boolean, default true.
- created_at and updated_at timestamptz.

Supabase Auth owns credentials and password hashes. Do not create a password column in public application tables.

#### audit_logs
- id UUID primary key.
- actor_user_id UUID nullable, referencing auth.users(id) where feasible.
- action text or constrained enum (create, update, activate, deactivate, invite, role_change, revoke).
- entity_type text (category, subcategory, admin_profile).
- entity_id UUID nullable.
- before_data jsonb nullable.
- after_data jsonb nullable.
- created_at timestamptz.
- Store no passwords, access tokens, service-role keys, or other secrets in audit payloads.
- Audit events should be written server-side in the same transaction as the mutation where practical; ordinary admins must not edit or delete audit records.

## 6. Security requirements

1. Disable public sign-up. Administrator accounts are invited by an owner.
2. Provision the first owner using a documented trusted bootstrap procedure and verify it is idempotent.
3. Every admin page and mutation must validate the current authenticated user, active admin profile, and required permission on the server.
4. Apply RLS to all application tables. Default to deny; add only the policies required for public active-catalog reads and authorized admin operations.
5. Public/anonymous users can read active categories and active subcategories only. They cannot read admin profiles or audit logs, or write catalog data.
6. Owner-only account administration must be performed through server-side trusted operations; never expose service-role credentials to the browser.
7. Validate IDs, slugs, price bounds, required fields, and pricing-type-specific fields on the server.
8. Prevent privilege escalation: users cannot change their own role, activate their own disabled profile, or invite/assign owner unless the current actor is an active owner.
9. Prevent removal/demotion of the last active owner.
10. Rate-limit login and invitation endpoints where supported; use Supabase Auth protections and sensible application limits.
11. Use secure, HttpOnly, SameSite cookies through the supported SSR integration.
12. Admin UI controls are presentation only; permission checks must still reject direct requests.
13. Record successful catalog and admin-account mutations in audit_logs.
14. Do not store customer game passwords or verification codes.

## 7. Catalog migration and pricing integrity

The existing catalog is currently defined in TypeScript and is the storefront's source of truth. The migration must:
- Seed all current catalog entries from the approved catalog/pricing documentation.
- Preserve promo and original prices exactly where supplied.
- Preserve per-star, fixed-price, and tier-progression pricing semantics.
- Preserve the +1 bonus star only on tier-progression packages.
- Preserve the testimonial reward as a post-service benefit; it is not a catalog price deduction.
- Preserve Best Seller metadata on Epic V → Mythic.
- Preserve the current behavior for unresolved cross-tier pricing and 25/50-star boundaries; do not invent rules.
- Verify database-seeded totals against existing pricing unit tests before switching storefront reads to the database.

No live catalog write should be enabled until the seed is verified against the current TypeScript catalog.

## 8. Caching and consistency

- Public catalog reads may be cached, but successful admin mutations must invalidate the relevant Next.js cache/tag or use an explicitly short revalidation window.
- Avoid stale pricing after an admin changes a price.
- Admin pages should read current database values and should not use stale shared caches for authorization or role data.
- All prices are integer IDR values.

## 9. Testing and acceptance criteria

Authentication/RBAC:
- Unauthenticated users cannot access protected admin routes or mutations.
- Authenticated users without an active admin profile are denied.
- Each role can perform only the actions in the permission matrix.
- Direct HTTP/server-action requests cannot bypass UI restrictions.
- An admin cannot change their own role or invite another admin.
- Only owner can invite, change roles, disable accounts, and view audit logs.
- Last active owner cannot be disabled or demoted.
- Public users cannot read admin profiles or audit logs.

Catalog:
- Public storefront reads only active categories and subcategories.
- Admin can create, update, reorder, activate, and deactivate catalog entries according to role.
- Invalid pricing-type combinations and negative/non-integer prices are rejected.
- Every successful mutation creates an audit event.
- Existing approved catalog values and pricing calculations remain unchanged after migration.
- Category/subcategory changes are reflected in storefront after cache invalidation.
- Admin route is not linked from public pages and is marked noindex.

## 10. Delivery sequence

1. Documentation and schema review.
2. Database migrations, constraints, RLS policies, and verified seed data.
3. Supabase Auth integration, secure session handling, owner bootstrap, and RBAC guards.
4. Admin shell, dashboard, and administrator management.
5. Category/subcategory management UI and audit history.
6. Switch public storefront catalog reads to PostgreSQL and remove duplicated static catalog source only after parity tests.
7. Security tests, integration tests, production configuration, and deployment verification.

Keep each stage in a reviewable PR. Do not combine the database/auth foundation and all dashboard UI into one unreviewable change.
