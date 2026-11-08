import { requirePermission } from "@/features/admin/auth/authorization";
import { hasAdminPermission } from "@/features/admin/auth/permissions";
import {
  createCategoryAction,
  toggleCategoryActiveAction,
  updateCategoryAction,
} from "@/features/admin/catalog/category-actions";
import { createClient } from "@/lib/supabase/server";

interface AdminCategoriesPageProps {
  searchParams: Promise<{ result?: string }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const admin = await requirePermission("catalog:read");
  const { result } = await searchParams;
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, is_active, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load catalog categories.");
  }

  const canWrite = hasAdminPermission(admin.role, "catalog:write");

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-400">
        Catalog
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        Manajemen kategori
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        Kelola kelompok layanan yang ditampilkan pada katalog Credo Store.
        Kategori yang dinonaktifkan tidak ditampilkan kepada pengunjung.
      </p>

      {result === "success" && (
        <p role="status" className="mt-5 rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          Perubahan kategori berhasil disimpan.
        </p>
      )}
      {result === "invalid" && (
        <p role="alert" className="mt-5 rounded-lg border border-amber-900 bg-amber-950/40 p-3 text-sm text-amber-300">
          Input tidak valid. Periksa nama, slug, dan urutan kategori.
        </p>
      )}
      {result === "failed" && (
        <p role="alert" className="mt-5 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          Operasi gagal. Periksa kemungkinan slug sudah digunakan atau koneksi database.
        </p>
      )}

      {canWrite && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white">Tambah kategori</h2>
          <form action={createCategoryAction} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-zinc-300">
              Nama kategori
              <input name="name" required maxLength={100} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400" />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Slug
              <input name="slug" required maxLength={100} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400" />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300 sm:col-span-2">
              Deskripsi
              <textarea name="description" maxLength={1000} rows={3} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400" />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Urutan tampil
              <input name="sortOrder" type="number" min={0} max={100000} step={1} defaultValue={0} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400" />
            </label>
            <div className="flex items-end">
              <button type="submit" className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500">
                Tambah kategori
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="font-semibold text-white">Daftar kategori</h2>
          <p className="mt-1 text-xs text-zinc-500">{categories.length} kategori</p>
        </div>
        {categories.length === 0 ? (
          <p className="px-6 py-8 text-sm text-zinc-400">Belum ada kategori.</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {categories.map((category) => (
              <article key={category.id} className="grid gap-4 px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="mt-1 text-xs text-zinc-500">/{category.slug} · Urutan {category.sort_order}</p>
                  </div>
                  <span className={category.is_active ? "rounded-full bg-emerald-950 px-3 py-1 text-xs text-emerald-300" : "rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"}>
                    {category.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {category.description && (
                  <p className="text-sm text-zinc-400">{category.description}</p>
                )}
                {canWrite && (
                  <div className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                    <form action={updateCategoryAction} className="grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="categoryId" value={category.id} />
                      <label className="grid gap-1 text-xs text-zinc-400">
                        Nama
                        <input name="name" required maxLength={100} defaultValue={category.name} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-400" />
                      </label>
                      <label className="grid gap-1 text-xs text-zinc-400">
                        Slug
                        <input name="slug" required maxLength={100} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={category.slug} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-400" />
                      </label>
                      <label className="grid gap-1 text-xs text-zinc-400 sm:col-span-2">
                        Deskripsi
                        <textarea name="description" maxLength={1000} rows={2} defaultValue={category.description ?? ""} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-400" />
                      </label>
                      <label className="grid gap-1 text-xs text-zinc-400">
                        Urutan
                        <input name="sortOrder" type="number" min={0} max={100000} step={1} defaultValue={category.sort_order} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-400" />
                      </label>
                      <div className="flex items-end">
                        <button type="submit" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-fuchsia-400">
                          Simpan perubahan
                        </button>
                      </div>
                    </form>
                    <form action={toggleCategoryActiveAction}>
                      <input type="hidden" name="categoryId" value={category.id} />
                      <input type="hidden" name="isActive" value={String(!category.is_active)} />
                      <button type="submit" className="text-sm text-fuchsia-300 hover:text-fuchsia-200">
                        {category.is_active ? "Nonaktifkan kategori" : "Aktifkan kategori"}
                      </button>
                    </form>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
