import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnvOrNull } from "@/lib/supabase/env";
import type { CatalogItem, FixedPackage, PerStarService, TierProgressionPackage } from "../types";

type SubcategoryRow = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  pricing_type: "per_star" | "fixed" | "tier_progression";
  promo_price: number;
  original_price: number | null;
  unit_label: string | null;
  included_quantity: number | null;
  bonus_quantity: number;
  source_rank: string | null;
  target_rank: string | null;
  band_min: number | null;
  band_max: number | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  subcategories: SubcategoryRow[] | null;
};

export type PublicCatalogCategory = {
  id: string;
  title: string;
  description?: string;
  items: CatalogItem[];
};

export type PublicCatalogResult =
  | { status: "ready"; categories: PublicCatalogCategory[]; items: CatalogItem[] }
  | { status: "unavailable"; categories: []; items: [] };

function mapSubcategory(row: SubcategoryRow): CatalogItem {
  if (row.pricing_type === "per_star") {
    const item: PerStarService = {
      id: row.slug,
      category: "per-star",
      name: row.name,
      promoPricePerStar: Number(row.promo_price),
      ...(row.original_price === null ? {} : { originalPricePerStar: Number(row.original_price) }),
      ...(row.band_min === null && row.band_max === null
        ? {}
        : { suppliedBand: `${row.band_min ?? 0}–${row.band_max ?? "∞"} stars` }),
    };
    return item;
  }

  if (row.pricing_type === "fixed") {
    const item: FixedPackage = {
      id: row.slug,
      category: "fixed-package",
      name: row.name,
      price: Number(row.promo_price),
      ...(row.original_price === null ? {} : { originalPrice: Number(row.original_price) }),
      ...(row.description ? { description: row.description } : {}),
    };
    return item;
  }

  const item: TierProgressionPackage = {
    id: row.slug,
    category: "tier-progression",
    name: row.name,
    price: Number(row.promo_price),
    bonusStars: row.bonus_quantity,
    ...(row.is_featured ? { featured: "best-seller" } : {}),
  };
  return item;
}

/** Pure row mapper kept separate so database-to-domain compatibility can be unit tested. */
export function mapPublicCatalogRows(rows: CategoryRow[]): PublicCatalogCategory[] {
  return rows
    .map((category) => ({
      id: category.slug,
      title: category.name,
      ...(category.description ? { description: category.description } : {}),
      items: (category.subcategories ?? [])
        .filter((item) => item.is_active)
        .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
        .map(mapSubcategory),
    }))
    .filter((category) => category.items.length > 0)
    .sort((a, b) => {
      const left = rows.find((row) => row.slug === a.id)?.sort_order ?? 0;
      const right = rows.find((row) => row.slug === b.id)?.sort_order ?? 0;
      return left - right;
    });
}

export async function getPublicCatalog(): Promise<PublicCatalogResult> {
  try {
    if (!getSupabasePublicEnvOrNull()) {
      return { status: "unavailable", categories: [], items: [] };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, sort_order, subcategories(id, category_id, name, slug, description, pricing_type, promo_price, original_price, unit_label, included_quantity, bonus_quantity, source_rank, target_rank, band_min, band_max, is_featured, is_active, sort_order)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data) {
      return { status: "unavailable", categories: [], items: [] };
    }

    const categories = mapPublicCatalogRows(data as unknown as CategoryRow[]);
    return {
      status: "ready",
      categories,
      items: categories.flatMap((category) => category.items),
    };
  } catch {
    return { status: "unavailable", categories: [], items: [] };
  }
}
