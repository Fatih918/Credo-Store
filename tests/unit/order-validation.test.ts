import { describe, expect, it } from "vitest";
import { hasOrderErrors, validateOrderDraft } from "../../src/features/order/validation";
import type { OrderDraft } from "../../src/features/order/types";
import { calculateOrderSummary } from "../../src/features/order/order-pricing";
import { fixedPackages, perStarServices, tierProgressions } from "../../src/features/catalog/data/catalog";

const validDraft: OrderDraft = {
  catalogItemId: "epic",
  starQuantity: 1,
  nickname: "",
  userId: "",
  serverId: "",
  heroOrRoleRequest: "",
  winRateOrStreakRequest: "",
  notes: "",
};

describe("validateOrderDraft", () => {
  it("accepts a valid per-star order with account fields left optional", () => {
    expect(validateOrderDraft(validDraft, perStarServices[1])).toEqual({});
  });

  it("requires a positive integer quantity for per-star service", () => {
    expect(validateOrderDraft({ ...validDraft, starQuantity: 0 }, perStarServices[1]).starQuantity).toBeTruthy();
    expect(validateOrderDraft({ ...validDraft, starQuantity: 1.5 }, perStarServices[1]).starQuantity).toBeTruthy();
  });

  it("does not require a star quantity for fixed-price packages", () => {
    const fixedDraft = { ...validDraft, catalogItemId: fixedPackages[1].id, starQuantity: 0 };
    expect(validateOrderDraft(fixedDraft, fixedPackages[1])).toEqual({});
  });

  it("accepts a newly created database catalog item when passed by the page", () => {
    const dynamicItem = { ...perStarServices[1], id: "new-service-from-db" };
    const dynamicDraft = { ...validDraft, catalogItemId: dynamicItem.id };
    expect(validateOrderDraft(dynamicDraft, dynamicItem)).toEqual({});
  });

  it("rejects unknown catalog items when no database item is supplied", () => {
    expect(validateOrderDraft({ ...validDraft, catalogItemId: "unknown" }).catalogItemId).toBeTruthy();
  });

  it("enforces free-text length limits", () => {
    expect(validateOrderDraft({ ...validDraft, notes: "x".repeat(501) }).notes).toBe("Maksimal 500 karakter.");
  });

  it("reports whether validation errors exist", () => {
    expect(hasOrderErrors({})).toBe(false);
    expect(hasOrderErrors({ notes: "invalid" })).toBe(true);
  });
});

describe("calculateOrderSummary", () => {
  it("calculates per-star summary from supplied catalog data", () => {
    expect(calculateOrderSummary(perStarServices[1], 4)).toMatchObject({
      itemName: "Epic", subtotal: 18_000, bonusStars: 0, testimonialRewardEligible: false,
    });
  });

  it("calculates fixed package summary without multiplying", () => {
    expect(calculateOrderSummary(fixedPackages[1], 99).subtotal).toBe(40_000);
  });

  it("includes progression bonus without changing price", () => {
    expect(calculateOrderSummary(tierProgressions[2], 1)).toMatchObject({
      subtotal: 235_000, bonusStars: 1, testimonialRewardEligible: true,
    });
  });

  it("calculates a newly created database item without a static catalog entry", () => {
    const dynamicItem = { ...perStarServices[1], id: "new-service-from-db", promoPricePerStar: 6_250 };
    expect(calculateOrderSummary(dynamicItem, 2).subtotal).toBe(12_500);
  });
});
