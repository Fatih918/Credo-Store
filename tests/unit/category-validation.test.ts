import { describe, expect, it } from "vitest";

import {
  isValidCategoryId,
  validateCategoryDraft,
} from "../../src/features/admin/catalog/category-validation";

const validDraft = {
  name: "Joki Perbintang",
  slug: "joki-perbintang",
  description: "Layanan joki.",
  sortOrder: 10,
};

describe("validateCategoryDraft", () => {
  it("accepts a valid category", () => {
    expect(validateCategoryDraft(validDraft)).toEqual({});
  });

  it("rejects empty or oversized names", () => {
    expect(validateCategoryDraft({ ...validDraft, name: "" }).name).toBeTruthy();
    expect(validateCategoryDraft({ ...validDraft, name: "x".repeat(101) }).name).toBeTruthy();
  });

  it("requires a lowercase URL-safe slug", () => {
    expect(validateCategoryDraft({ ...validDraft, slug: "Joki Perbintang" }).slug).toBeTruthy();
    expect(validateCategoryDraft({ ...validDraft, slug: "joki-perbintang" }).slug).toBeUndefined();
  });

  it("rejects oversized descriptions and invalid ordering", () => {
    expect(validateCategoryDraft({ ...validDraft, description: "x".repeat(1001) }).description).toBeTruthy();
    expect(validateCategoryDraft({ ...validDraft, sortOrder: 1.5 }).sortOrder).toBeTruthy();
    expect(validateCategoryDraft({ ...validDraft, sortOrder: -1 }).sortOrder).toBeTruthy();
  });
});

describe("isValidCategoryId", () => {
  it("accepts UUIDs and rejects arbitrary input", () => {
    expect(isValidCategoryId("10000000-0000-4000-8000-000000000001")).toBe(true);
    expect(isValidCategoryId("not-a-uuid")).toBe(false);
  });
});
