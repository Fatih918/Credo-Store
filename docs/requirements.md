# Credo Store — Product Requirements

## Purpose
Credo Store is a mobile-first storefront for Mobile Legends: Bang Bang rank-boosting services. Customers browse services, select a package, enter order details, review the total, and continue to WhatsApp with a prefilled message.

## Store identity
- Name: Credo Store
- WhatsApp: 6283165112261
- Click to Chat URL: https://wa.me/6283165112261
- Language: Indonesian
- Currency: IDR

## MVP scope
Included:
- Responsive landing page and service catalog.
- Three catalog categories: per-star, fixed-price packages, and tier progression.
- Promotional and original prices where provided.
- Interactive order selection, form validation, and order summary.
- Optional payment preference (DP 50% or discuss with store).
- WhatsApp Click to Chat message generation.
- Grand-opening promotion information.
- Accessibility, metadata, automated tests, and responsive behavior.

Out of scope:
- Accounts/authentication, database, order persistence, admin dashboard/CMS.
- Payment gateway or automated payment verification.
- Automated WhatsApp sending, order tracking, or provider assignment.
- Collection or storage of account passwords.

## Main user journey
1. Customer opens the homepage and browses the catalog.
2. Customer chooses a service and supplies relevant order details.
3. The app validates the form and calculates the total.
4. Customer reviews the order summary and payment preference.
5. Customer explicitly chooses Continue to WhatsApp.
6. WhatsApp opens with a prefilled message to Credo Store.
7. Customer reviews and manually sends the message.

## Order details
Collect only information needed to discuss the order:
- Selected service and category.
- Rank/tier and star quantity where applicable.
- Nickname, User ID, Server ID (requiredness remains to be confirmed).
- Hero/role request, win-rate/win-streak request, and notes (optional).
- Payment preference if offered.

Do not request account passwords in the website form. If account access is required operationally, discuss the security implications directly with the customer. Do not claim zero risk or guarantee game outcomes.

## Catalog

### Per-star services
| Service | Promo | Original |
|---|---:|---:|
| Grand Master | Rp3.000/star | Rp4.000/star |
| Epic | Rp4.500/star | Rp6.000/star |
| Legend | Rp5.500/star | Rp7.000/star |
| Mythic (0–25 stars) | Rp10.000/star | Rp13.000/star |
| Mythic Honor (25–50 stars) | Rp12.500/star | Rp15.000/star |
| Mythic Glory (50–100 stars) | Rp17.000/star | Rp20.000/star |

There is no minimum star quantity for any per-star service.

### Fixed-price packages
| Package | Price | Original |
|---|---:|---:|
| Placement Mythic — 10 matches, all matches included | Rp99.000 | Rp130.000 |
| 10 Stars Epic | Rp40.000 | Not supplied |
| 10 Stars Legend | Rp50.000 | Not supplied |
| 10 Stars Mythic | Rp95.000 | Not supplied |
| 10 Stars Honor | Rp115.000 | Not supplied |

### Tier progression
| Progression | Price |
|---|---:|
| Epic V → Legend V | Rp110.000 |
| Legend V → Mythic (Graduation) | Rp135.000 |
| Epic V → Mythic | Rp235.000 |
| Mythic → Mythic Honor (25 Stars) | Rp230.000 |

Epic V → Mythic is Best Seller. No additional package was supplied beyond Mythic → Mythic Honor (25 Stars).

## Promotions
- Free hero or role request.
- Free request to maintain win rate or win streak, subject to operational feasibility; do not promise a guaranteed outcome.
- Tier-progression packages receive +1 bonus star.
- Avoid presenting “100% safe” as a technical guarantee. Use careful, truthful account-handling language.
- Rp5.000 testimonial reward applies to orders with subtotal strictly greater than Rp20.000, after service completion and submission of a testimonial/review screenshot. It is a post-service benefit, not an automatic checkout deduction.

## Pricing behavior
- Per-star total = selected tier promo rate × positive integer quantity.
- No minimum quantity.
- Fixed-price packages use their configured price and are not multiplied by quantity.
- Tier bonus does not change package price.
- Testimonial threshold is strict: subtotal > Rp20.000. Exactly Rp20.000 is ineligible.
- Do not deduct testimonial reward from the initial order total.
- Do not infer split pricing for orders crossing tier bands. Use the selected tier rate and ask the customer to confirm cross-tier pricing through WhatsApp until a rule is approved.
- Display IDR using Indonesian locale formatting.

## UX direction
Mobile-first dark gaming storefront: charcoal/near-black surfaces, restrained blue or purple accents, limited gold for promotions. Prioritize price readability. Avoid excessive neon and motion. Use semantic HTML, keyboard-accessible controls, visible focus states, and sufficient contrast. Do not fabricate testimonials, ratings, order counts, or performance claims.

## Non-functional requirements
- TypeScript strict mode.
- Feature-oriented reusable components.
- Pricing logic isolated as pure functions and unit tested.
- No client-side secrets or private credentials.
- No database or order persistence in MVP.
- No password fields.
- WhatsApp message URL encoded and addressed to the configured store number.
- Validate and length-limit customer input before URL generation.

## Open product decisions
1. Are nickname, User ID, and Server ID required or optional?
2. Can fixed packages be ordered in multiples, or is each package one product?
3. How should cross-tier per-star orders be priced?
4. Is DP 50% a selectable payment preference or only a WhatsApp discussion point?
5. Is the testimonial reward a refund, balance, or discount on a later purchase?

Do not silently invent answers. Keep unresolved behavior easy to change.