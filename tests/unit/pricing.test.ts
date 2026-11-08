import { describe, expect, it } from "vitest";
import {
  calculateFixedPackagePrice,
  calculatePerStarPrice,
  calculateTierProgressionPrice,
  isTestimonialRewardEligible,
  TESTIMONIAL_REWARD,
} from "../../src/features/pricing/pricing";
import {
  fixedPackages,
  perStarServices,
  tierProgressions,
} from "../../src/features/catalog/data/catalog";

describe("catalog data", () => {
  it("contains all supplied per-star services and prices", () => {
    expect(perStarServices.map(({ id, promoPricePerStar, originalPricePerStar }) => [
      id,
      promoPricePerStar,
      originalPricePerStar,
    ])).toEqual([
      ["grand-master", 3_000, 4_000],
      ["epic", 4_500, 6_000],
      ["legend", 5_500, 7_000],
      ["mythic", 10_000, 13_000],
      ["mythic-honor", 12_500, 15_000],
      ["mythic-glory", 17_000, 20_000],
    ]);
  });

  it("contains all supplied fixed packages", () => {
    expect(fixedPackages.map(({ id, price }) => [id, price])).toEqual([
      ["placement-mythic-10-matches", 99_000],
      ["epic-10-stars", 40_000],
      ["legend-10-stars", 50_000],
      ["mythic-10-stars", 95_000],
      ["honor-10-stars", 115_000],
    ]);
  });

  it("contains all supplied progression packages with one bonus star", () => {
    expect(tierProgressions).toHaveLength(4);
    expect(tierProgressions.every((item) => item.bonusStars === 1)).toBe(true);
    expect(tierProgressions.find((item) => item.id === "epic-v-to-mythic")?.featured)
      .toBe("best-seller");
  });
});

describe("calculatePerStarPrice", () => {
  it.each([
    ["grand-master", 1, 3_000],
    ["epic", 10, 45_000],
    ["mythic", 1, 10_000],
    ["mythic-honor", 1, 12_500],
    ["mythic-glory", 1, 17_000],
  ])("%s × %i returns %i rupiah", (serviceId, quantity, expected) => {
    expect(calculatePerStarPrice(serviceId, quantity)).toEqual({
      subtotal: expected,
      bonusStars: 0,
    });
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid quantity %s",
    (quantity) => {
      expect(() => calculatePerStarPrice("epic", quantity)).toThrow(RangeError);
    },
  );

  it("rejects unknown service identifiers", () => {
    expect(() => calculatePerStarPrice("unknown", 1)).toThrow(RangeError);
  });
});

describe("fixed package pricing", () => {
  it("uses the configured fixed price without quantity multiplication", () => {
    expect(calculateFixedPackagePrice("epic-10-stars")).toEqual({
      subtotal: 40_000,
      bonusStars: 0,
    });
    expect(calculateFixedPackagePrice("placement-mythic-10-matches").subtotal)
      .toBe(99_000);
  });

  it("rejects unknown package identifiers", () => {
    expect(() => calculateFixedPackagePrice("unknown")).toThrow(RangeError);
  });
});

describe("tier progression pricing", () => {
  it("returns the fixed price and one bonus star", () => {
    expect(calculateTierProgressionPrice("epic-v-to-mythic")).toEqual({
      subtotal: 235_000,
      bonusStars: 1,
    });
  });

  it("rejects unknown progression identifiers", () => {
    expect(() => calculateTierProgressionPrice("unknown")).toThrow(RangeError);
  });
});

describe("testimonial reward eligibility", () => {
  it("keeps the reward separate from the checkout subtotal", () => {
    expect(TESTIMONIAL_REWARD).toBe(5_000);
    expect(isTestimonialRewardEligible(20_000)).toBe(false);
    expect(isTestimonialRewardEligible(20_001)).toBe(true);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid subtotal %s",
    (subtotal) => {
      expect(() => isTestimonialRewardEligible(subtotal)).toThrow(RangeError);
    },
  );
});
