import type {
  FixedPackage,
  PerStarService,
  TierProgressionPackage,
} from "../types";

export const perStarServices = [
  {
    id: "grand-master",
    category: "per-star",
    name: "Grand Master",
    promoPricePerStar: 3_000,
    originalPricePerStar: 4_000,
  },
  {
    id: "epic",
    category: "per-star",
    name: "Epic",
    promoPricePerStar: 4_500,
    originalPricePerStar: 6_000,
  },
  {
    id: "legend",
    category: "per-star",
    name: "Legend",
    promoPricePerStar: 5_500,
    originalPricePerStar: 7_000,
  },
  {
    id: "mythic",
    category: "per-star",
    name: "Mythic",
    promoPricePerStar: 10_000,
    originalPricePerStar: 13_000,
    suppliedBand: "0–25 stars",
  },
  {
    id: "mythic-honor",
    category: "per-star",
    name: "Mythic Honor",
    promoPricePerStar: 12_500,
    originalPricePerStar: 15_000,
    suppliedBand: "25–50 stars",
  },
  {
    id: "mythic-glory",
    category: "per-star",
    name: "Mythic Glory",
    promoPricePerStar: 17_000,
    originalPricePerStar: 20_000,
    suppliedBand: "50–100 stars",
  },
] as const satisfies readonly PerStarService[];

export const fixedPackages = [
  {
    id: "placement-mythic-10-matches",
    category: "fixed-package",
    name: "Placement Mythic — 10 Matches",
    price: 99_000,
    originalPrice: 130_000,
    description: "Termasuk seluruh 10 pertandingan.",
  },
  {
    id: "epic-10-stars",
    category: "fixed-package",
    name: "10 Stars Epic",
    price: 40_000,
  },
  {
    id: "legend-10-stars",
    category: "fixed-package",
    name: "10 Stars Legend",
    price: 50_000,
  },
  {
    id: "mythic-10-stars",
    category: "fixed-package",
    name: "10 Stars Mythic",
    price: 95_000,
  },
  {
    id: "honor-10-stars",
    category: "fixed-package",
    name: "10 Stars Honor",
    price: 115_000,
  },
] as const satisfies readonly FixedPackage[];

export const tierProgressions = [
  {
    id: "epic-v-to-legend-v",
    category: "tier-progression",
    name: "Epic V → Legend V",
    price: 110_000,
    bonusStars: 1,
  },
  {
    id: "legend-v-to-mythic",
    category: "tier-progression",
    name: "Legend V → Mythic (Graduation)",
    price: 135_000,
    bonusStars: 1,
  },
  {
    id: "epic-v-to-mythic",
    category: "tier-progression",
    name: "Epic V → Mythic",
    price: 235_000,
    bonusStars: 1,
    featured: "best-seller",
  },
  {
    id: "mythic-to-honor-25",
    category: "tier-progression",
    name: "Mythic → Mythic Honor (25 Stars)",
    price: 230_000,
    bonusStars: 1,
  },
] as const satisfies readonly TierProgressionPackage[];

export const catalogItems = [
  ...perStarServices,
  ...fixedPackages,
  ...tierProgressions,
] as const;
