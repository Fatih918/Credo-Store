import { catalogItems } from "../catalog/data/catalog";
import {
  calculateFixedPackagePrice,
  calculatePerStarPrice,
  calculateTierProgressionPrice,
  isTestimonialRewardEligible,
} from "../pricing/pricing";
import type { PriceCalculation } from "../pricing/pricing";

export type OrderPriceSummary = PriceCalculation & {
  readonly itemName: string;
  readonly categoryLabel: string;
  readonly testimonialRewardEligible: boolean;
};

export function calculateOrderSummary(
  catalogItemId: string,
  starQuantity: number,
): OrderPriceSummary {
  const item = catalogItems.find((candidate) => candidate.id === catalogItemId);

  if (!item) {
    throw new RangeError(`Layanan tidak ditemukan: ${catalogItemId}`);
  }

  let calculation: PriceCalculation;

  switch (item.category) {
    case "per-star":
      calculation = calculatePerStarPrice(item.id, starQuantity);
      break;
    case "fixed-package":
      calculation = calculateFixedPackagePrice(item.id);
      break;
    case "tier-progression":
      calculation = calculateTierProgressionPrice(item.id);
      break;
  }

  return {
    ...calculation,
    itemName: item.name,
    categoryLabel:
      item.category === "per-star"
        ? "Harga per star"
        : item.category === "fixed-package"
          ? "Paket harga tetap"
          : "Paket tier progression",
    testimonialRewardEligible: isTestimonialRewardEligible(
      calculation.subtotal,
    ),
  };
}
