export const PRICING_TYPES = ["per_star", "fixed", "tier_progression"] as const;
export type PricingType = (typeof PRICING_TYPES)[number];

export interface SubcategoryDraft {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  pricingType: PricingType;
  promoPrice: number;
  originalPrice: number | null;
  includedQuantity: number | null;
  bonusQuantity: number;
  sourceRank: string;
  targetRank: string;
  bandMin: number | null;
  bandMax: number | null;
  isFeatured: boolean;
  cardImageUrl: string;
  cardBadge: string;
  cardDescription: string;
  sortOrder: number;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CARD_IMAGE_PATH_PATTERN = /^\/img\/[A-Za-z0-9._/-]+$/;

export function isValidSubcategoryId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function validateSubcategoryDraft(draft: SubcategoryDraft): string[] {
  const errors: string[] = [];

  if (!isValidSubcategoryId(draft.categoryId)) errors.push("categoryId");
  if (!draft.name.trim() || draft.name.length > 120) errors.push("name");
  if (!SLUG_PATTERN.test(draft.slug) || draft.slug.length > 120) errors.push("slug");
  if (draft.description.length > 1000) errors.push("description");
  if (draft.cardImageUrl && (draft.cardImageUrl.length > 500 || !CARD_IMAGE_PATH_PATTERN.test(draft.cardImageUrl) || draft.cardImageUrl.split("/").includes(".."))) errors.push("cardImageUrl");
  if (draft.cardBadge.length > 40) errors.push("cardBadge");
  if (draft.cardDescription.length > 240) errors.push("cardDescription");
  if (!PRICING_TYPES.includes(draft.pricingType)) errors.push("pricingType");
  if (!Number.isSafeInteger(draft.promoPrice) || draft.promoPrice < 0) errors.push("promoPrice");
  if (draft.originalPrice !== null && (!Number.isSafeInteger(draft.originalPrice) || draft.originalPrice < 0)) errors.push("originalPrice");
  if (!Number.isSafeInteger(draft.bonusQuantity) || draft.bonusQuantity < 0) errors.push("bonusQuantity");
  if (!Number.isInteger(draft.sortOrder) || draft.sortOrder < 0 || draft.sortOrder > 100000) errors.push("sortOrder");

  if (draft.pricingType === "per_star") {
    if (draft.includedQuantity !== null || draft.bonusQuantity !== 0) errors.push("perStarShape");
    if (draft.bandMin !== null && (!Number.isInteger(draft.bandMin) || draft.bandMin < 0)) errors.push("bandMin");
    if (draft.bandMax !== null && (!Number.isInteger(draft.bandMax) || draft.bandMax < 0)) errors.push("bandMax");
    if (draft.bandMin !== null && draft.bandMax !== null && draft.bandMin > draft.bandMax) errors.push("bandOrder");
  } else if (draft.pricingType === "fixed") {
    if (draft.includedQuantity !== null && (!Number.isInteger(draft.includedQuantity) || draft.includedQuantity <= 0)) errors.push("includedQuantity");
    if (draft.bonusQuantity !== 0 || draft.sourceRank || draft.targetRank || draft.bandMin !== null || draft.bandMax !== null) errors.push("fixedShape");
  } else if (draft.pricingType === "tier_progression") {
    if (
      !draft.sourceRank.trim() ||
      !draft.targetRank.trim() ||
      draft.sourceRank.length > 80 ||
      draft.targetRank.length > 80
    ) errors.push("rank");
    if (draft.includedQuantity !== null || draft.bandMin !== null || draft.bandMax !== null) errors.push("tierShape");
  }

  return errors;
}
