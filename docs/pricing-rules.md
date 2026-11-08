# Credo Store — Pricing Rules

## Currency
- Currency: IDR.
- Store prices as integer rupiah values.
- Display using Indonesian locale formatting.
- Promo prices are active grand-opening prices.
- Original prices are comparison-only where supplied.

## Per-star pricing
| ID | Service | Promo / star | Original / star | Supplied band |
|---|---|---:|---:|---|
| grand-master | Grand Master | 3000 | 4000 | Not specified |
| epic | Epic | 4500 | 6000 | Not specified |
| legend | Legend | 5500 | 7000 | Not specified |
| mythic | Mythic | 10000 | 13000 | 0–25 stars |
| mythic-honor | Mythic Honor | 12500 | 15000 | 25–50 stars |
| mythic-glory | Mythic Glory | 17000 | 20000 | 50–100 stars |

Rules:
- No minimum quantity.
- Quantity must be a positive integer.
- Total = promo rate × quantity.
- Do not restore the original promotional copy's minimum of five stars; the store explicitly removed that restriction.
- Do not automatically split a request across pricing bands until a cross-tier rule is approved.
- Boundary interpretation at 25 and 50 stars remains an open decision.

## Fixed-price packages
| ID | Package | Price | Original |
|---|---|---:|---:|
| placement-mythic-10-matches | Placement Mythic — 10 Matches | 99000 | 130000 |
| epic-10-stars | 10 Stars Epic | 40000 | — |
| legend-10-stars | 10 Stars Legend | 50000 | — |
| mythic-10-stars | 10 Stars Mythic | 95000 | — |
| honor-10-stars | 10 Stars Honor | 115000 | — |

These are fixed-price products. Do not multiply their prices by a star quantity. No additional minimum applies. Placement Mythic includes all 10 matches. Do not invent original prices where none were supplied.

## Tier progression packages
| ID | Progression | Price | Bonus |
|---|---|---:|---:|
| epic-v-to-legend-v | Epic V → Legend V | 110000 | +1 star |
| legend-v-to-mythic | Legend V → Mythic (Graduation) | 135000 | +1 star |
| epic-v-to-mythic | Epic V → Mythic | 235000 | +1 star |
| mythic-to-honor-25 | Mythic → Mythic Honor (25 Stars) | 230000 | +1 star |

Epic V → Mythic is Best Seller. The supplied +1 bonus applies to tier-progression packages, not automatically to 10-star packages or Placement Mythic. Bonus stars do not change the listed price. No additional progression package was supplied.

## Grand-opening benefits
- Free hero or role request.
- Free request to maintain win rate or win streak, subject to operational feasibility.
- +1 bonus star for tier-progression packages.
- Do not market “100% safe” as a technical guarantee.

## Testimonial reward
- Rp5.000 reward.
- Eligibility: subtotal strictly greater than Rp20.000.
- Exactly Rp20.000 is not eligible.
- Available after service completion and screenshot submission, according to the supplied offer.
- Not an upfront deduction from the initial order total.
- Store verifies eligibility and applies it manually.
- Whether it is a refund, balance, or later-purchase discount must be decided before automation.

## DP 50%
The store proposed 50% upfront and 50% after completion.
- No payment collection or verification in MVP.
- If displayed, explain that the arrangement is confirmed with the store.
- Do not calculate a split until a rupiah rounding rule is approved.
- The customer's preference may be included in the WhatsApp message.

## Required pricing tests
- Grand Master × 1 = Rp3.000.
- Epic × 10 = Rp45.000.
- Legend × 0 = invalid.
- Mythic × 1 = Rp10.000.
- Mythic Honor × 1 = Rp12.500.
- Mythic Glory × 1 = Rp17.000.
- Epic 10-star package = Rp40.000.
- Placement Mythic = Rp99.000.
- Epic V → Mythic = Rp235.000 with +1 bonus star.
- Rp20.000 subtotal = testimonial reward ineligible.
- Rp20.001 subtotal = eligible after completion and proof; not an upfront discount.