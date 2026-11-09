import { describe, expect, it } from "vitest";

import {
  isValidSubcategoryId,
  validateSubcategoryDraft,
  type SubcategoryDraft,
} from "../../src/features/admin/catalog/subcategory-validation";

const baseDraft: SubcategoryDraft = {
  categoryId: "10000000-0000-4000-8000-000000000001",
  name: "Epic",
  slug: "epic",
  description: "",
  pricingType: "per_star",
  promoPrice: 4500,
  originalPrice: 6000,
  includedQuantity: null,
  bonusQuantity: 0,
  sourceRank: "",
  targetRank: "",
  bandMin: null,
  bandMax: null,
  isFeatured: false,
  cardImageUrl: "",
  cardBadge: "",
  cardDescription: "",
  sortOrder: 10,
};

describe("validateSubcategoryDraft", () => {
  it("accepts a valid per-star service", () => {
    expect(validateSubcategoryDraft(baseDraft)).toEqual([]);
  });

  it("accepts fixed packages with an optional included quantity", () => {
    expect(validateSubcategoryDraft({
      ...baseDraft,
      pricingType: "fixed",
      includedQuantity: 10,
      originalPrice: null,
    })).toEqual([]);
  });

  it("accepts tier progression packages with source, target, and bonus", () => {
    expect(validateSubcategoryDraft({
      ...baseDraft,
      pricingType: "tier_progression",
      includedQuantity: null,
      originalPrice: null,
      bonusQuantity: 1,
      sourceRank: "Epic V",
      targetRank: "Mythic",
    })).toEqual([]);
  });

  it("rejects unsafe prices, malformed slugs, and invalid ranges", () => {
    expect(validateSubcategoryDraft({ ...baseDraft, promoPrice: Number.NaN })).toContain("promoPrice");
    expect(validateSubcategoryDraft({ ...baseDraft, slug: "Epic Service" })).toContain("slug");
    expect(validateSubcategoryDraft({ ...baseDraft, bandMin: 50, bandMax: 25 })).toContain("bandOrder");
  });

  it("accepts local card artwork paths and optional card copy", () => {
    expect(validateSubcategoryDraft({ ...baseDraft, cardImageUrl: "/img/epic_rank.png", cardBadge: "PROMO", cardDescription: "Custom card copy" })).toEqual([]);
  });

  it("rejects external, traversing, or oversized card presentation values", () => {
    expect(validateSubcategoryDraft({ ...baseDraft, cardImageUrl: "https://example.com/image.png" })).toContain("cardImageUrl");
    expect(validateSubcategoryDraft({ ...baseDraft, cardImageUrl: "/img/../secret.png" })).toContain("cardImageUrl");
    expect(validateSubcategoryDraft({ ...baseDraft, cardBadge: "x".repeat(41) })).toContain("cardBadge");
    expect(validateSubcategoryDraft({ ...baseDraft, cardDescription: "x".repeat(241) })).toContain("cardDescription");
  });

  it("rejects fields that conflict with the selected pricing type", () => {
    expect(validateSubcategoryDraft({ ...baseDraft, pricingType: "fixed", bonusQuantity: 1 })).toContain("fixedShape");
    expect(validateSubcategoryDraft({ ...baseDraft, pricingType: "per_star", bonusQuantity: 1 })).toContain("perStarShape");
  });
});

describe("isValidSubcategoryId", () => {
  it("accepts UUIDs and rejects arbitrary values", () => {
    expect(isValidSubcategoryId(baseDraft.categoryId)).toBe(true);
    expect(isValidSubcategoryId("invalid")).toBe(false);
  });
});
