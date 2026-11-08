import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { catalogItems } from "@/features/catalog/data/catalog";
import type { CatalogItem } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/currency";
import { OrderForm } from "@/features/order/components/order-form";

function getItem(id: string): CatalogItem | undefined {
  return catalogItems.find((item) => item.id === id);
}

export function generateStaticParams() {
  return catalogItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getItem(id);
  return item ? { title: item.name, description: `Detail layanan ${item.name} dari Credo Store.` } : { title: "Paket tidak ditemukan" };
}

function priceFor(item: CatalogItem) {
  return item.category === "per-star"
    ? `${formatRupiah(item.promoPricePerStar)} / star`
    : formatRupiah(item.price);
}

function originalFor(item: CatalogItem) {
  if (item.category === "per-star") return item.originalPricePerStar;
  if (item.category === "fixed-package") return item.originalPrice;
  return undefined;
}

function descriptionFor(item: CatalogItem) {
  if (item.category === "per-star") {
    return `Layanan penambahan star untuk tier ${item.name}. Harga dihitung berdasarkan jumlah star yang kamu masukkan pada formulir pesanan.`;
  }
  if (item.category === "fixed-package") {
    return item.description ?? `Paket ${item.name} dengan harga tetap sesuai katalog Credo Store.`;
  }
  return `Layanan progression dari ${item.name}. Paket ini mencakup bonus +${item.bonusStars} star.`;
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getItem(id);
  if (!item) notFound();
  const originalPrice = originalFor(item);

  return (
    <main className="min-h-screen bg-[#08070d] text-white">
      <SiteHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link href="/paket" className="text-sm font-medium text-fuchsia-300 transition hover:text-fuchsia-200">← Kembali ke pilihan paket</Link>
        <div className="mt-7 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#241332] to-[#100d17] p-6 sm:p-8">
            <p className="text-xs font-bold tracking-[0.2em] text-fuchsia-300">DETAIL PAKET</p>
            <h1 className="mt-4 text-2xl font-black sm:text-3xl">{item.name}</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{descriptionFor(item)}</p>
            <div className="mt-7 border-t border-white/10 pt-6">
              {originalPrice ? <p className="text-sm text-zinc-500 line-through">{formatRupiah(originalPrice)}{item.category === "per-star" ? " / star" : ""}</p> : null}
              <p className="mt-1 text-3xl font-black text-white">{priceFor(item)}</p>
              {item.category === "per-star" ? <p className="mt-2 text-xs text-zinc-500">Subtotal mengikuti jumlah star yang dipilih.</p> : null}
              {item.category === "tier-progression" ? <p className="mt-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">Bonus +{item.bonusStars} star</p> : null}
              {item.category === "fixed-package" && item.id === "placement-mythic-10-matches" ? <p className="mt-2 text-xs text-zinc-400">Termasuk seluruh 10 pertandingan.</p> : null}
            </div>
            <div className="mt-8 rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/5 p-4 text-xs leading-6 text-zinc-300">
              Request hero/role dan win rate/win streak dapat disampaikan pada formulir. Permintaan akan dikonfirmasi berdasarkan kelayakan, bukan jaminan hasil.
            </div>
          </section>
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.2em] text-fuchsia-300">ISI DETAIL PESANAN</p>
              <h2 className="mt-2 text-2xl font-bold">Form pemesanan</h2>
              <p className="mt-2 text-sm text-zinc-400">Periksa layanan dan isi informasi yang ingin kamu sampaikan.</p>
            </div>
            <OrderForm catalogItemId={item.id} />
          </section>
        </div>
      </div>
    </main>
  );
}
