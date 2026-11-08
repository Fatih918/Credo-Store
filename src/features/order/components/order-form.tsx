"use client";

import { useMemo, useState, type FormEvent } from "react";
import { catalogItems } from "../../catalog/data/catalog";
import { formatRupiah } from "@/lib/currency";
import { calculateOrderSummary } from "../order-pricing";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../whatsapp";
import { hasOrderErrors, validateOrderDraft } from "../validation";
import type { OrderDraft, OrderFieldErrors } from "../types";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#0c0b12] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20";

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return <p id={id} role="alert" className="mt-1 text-xs text-rose-400">{children}</p>;
}

export function OrderForm({ catalogItemId }: { catalogItemId: string }) {
  const [draft, setDraft] = useState<OrderDraft>(() => ({
    catalogItemId,
    starQuantity: 1,
    nickname: "",
    userId: "",
    serverId: "",
    heroOrRoleRequest: "",
    winRateOrStreakRequest: "",
    notes: "",
  }));
  const [errors, setErrors] = useState<OrderFieldErrors>({});
  const [validated, setValidated] = useState(false);

  const selectedItem = catalogItems.find((item) => item.id === catalogItemId);
  const summary = useMemo(() => {
    try {
      return calculateOrderSummary(catalogItemId, draft.starQuantity);
    } catch {
      return null;
    }
  }, [catalogItemId, draft.starQuantity]);

  function updateDraft<K extends keyof OrderDraft>(field: K, value: OrderDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setValidated(false);
  }

  const whatsappUrl = useMemo(() => {
    if (!validated || !summary) return null;
    try {
      return buildWhatsAppUrl(buildWhatsAppMessage(draft, summary));
    } catch {
      return null;
    }
  }, [draft, summary, validated]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateOrderDraft(draft);
    setErrors(nextErrors);
    setValidated(!hasOrderErrors(nextErrors));
  }

  if (!selectedItem) return null;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <section className="space-y-5 rounded-2xl border border-white/10 bg-[#111019] p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-300">01 / LAYANAN DIPILIH</p>
          <h3 className="mt-2 text-lg font-bold text-white">{selectedItem.name}</h3>
          <p className="mt-1 text-xs text-zinc-500">Paket dikunci sesuai halaman detail yang sedang dibuka.</p>
        </div>

        {selectedItem.category === "per-star" ? (
          <div>
            <label htmlFor="starQuantity" className="text-sm font-medium text-zinc-200">Jumlah star</label>
            <input
              id="starQuantity" aria-invalid={Boolean(errors.starQuantity)} aria-describedby={errors.starQuantity ? "starQuantity-error" : undefined}
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              className={fieldClassName}
              value={draft.starQuantity}
              onChange={(event) => updateDraft("starQuantity", Number(event.target.value))}
            />
            <FieldError id="starQuantity-error">{errors.starQuantity}</FieldError>
            <p className="mt-1 text-xs text-zinc-500">Tidak ada minimum lima star. Masukkan bilangan bulat positif.</p>
          </div>
        ) : null}

        <div className="border-t border-white/10 pt-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-300">02 / DETAIL AKUN</p>
          <p className="mt-1 text-xs text-zinc-500">Kolom ini masih opsional sampai ketentuan wajib dikonfirmasi toko.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nickname" className="text-sm font-medium text-zinc-200">Nickname</label>
              <input id="nickname" aria-invalid={Boolean(errors.nickname)} aria-describedby={errors.nickname ? "nickname-error" : undefined} maxLength={40} className={fieldClassName} value={draft.nickname} onChange={(event) => updateDraft("nickname", event.target.value)} placeholder="Nickname in-game" />
              <FieldError id="nickname-error">{errors.nickname}</FieldError>
            </div>
            <div>
              <label htmlFor="userId" className="text-sm font-medium text-zinc-200">User ID</label>
              <input id="userId" aria-invalid={Boolean(errors.userId)} aria-describedby={errors.userId ? "userId-error" : undefined} maxLength={30} className={fieldClassName} value={draft.userId} onChange={(event) => updateDraft("userId", event.target.value)} placeholder="Contoh: 123456789" />
              <FieldError id="userId-error">{errors.userId}</FieldError>
            </div>
            <div>
              <label htmlFor="serverId" className="text-sm font-medium text-zinc-200">Server ID</label>
              <input id="serverId" aria-invalid={Boolean(errors.serverId)} aria-describedby={errors.serverId ? "serverId-error" : undefined} maxLength={20} className={fieldClassName} value={draft.serverId} onChange={(event) => updateDraft("serverId", event.target.value)} placeholder="Contoh: 1234" />
              <FieldError id="serverId-error">{errors.serverId}</FieldError>
            </div>
            <div>
              <label htmlFor="heroOrRoleRequest" className="text-sm font-medium text-zinc-200">Request hero / role</label>
              <input id="heroOrRoleRequest" aria-invalid={Boolean(errors.heroOrRoleRequest)} aria-describedby={errors.heroOrRoleRequest ? "heroOrRoleRequest-error" : undefined} maxLength={120} className={fieldClassName} value={draft.heroOrRoleRequest} onChange={(event) => updateDraft("heroOrRoleRequest", event.target.value)} placeholder="Opsional" />
              <FieldError id="heroOrRoleRequest-error">{errors.heroOrRoleRequest}</FieldError>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="winRateOrStreakRequest" className="text-sm font-medium text-zinc-200">Request win rate / win streak</label>
          <textarea id="winRateOrStreakRequest" aria-invalid={Boolean(errors.winRateOrStreakRequest)} aria-describedby={errors.winRateOrStreakRequest ? "winRateOrStreakRequest-error" : undefined} rows={2} maxLength={160} className={fieldClassName} value={draft.winRateOrStreakRequest} onChange={(event) => updateDraft("winRateOrStreakRequest", event.target.value)} placeholder="Permintaan dikonfirmasi berdasarkan kondisi pertandingan." />
          <FieldError id="winRateOrStreakRequest-error">{errors.winRateOrStreakRequest}</FieldError>
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-medium text-zinc-200">Catatan tambahan</label>
          <textarea id="notes" aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : undefined} rows={3} maxLength={500} className={fieldClassName} value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} placeholder="Tulis informasi tambahan (opsional)." />
          <FieldError id="notes-error">{errors.notes}</FieldError>
        </div>

        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-amber-200/80">
          Jangan masukkan password atau kode verifikasi akun ke formulir ini.
        </p>
        <button type="submit" className="w-full rounded-xl bg-fuchsia-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-[#111019]">
          Validasi pesanan
        </button>
        {validated ? (
          <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300">
            Detail pesanan valid. Periksa kembali pesan sebelum mengirimkannya melalui WhatsApp.
          </p>
        ) : null}
        {validated && whatsappUrl ? (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-500">
            Lanjutkan ke WhatsApp
          </a>
        ) : null}
        <p className="text-xs leading-5 text-zinc-500">
          WhatsApp terbuka dengan pesan yang sudah diisi. Pesan baru terkirim setelah kamu menekan tombol Kirim di WhatsApp.
        </p>
      </section>

      <aside className="h-fit rounded-2xl border border-white/10 bg-[#111019] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-300">RINGKASAN HARGA</p>
        <h3 className="mt-2 text-lg font-bold text-white">Estimasi pesanan</h3>
        {summary ? (
          <>
            <p className="mt-4 text-sm text-zinc-400">{summary.categoryLabel}</p>
            <p className="mt-1 font-medium text-zinc-100">{summary.itemName}</p>
            {selectedItem.category === "per-star" ? (
              <p className="mt-1 text-sm text-zinc-400">{draft.starQuantity} star × {formatRupiah(selectedItem.promoPricePerStar)}</p>
            ) : null}
            <div className="my-5 border-t border-white/10" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-zinc-400">Subtotal</span>
              <strong className="text-xl text-white">{formatRupiah(summary.subtotal)}</strong>
            </div>
            {summary.bonusStars > 0 ? <p className="mt-3 text-sm text-emerald-300">Bonus paket: +{summary.bonusStars} star</p> : null}
            <div className="mt-5 rounded-xl bg-[#0b0a10] p-4">
              <p className="text-xs font-medium text-zinc-300">Reward testimonial Rp5.000</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                {summary.testimonialRewardEligible
                  ? "Subtotal memenuhi ambang. Reward berlaku setelah layanan selesai dan bukti testimonial dikirim; tidak mengurangi subtotal ini."
                  : "Reward berlaku untuk subtotal di atas Rp20.000 setelah layanan selesai dan bukti testimonial dikirim."}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-rose-400">Masukkan jumlah star yang valid untuk melihat subtotal.</p>
        )}
        <p className="mt-5 text-xs leading-5 text-zinc-500">Harga mengikuti katalog. Detail pengerjaan dikonfirmasi melalui toko.</p>
      </aside>
    </form>
  );
}
