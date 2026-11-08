import {
  fixedPackages,
  perStarServices,
  tierProgressions,
} from "../catalog/data/catalog";

export const TESTIMONIAL_REWARD = 5_000;
export const TESTIMONIAL_MINIMUM_SUBTOTAL = 20_000;

export type PriceCalculation = {
  readonly subtotal: number;
  readonly bonusStars: number;
};

function findById<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
  label: string,
): T {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new RangeError(`${label} tidak ditemukan: ${id}`);
  }

  return item;
}

export function calculatePerStarPrice(
  serviceId: string,
  quantity: number,
): PriceCalculation {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new RangeError("Jumlah star harus berupa bilangan bulat positif.");
  }

  const service = findById(perStarServices, serviceId, "Layanan per-star");

  return {
    subtotal: service.promoPricePerStar * quantity,
    bonusStars: 0,
  };
}

export function calculateFixedPackagePrice(
  packageId: string,
): PriceCalculation {
  const item = findById(fixedPackages, packageId, "Paket");

  return {
    subtotal: item.price,
    bonusStars: 0,
  };
}

export function calculateTierProgressionPrice(
  progressionId: string,
): PriceCalculation {
  const item = findById(
    tierProgressions,
    progressionId,
    "Paket progression",
  );

  return {
    subtotal: item.price,
    bonusStars: item.bonusStars,
  };
}

export function isTestimonialRewardEligible(subtotal: number): boolean {
  if (!Number.isSafeInteger(subtotal) || subtotal < 0) {
    throw new RangeError("Subtotal harus berupa bilangan bulat rupiah non-negatif.");
  }

  return subtotal > TESTIMONIAL_MINIMUM_SUBTOTAL;
}
