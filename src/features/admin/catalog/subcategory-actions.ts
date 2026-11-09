"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requirePermission } from "@/features/admin/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  isValidSubcategoryId,
  validateSubcategoryDraft,
  type PricingType,
  type SubcategoryDraft,
} from "./subcategory-validation";

function textValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function requiredInteger(value: string): number {
  if (!value) return Number.NaN;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : Number.NaN;
}

function optionalInteger(value: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : Number.NaN;
}

function readDraft(formData: FormData): SubcategoryDraft {
  const pricingType = textValue(formData, "pricingType") as PricingType;
  return {
    categoryId: textValue(formData, "categoryId"),
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug"),
    description: textValue(formData, "description"),
    pricingType,
    promoPrice: requiredInteger(textValue(formData, "promoPrice")),
    originalPrice: optionalInteger(textValue(formData, "originalPrice")),
    includedQuantity: pricingType === "fixed"
      ? optionalInteger(textValue(formData, "includedQuantity"))
      : null,
    bonusQuantity: pricingType === "tier_progression"
      ? Number(textValue(formData, "bonusQuantity") || "0")
      : 0,
    sourceRank: pricingType === "tier_progression" ? textValue(formData, "sourceRank") : "",
    targetRank: pricingType === "tier_progression" ? textValue(formData, "targetRank") : "",
    bandMin: pricingType === "per_star" ? optionalInteger(textValue(formData, "bandMin")) : null,
    bandMax: pricingType === "per_star" ? optionalInteger(textValue(formData, "bandMax")) : null,
    isFeatured: textValue(formData, "isFeatured") === "true",
    sortOrder: Number(textValue(formData, "sortOrder") || "0"),
  };
}

function finish(result: "success" | "invalid" | "failed"): never {
  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  redirect(`/admin/subcategories?result=${result}`);
}

function toDatabaseRow(draft: SubcategoryDraft) {
  return {
    category_id: draft.categoryId,
    name: draft.name,
    slug: draft.slug,
    description: draft.description || null,
    pricing_type: draft.pricingType,
    promo_price: draft.promoPrice,
    original_price: draft.originalPrice,
    unit_label: draft.pricingType === "per_star" ? "star" : null,
    included_quantity: draft.pricingType === "fixed" ? draft.includedQuantity : null,
    bonus_quantity: draft.pricingType === "tier_progression" ? draft.bonusQuantity : 0,
    source_rank: draft.pricingType === "tier_progression" ? draft.sourceRank : null,
    target_rank: draft.pricingType === "tier_progression" ? draft.targetRank : null,
    band_min: draft.pricingType === "per_star" ? draft.bandMin : null,
    band_max: draft.pricingType === "per_star" ? draft.bandMax : null,
    is_featured: draft.isFeatured,
    sort_order: draft.sortOrder,
  };
}

export async function createSubcategoryAction(formData: FormData): Promise<void> {
  await requirePermission("catalog:write");
  const draft = readDraft(formData);
  if (validateSubcategoryDraft(draft).length > 0) finish("invalid");

  const supabase = await createClient();
  const { error } = await supabase.from("subcategories").insert({
    ...toDatabaseRow(draft),
    is_active: true,
  });
  if (error) finish("failed");
  finish("success");
}

export async function updateSubcategoryAction(formData: FormData): Promise<void> {
  await requirePermission("catalog:write");
  const id = textValue(formData, "subcategoryId");
  const draft = readDraft(formData);
  if (!isValidSubcategoryId(id) || validateSubcategoryDraft(draft).length > 0) finish("invalid");

  const supabase = await createClient();
  const { error } = await supabase
    .from("subcategories")
    .update(toDatabaseRow(draft))
    .eq("id", id);
  if (error) finish("failed");
  finish("success");
}

export async function toggleSubcategoryActiveAction(formData: FormData): Promise<void> {
  await requirePermission("catalog:write");
  const id = textValue(formData, "subcategoryId");
  const activeValue = textValue(formData, "isActive");
  if (!isValidSubcategoryId(id) || (activeValue !== "true" && activeValue !== "false")) {
    finish("invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("subcategories")
    .update({ is_active: activeValue === "true" })
    .eq("id", id);
  if (error) finish("failed");
  finish("success");
}
