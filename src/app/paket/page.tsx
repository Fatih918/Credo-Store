import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { CatalogCard } from "@/features/catalog/components/catalog-card";
import { getPublicCatalog } from "@/features/catalog/data/public-catalog";

const pageDescription =
  "Jelajahi layanan per star, paket harga tetap, dan tier progression Credo Store.";

export const metadata: Metadata = {
  title: "Pilihan Paket",
  description: pageDescription,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Credo Store",
    title: "Pilihan Paket | Credo Store",
    description: pageDescription,
  },
  twitter: {
    card: "summary",
    title: "Pilihan Paket | Credo Store",
    description: pageDescription,
  },
};

export default async function PackagesPage() {
  const catalog = await getPublicCatalog();

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#08070d] text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.25em] text-fuchsia-300">CREDO STORE / CATALOG</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Pilihan Paket</h1>
            <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
              Pilih layanan yang sesuai dengan target kamu. Buka salah satu paket untuk melihat detail dan mengisi pesanan.
            </p>
          </div>

          {catalog.status === "unavailable" ? (
            <div role="alert" className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
              <h2 className="font-bold text-amber-200">Katalog belum dapat dimuat</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Data katalog sedang tidak tersedia. Silakan muat ulang beberapa saat lagi atau hubungi toko melalui WhatsApp.
              </p>
            </div>
          ) : catalog.categories.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
              Belum ada layanan aktif yang tersedia.
            </p>
          ) : (
            <div className="mt-10 space-y-12">
              {catalog.categories.map((category) => (
                <section key={category.id} aria-labelledby={`group-${category.id}`}>
                  <div className="mb-5">
                    <h2 id={`group-${category.id}`} className="text-xl font-bold">{category.title}</h2>
                    {category.description ? <p className="mt-1 text-sm text-zinc-500">{category.description}</p> : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => <CatalogCard key={item.id} item={item} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-zinc-500">
        Credo Store · Detail layanan dan pemesanan dikonfirmasi melalui WhatsApp.
      </footer>
    </>
  );
}
