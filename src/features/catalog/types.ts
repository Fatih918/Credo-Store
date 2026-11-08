export type PerStarService = {
  readonly id: string;
  readonly category: "per-star";
  readonly name: string;
  readonly promoPricePerStar: number;
  readonly originalPricePerStar: number;
  readonly suppliedBand?: string;
};

export type FixedPackage = {
  readonly id: string;
  readonly category: "fixed-package";
  readonly name: string;
  readonly price: number;
  readonly originalPrice?: number;
  readonly description?: string;
};

export type TierProgressionPackage = {
  readonly id: string;
  readonly category: "tier-progression";
  readonly name: string;
  readonly price: number;
  readonly bonusStars: number;
  readonly featured?: "best-seller";
};

export type CatalogItem =
  | PerStarService
  | FixedPackage
  | TierProgressionPackage;
