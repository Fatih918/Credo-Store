export interface CategoryDraft {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface CategoryValidationErrors {
  name?: string;
  slug?: string;
  description?: string;
  sortOrder?: string;
}

export function validateCategoryDraft(
  draft: CategoryDraft,
): CategoryValidationErrors {
  const errors: CategoryValidationErrors = {};

  if (draft.name.length < 1 || draft.name.length > 100) {
    errors.name = "Nama kategori wajib diisi (maksimal 100 karakter).";
  }

  if (
    draft.slug.length < 1 ||
    draft.slug.length > 100 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)
  ) {
    errors.slug = "Slug harus berupa huruf kecil, angka, dan tanda hubung.";
  }

  if (draft.description.length > 1000) {
    errors.description = "Deskripsi maksimal 1000 karakter.";
  }

  if (
    !Number.isSafeInteger(draft.sortOrder) ||
    draft.sortOrder < 0 ||
    draft.sortOrder > 100_000
  ) {
    errors.sortOrder = "Urutan harus berupa bilangan bulat 0–100000.";
  }

  return errors;
}

export function isValidCategoryId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
