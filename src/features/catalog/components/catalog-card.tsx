import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "../types";
import { getRankArtwork } from "../rank-artwork";
import { formatRupiah } from "../../../lib/currency";

function priceLabel(item: CatalogItem) {
  if (item.category === "per-star") return `${formatRupiah(item.promoPricePerStar)} / star`;
  return formatRupiah(item.price);
}

function originalPrice(item: CatalogItem) {
  if (item.category === "per-star") return item.originalPricePerStar;
  if (item.category === "fixed-package") return item.originalPrice;
  return undefined;
}

function categoryLabel(item: CatalogItem) {
  if (item.category === "per-star") return "HARGA PER STAR";
  if (item.category === "fixed-package") return "PAKET HARGA TETAP";
  return "TIER PROGRESSION";
}

export function CatalogCard({ item }: { item: CatalogItem }) {
  const oldPrice = originalPrice(item);
  const artwork = getRankArtwork(item);
  const badge = item.cardBadge || (item.category === "tier-progression" && item.featured === "best-seller" ? "BEST SELLER" : null);
  const cardDescription = item.cardDescription || (item.category === "fixed-package" ? item.description ?? (item.includedQuantity ? `Termasuk ${item.includedQuantity} unit.` : null) : item.category === "per-star" ? item.suppliedBand : `Bonus +${item.bonusStars} star`);

  return (
    <Link
      href={`/paket/${item.id}`}
      className="group relative flex min-h-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1426] via-[#111019] to-[#0b0a10] p-5 transition duration-200 hover:-translate-y-1 hover:border-fuchsia-400/60 hover:shadow-[0_16px_50px_rgba(168,85,247,0.12)]"
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl transition group-hover:bg-fuchsia-500/20" />
      <div className="relative flex items-start justify-between gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] text-fuchsia-300">{categoryLabel(item)}</span>
        {badge ? (
          <span className="max-w-36 rounded-full bg-fuchsia-500 px-2.5 py-1 text-[10px] font-bold text-white">{badge}</span>
        ) : null}
      </div>
      {artwork ? (
        <div className="relative mx-auto mt-3 flex h-36 w-full max-w-[220px] items-center justify-center sm:h-40">
          <Image
            src={artwork.src}
            alt={artwork.alt}
            width={220}
            height={220}
            className="h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(168,85,247,0.16)]"
          />
        </div>
      ) : null}
      <h3 className="relative mt-3 text-lg font-bold text-white">{item.name}</h3>
      {cardDescription ? <p className="relative mt-2 line-clamp-2 text-sm text-zinc-400">{cardDescription}</p> : null}
      <div className="relative mt-auto flex items-end justify-between gap-3 pt-7">
        <div>
          {oldPrice ? <p className="text-xs text-zinc-500 line-through">{formatRupiah(oldPrice)}{item.category === "per-star" ? " / star" : ""}</p> : null}
          <p className="mt-1 text-xl font-extrabold text-white">{priceLabel(item)}</p>
        </div>
        <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-lg text-fuchsia-200 transition group-hover:border-fuchsia-300 group-hover:bg-fuchsia-500 group-hover:text-white">↗</span>
      </div>
    </Link>
  );
}
