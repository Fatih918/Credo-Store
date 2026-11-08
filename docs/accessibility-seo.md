# Accessibility and SEO

## Implemented

- The root document declares Indonesian as its language.
- Every storefront route has a single main landmark with the `main-content` skip target.
- A keyboard-accessible skip link appears when focused.
- Global `:focus-visible` styling provides a visible keyboard focus indicator.
- The shared navigation has an accessible name; the brand link has an explicit home label.
- Catalog groups and package-detail sections expose programmatic heading relationships.
- Existing form labels, error messages, and image alternative text are retained.
- Global metadata includes a descriptive title, description, robots policy, Open Graph basics, Twitter card basics, and the existing store logo as an icon.
- Route-specific metadata is provided for catalog and package detail pages.
- Reduced-motion preferences continue to be respected.

## Intentionally deferred

The production domain has not been supplied. Therefore this change does not invent:
- `metadataBase` or canonical URLs.
- An absolute sitemap URL.
- Absolute Open Graph image URLs.
- Domain-specific Search Console or analytics configuration.

After the production domain is finalized, add and verify canonical URLs, a sitemap, absolute social preview metadata, and domain ownership verification.

## Verification

Automated production HTTP smoke tests verify document language, key metadata tags, icon reference, skip navigation, main landmarks, and page section relationships.

Automated markup checks do not replace browser-based accessibility review. Before launch, test keyboard-only navigation, screen-reader announcements, color contrast, zoom/reflow, and mobile layout in real browsers.
