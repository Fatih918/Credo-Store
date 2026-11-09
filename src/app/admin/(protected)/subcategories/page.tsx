import { requirePermission } from "@/features/admin/auth/authorization";
import { hasAdminPermission } from "@/features/admin/auth/permissions";
import {
  createSubcategoryAction,
  toggleSubcategoryActiveAction,
  updateSubcategoryAction,
} from "@/features/admin/catalog/subcategory-actions";
import { createClient } from "@/lib/supabase/server";

interface AdminSubcategoriesPageProps {
  searchParams: Promise<{ result?: string }>;
}

function money(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function SubcategoryFields({
  item,
  categories,
}: {
  item?: {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    description: string | null;
    pricing_type: "per_star" | "fixed" | "tier_progression";
    promo_price: number;
    original_price: number | null;
    included_quantity: number | null;
    bonus_quantity: number;
    source_rank: string | null;
    target_rank: string | null;
    band_min: number | null;
    band_max: number | null;
    is_featured: boolean;
    sort_order: number;
  };
  categories: Array<{ id: string; name: string }>;
}) {
  return (
    <>
      {item && <input type="hidden" name="subcategoryId" value={item.id} />}
      <label className="grid gap-1 text-xs text-zinc-400">Kategori
        <select name="categoryId" required defaultValue={item?.category_id ?? categories[0]?.id} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white">
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Nama
        <input name="name" required maxLength={120} defaultValue={item?.name ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Slug
        <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} defaultValue={item?.slug ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Jenis harga
        <select name="pricingType" defaultValue={item?.pricing_type ?? "per_star"} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white">
          <option value="per_star">Per star</option>
          <option value="fixed">Harga tetap</option>
          <option value="tier_progression">Tier progression</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Harga promo (Rp)
        <input name="promoPrice" type="number" min={0} step={1} required defaultValue={item?.promo_price ?? 0} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Harga asli (opsional)
        <input name="originalPrice" type="number" min={0} step={1} defaultValue={item?.original_price ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Jumlah termasuk (khusus paket tetap)
        <input name="includedQuantity" type="number" min={1} step={1} defaultValue={item?.included_quantity ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Bonus quantity (tier progression)
        <input name="bonusQuantity" type="number" min={0} step={1} defaultValue={item?.bonus_quantity ?? 0} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Rank asal (tier progression)
        <input name="sourceRank" maxLength={80} defaultValue={item?.source_rank ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Rank tujuan (tier progression)
        <input name="targetRank" maxLength={80} defaultValue={item?.target_rank ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Batas star minimum (per star)
        <input name="bandMin" type="number" min={0} step={1} defaultValue={item?.band_min ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Batas star maksimum (per star)
        <input name="bandMax" type="number" min={0} step={1} defaultValue={item?.band_max ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400">Urutan tampil
        <input name="sortOrder" type="number" min={0} max={100000} step={1} defaultValue={item?.sort_order ?? 0} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="grid gap-1 text-xs text-zinc-400 sm:col-span-2">Deskripsi
        <textarea name="description" maxLength={1000} rows={2} defaultValue={item?.description ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
        <input type="checkbox" name="isFeatured" value="true" defaultChecked={item?.is_featured ?? false} />
        Tandai sebagai unggulan / Best Seller
      </label>
    </>
  );
}

export default async function AdminSubcategoriesPage({ searchParams }: AdminSubcategoriesPageProps) {
  const admin = await requirePermission("catalog:read");
  const { result } = await searchParams;
  const supabase = await createClient();
  const [{ data: categories, error: categoriesError }, { data: subcategories, error: subcategoriesError }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order").order("name"),
    supabase.from("subcategories").select("id, category_id, name, slug, description, pricing_type, promo_price, original_price, included_quantity, bonus_quantity, source_rank, target_rank, band_min, band_max, is_featured, is_active, sort_order").order("category_id").order("sort_order").order("name"),
  ]);

  if (categoriesError || subcategoriesError) throw new Error("Unable to load catalog subcategories.");
  const categoryList = categories ?? [];
  const items = subcategories ?? [];
  const categoryNames = new Map(categoryList.map((category) => [category.id, category.name]));
  const canWrite = hasAdminPermission(admin.role, "catalog:write");

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-400">Catalog</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Manajemen subkategori & harga</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
        Kelola layanan, harga promo, harga asli, rentang star, bonus, dan urutan tampil. Nilai harga disimpan sebagai rupiah integer.
        Form ini mengikuti bentuk data database; jenis harga menentukan kolom mana yang digunakan.
      </p>

      {result === "success" && <p role="status" className="mt-5 rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">Perubahan subkategori berhasil disimpan.</p>}
      {result === "invalid" && <p role="alert" className="mt-5 rounded-lg border border-amber-900 bg-amber-950/40 p-3 text-sm text-amber-300">Input tidak valid atau tidak sesuai dengan jenis harga yang dipilih.</p>}
      {result === "failed" && <p role="alert" className="mt-5 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">Operasi gagal. Periksa slug duplikat, kategori, atau constraint database.</p>}

      {categoryList.length === 0 ? (
        <p className="mt-8 rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">Buat kategori terlebih dahulu sebelum menambahkan layanan.</p>
      ) : (
        <>
          {canWrite && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-lg font-semibold text-white">Tambah layanan</h2>
              <form action={createSubcategoryAction} className="mt-5 grid gap-4 sm:grid-cols-2">
                <SubcategoryFields categories={categoryList} />
                <div className="sm:col-span-2"><button type="submit" className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500">Tambah layanan</button></div>
              </form>
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="font-semibold text-white">Daftar layanan</h2>
              <p className="mt-1 text-xs text-zinc-500">{items.length} subkategori</p>
            </div>
            {items.length === 0 ? <p className="px-6 py-8 text-sm text-zinc-400">Belum ada layanan.</p> : (
              <div className="divide-y divide-zinc-800">
                {items.map((item) => (
                  <article key={item.id} className="grid gap-4 px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-fuchsia-300">{categoryNames.get(item.category_id) ?? "Kategori tidak ditemukan"} · {item.pricing_type}</p>
                        <h3 className="mt-1 font-semibold text-white">{item.name}</h3>
                        <p className="mt-1 text-sm text-zinc-300">{money(item.promo_price)}{item.pricing_type === "per_star" ? " / star" : ""}{item.original_price !== null ? <span className="ml-2 text-xs text-zinc-500 line-through">{money(item.original_price)}</span> : null}</p>
                        <p className="mt-1 text-xs text-zinc-500">/{item.slug} · Urutan {item.sort_order} · {item.is_active ? "Aktif" : "Nonaktif"}{item.is_featured ? " · Unggulan" : ""}</p>
                      </div>
                      {canWrite && <form action={toggleSubcategoryActiveAction}>
                        <input type="hidden" name="subcategoryId" value={item.id} />
                        <input type="hidden" name="isActive" value={String(!item.is_active)} />
                        <button type="submit" className="text-sm text-fuchsia-300 hover:text-fuchsia-200">{item.is_active ? "Nonaktifkan" : "Aktifkan"}</button>
                      </form>}
                    </div>
                    {canWrite && (
                      <details className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                        <summary className="cursor-pointer text-sm font-medium text-zinc-200">Edit layanan dan harga</summary>
                        <form action={updateSubcategoryAction} className="mt-4 grid gap-4 sm:grid-cols-2">
                          <SubcategoryFields item={item} categories={categoryList} />
                          <div className="sm:col-span-2"><button type="submit" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-fuchsia-400">Simpan perubahan</button></div>
                        </form>
                      </details>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
