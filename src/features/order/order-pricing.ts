import type { CatalogItem } from "../catalog/types";
import { isTestimonialRewardEligible, type PriceCalculation } from "../pricing/pricing";

export type OrderPriceSummary = PriceCalculation & {
  readonly itemName: string;
  readonly itemCategory: CatalogItem["category"];
  readonly categoryLabel: string;
  readonly testimonialRewardEligible: boolean;
};

export function calculateOrderSummary(item: CatalogItem, starQuantity: number): OrderPriceSummary {
  let calculation: PriceCalculation;

  switch (item.category) {
    case "per-star":
      if (!Number.isSafeInteger(starQuantity) || starQuantity <= 0) {
        throw new RangeError("Jumlah star harus berupa bilangan bulat positif.");
      }
      calculation = { subtotal: item.promoPricePerStar * starQuantity, bonusStars: 0 };
      break;
    case "fixed-package":
      calculation = { subtotal: item.price, bonusStars: 0 };
      break;
    case "tier-progression":
      calculation = { subtotal: item.price, bonusStars: item.bonusStars };
      break;
  }

  if (!Number.isSafeInteger(calculation.subtotal) || calculation.subtotal < 0) {
    throw new RangeError("Harga katalog tidak valid.");
  }

  return {
    ...calculation,
    itemName: item.name,
    itemCategory: item.category,
    categoryLabel:
      item.category === "per-star"
        ? "Harga per star"
        : item.category === "fixed-package"
          ? "Paket harga tetap"
          : "Paket tier progression",
    testimonialRewardEligible: isTestimonialRewardEligible(calculation.subtotal),
  };
}
