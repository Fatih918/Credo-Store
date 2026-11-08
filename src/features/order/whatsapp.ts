import { catalogItems } from "../catalog/data/catalog";
import { formatRupiah } from "../../lib/currency";
import { hasOrderErrors, validateOrderDraft } from "./validation";
import type { OrderDraft } from "./types";
import type { OrderPriceSummary } from "./order-pricing";
import { storeConfig } from "../../config/store";

function appendOptionalLine(lines: string[], label: string, value: string) {
  const normalized = value.trim();
  if (normalized) lines.push(`${label}: ${normalized}`);
}

export function buildWhatsAppMessage(
  draft: OrderDraft,
  summary: OrderPriceSummary,
): string {
  const errors = validateOrderDraft(draft);
  if (hasOrderErrors(errors)) {
    throw new RangeError("Pesanan harus valid sebelum dibuatkan pesan WhatsApp.");
  }

  const item = catalogItems.find((candidate) => candidate.id === draft.catalogItemId);
  if (!item) {
    throw new RangeError("Layanan pesanan tidak ditemukan.");
  }

  const lines = [
    `Halo ${storeConfig.name}, saya ingin memesan layanan berikut:`,
    "",
    `Layanan: ${summary.itemName}`,
  ];

  if (item.category === "per-star") {
    lines.push(`Jumlah: ${draft.starQuantity} star`);
  }

  appendOptionalLine(lines, "Nickname", draft.nickname);
  appendOptionalLine(lines, "User ID", draft.userId);
  appendOptionalLine(lines, "Server ID", draft.serverId);
  appendOptionalLine(lines, "Request hero / role", draft.heroOrRoleRequest);
  appendOptionalLine(lines, "Request win rate / win streak", draft.winRateOrStreakRequest);
  appendOptionalLine(lines, "Catatan", draft.notes);

  lines.push("", `Estimasi subtotal: ${formatRupiah(summary.subtotal)}`);

  if (summary.bonusStars > 0) {
    lines.push(`Bonus paket: +${summary.bonusStars} star`);
  }

  if (summary.testimonialRewardEligible) {
    lines.push(
      "Info reward: subtotal memenuhi syarat reward testimonial Rp5.000 setelah layanan selesai dan bukti testimonial dikirim. Reward tidak memotong subtotal.",
    );
  }

  lines.push(
    "",
    "Mohon konfirmasi ketersediaan layanan dan detail pesanan ini.",
    "",
    "Catatan: pesan ini belum terkirim. Saya akan menekan tombol Kirim di WhatsApp setelah memeriksa detailnya.",
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${storeConfig.whatsappNumber}?${params.toString()}`;
}
