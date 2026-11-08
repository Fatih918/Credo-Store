"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requirePermission } from "@/features/admin/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  isValidCategoryId,
  validateCategoryDraft,
  type CategoryDraft,
} from "./category-validation";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readDraft(formData: FormData): CategoryDraft {
  const rawSortOrder = readText(formData, "sortOrder");
  return {
    name: readText(formData, "name"),
    slug: readText(formData, "slug"),
    description: readText(formData, "description"),
    sortOrder: rawSortOrder === "" ? 0 : Number(rawSortOrder),
  };
}

function finish(result: "success" | "invalid" | "failed"): never {
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  redirect(`/admin/categories?result=${result}`);
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  await requirePermission("catalog:write");
  const draft = readDraft(formData);

  if (Object.keys(validateCategoryDraft(draft)).length > 0) {
    finish("invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name: draft.name,
    slug: draft.slug,
    description: draft.description || null,
    sort_order: draft.sortOrder,
    is_active: true,
  });

  if (error) {
    finish("failed");
  }

  finish("success");
}

export async function updateCategoryAction(formData: FormData): Promise<void> {
  await requirePermission("catalog:write");
  const id = readText(formData, "categoryId");
  const draft = readDraft(formData);

  if (
    !isValidCategoryId(id) ||
    Object.keys(validateCategoryDraft(draft)).length > 0
  ) {
    finish("invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: draft.name,
      slug: draft.slug,
      description: draft.description || null,
      sort_order: draft.sortOrder,
    })
    .eq("id", id);

  if (error) {
    finish("failed");
  }

  finish("success");
}

export async function toggleCategoryActiveAction(
  formData: FormData,
): Promise<void> {
  await requirePermission("catalog:write");
  const id = readText(formData, "categoryId");
  const activeValue = readText(formData, "isActive");

  if (
    !isValidCategoryId(id) ||
    (activeValue !== "true" && activeValue !== "false")
  ) {
    finish("invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ is_active: activeValue === "true" })
    .eq("id", id);

  if (error) {
    finish("failed");
  }

  finish("success");
}
