import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { CatalogCard } from "@/features/catalog/components/catalog-card";
import { catalogItems } from "@/features/catalog/data/catalog";

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
};

const groups = [
  { title: "Layanan Per Star", description: "Pilih tier dan tentukan jumlah star pada halaman detail.", category: "per-star" },
  { title: "Paket Harga Tetap", description: "Paket dengan harga yang sudah ditentukan.", category: "fixed-package" },
  { title: "Tier Progression", description: "Paket perjalanan rank dengan bonus star.", category: "tier-progression" },
] as const;

export default function PackagesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#08070d] text-white">
      <SiteHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.25em] text-fuchsia-300">CREDO STORE / CATALOG</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Pilihan Paket</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
            Pilih layanan yang sesuai dengan target kamu. Buka salah satu paket untuk melihat detail dan mengisi pesanan.
          </p>
        </div>
        <div className="mt-10 space-y-12">
          {groups.map((group) => {
            const items = catalogItems.filter((item) => item.category === group.category);
            return (
              <section key={group.category} aria-labelledby={`group-${group.category}`}>
                <div className="mb-5">
                  <h2 id={`group-${group.category}`} className="text-xl font-bold">{group.title}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{group.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => <CatalogCard key={item.id} item={item} />)}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-zinc-500">
        Credo Store · Detail layanan dan pemesanan dikonfirmasi melalui WhatsApp.
      </footer>
    </main>
  );
}
