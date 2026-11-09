import { catalogItems } from "../catalog/data/catalog";
import type { CatalogItem } from "../catalog/types";
import type { OrderDraft, OrderFieldErrors } from "./types";

const MAX_LENGTHS = {
  nickname: 40,
  userId: 30,
  serverId: 20,
  heroOrRoleRequest: 120,
  winRateOrStreakRequest: 160,
  notes: 500,
} as const;

export function validateOrderDraft(draft: OrderDraft, catalogItem?: CatalogItem): OrderFieldErrors {
  const errors: OrderFieldErrors = {};
  const selectedItem = catalogItem
    ? (catalogItem.id === draft.catalogItemId ? catalogItem : undefined)
    : catalogItems.find((item) => item.id === draft.catalogItemId);

  if (!selectedItem) errors.catalogItemId = "Pilih layanan yang tersedia.";

  if (
    selectedItem?.category === "per-star" &&
    (!Number.isSafeInteger(draft.starQuantity) || draft.starQuantity <= 0)
  ) {
    errors.starQuantity = "Jumlah star harus berupa bilangan bulat positif.";
  }

  for (const [field, maxLength] of Object.entries(MAX_LENGTHS)) {
    const value = draft[field as keyof typeof MAX_LENGTHS];
    if (value.length > maxLength) errors[field as keyof typeof MAX_LENGTHS] = `Maksimal ${maxLength} karakter.`;
  }

  return errors;
}

export function hasOrderErrors(errors: OrderFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
