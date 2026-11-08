# Storefront pages

## Routes
- `/`: Home page with the supplied Credo Store banner and a short ordering introduction.
- `/paket`: Catalog grouped into per-star services, fixed-price packages, and tier progression.
- `/paket/[id]`: Dedicated package detail and order form. The selected catalog item is fixed by the route.

## Navigation
The shared header links to Home and Pilihan Paket. The banner is displayed only on Home. The supplied image is stored at `public/img/banner_credo_store.png`.

## Ordering
The detail page reuses the existing catalog, pricing, validation, and WhatsApp Click to Chat modules. It does not introduce cart quantities, payment handling, backend persistence, or account credentials. The customer reviews and sends the prefilled WhatsApp message manually.

## Open business decisions preserved
- Nickname, User ID, and Server ID remain optional.
- Multiple quantities for fixed packages are not introduced.
- Cross-tier per-star pricing and boundary interpretation remain unmodified.
- DP behavior and testimonial reward application remain unresolved.
