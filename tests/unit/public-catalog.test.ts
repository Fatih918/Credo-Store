import { describe, expect, it } from "vitest";
import { mapPublicCatalogRows } from "../../src/features/catalog/data/public-catalog";

describe("mapPublicCatalogRows", () => {
  it("maps active database records into the existing catalog domain types and preserves ordering", () => {
    const categories = mapPublicCatalogRows([
      {
        id: "category-fixed",
        name: "Paket Tetap",
        slug: "paket-tetap",
        description: null,
        sort_order: 20,
        subcategories: [
          {
            id: "inactive",
            category_id: "category-fixed",
            name: "Hidden",
            slug: "hidden",
            description: null,
            pricing_type: "fixed",
            promo_price: 100,
            original_price: null,
            unit_label: null,
            included_quantity: 1,
            bonus_quantity: 0,
            source_rank: null,
            target_rank: null,
            band_min: null,
            band_max: null,
            is_featured: false,
            is_active: false,
            sort_order: 0,
          },
          {
            id: "fixed-1",
            category_id: "category-fixed",
            name: "10 Stars Epic",
            slug: "epic-10-stars",
            description: "Paket sepuluh star.",
            pricing_type: "fixed",
            promo_price: 40000,
            original_price: null,
            unit_label: null,
            included_quantity: 10,
            bonus_quantity: 0,
            source_rank: null,
            target_rank: null,
            band_min: null,
            band_max: null,
            is_featured: false,
            is_active: true,
            sort_order: 10,
          },
        ],
      },
      {
        id: "category-star",
        name: "Joki Perbintang",
        slug: "joki-perbintang",
        description: null,
        sort_order: 10,
        subcategories: [
          {
            id: "star-1",
            category_id: "category-star",
            name: "Mythic Honor",
            slug: "mythic-honor",
            description: null,
            pricing_type: "per_star",
            promo_price: 12500,
            original_price: 15000,
            unit_label: "star",
            included_quantity: null,
            bonus_quantity: 0,
            source_rank: null,
            target_rank: null,
            band_min: 25,
            band_max: 50,
            is_featured: false,
            is_active: true,
            sort_order: 10,
          },
        ],
      },
    ]);

    expect(categories.map((category) => category.id)).toEqual(["joki-perbintang", "paket-tetap"]);
    expect(categories[0].items[0]).toMatchObject({
      id: "mythic-honor",
      category: "per-star",
      promoPricePerStar: 12500,
      originalPricePerStar: 15000,
      suppliedBand: "25–50 stars",
    });
    expect(categories[1].items).toEqual([
      {
        id: "epic-10-stars",
        category: "fixed-package",
        name: "10 Stars Epic",
        price: 40000,
        description: "Paket sepuluh star.",
        includedQuantity: 10,
      },
    ]);
  });

  it("maps tier progression pricing and featured state", () => {
    const categories = mapPublicCatalogRows([{
      id: "category-progression",
      name: "Progression",
      slug: "tier-progression",
      description: null,
      sort_order: 1,
      subcategories: [{
        id: "progression-1",
        category_id: "category-progression",
        name: "Epic V to Mythic",
        slug: "epic-v-to-mythic",
        description: null,
        pricing_type: "tier_progression",
        promo_price: 235000,
        original_price: null,
        unit_label: null,
        included_quantity: null,
        bonus_quantity: 1,
        source_rank: "Epic V",
        target_rank: "Mythic",
        band_min: null,
        band_max: null,
        is_featured: true,
        is_active: true,
        sort_order: 1,
      }],
    }]);

    expect(categories[0].items[0]).toMatchObject({
      id: "epic-v-to-mythic",
      category: "tier-progression",
      price: 235000,
      bonusStars: 1,
      sourceRank: "Epic V",
      targetRank: "Mythic",
      featured: "best-seller",
    });
  });

  it("omits categories without active services", () => {
    expect(mapPublicCatalogRows([{
      id: "empty",
      name: "Empty",
      slug: "empty",
      description: null,
      sort_order: 1,
      subcategories: [],
    }])).toEqual([]);
  });
});
