import { describe, expect, it } from "vitest";
import { hasOrderErrors, validateOrderDraft } from "../../src/features/order/validation";
import type { OrderDraft } from "../../src/features/order/types";
import { calculateOrderSummary } from "../../src/features/order/order-pricing";

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
    expect(validateOrderDraft(validDraft)).toEqual({});
  });

  it("requires a positive integer quantity for per-star service", () => {
    expect(validateOrderDraft({ ...validDraft, starQuantity: 0 }).starQuantity)
      .toBeTruthy();
    expect(validateOrderDraft({ ...validDraft, starQuantity: 1.5 }).starQuantity)
      .toBeTruthy();
  });

  it("does not require a star quantity for fixed-price packages", () => {
    expect(validateOrderDraft({
      ...validDraft,
      catalogItemId: "epic-10-stars",
      starQuantity: 0,
    })).toEqual({});
  });

  it("rejects unknown catalog items", () => {
    expect(validateOrderDraft({ ...validDraft, catalogItemId: "unknown" }).catalogItemId)
      .toBeTruthy();
  });

  it("enforces free-text length limits", () => {
    const errors = validateOrderDraft({
      ...validDraft,
      notes: "x".repeat(501),
    });
    expect(errors.notes).toBe("Maksimal 500 karakter.");
  });

  it("reports whether validation errors exist", () => {
    expect(hasOrderErrors({})).toBe(false);
    expect(hasOrderErrors({ notes: "invalid" })).toBe(true);
  });
});

describe("calculateOrderSummary", () => {
  it("calculates per-star summary", () => {
    expect(calculateOrderSummary("epic", 4)).toMatchObject({
      itemName: "Epic",
      subtotal: 18_000,
      bonusStars: 0,
      testimonialRewardEligible: false,
    });
  });

  it("calculates fixed package summary without multiplying", () => {
    expect(calculateOrderSummary("epic-10-stars", 99).subtotal).toBe(40_000);
  });

  it("includes progression bonus in summary without changing price", () => {
    expect(calculateOrderSummary("epic-v-to-mythic", 1)).toMatchObject({
      subtotal: 235_000,
      bonusStars: 1,
      testimonialRewardEligible: true,
    });
  });

  it("rejects unknown catalog item identifiers", () => {
    expect(() => calculateOrderSummary("unknown", 1)).toThrow(RangeError);
  });
});
