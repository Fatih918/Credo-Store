import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../../src/features/order/whatsapp";
import { calculateOrderSummary } from "../../src/features/order/order-pricing";
import { fixedPackages, perStarServices, tierProgressions } from "../../src/features/catalog/data/catalog";
import type { OrderDraft } from "../../src/features/order/types";

const draft: OrderDraft = {
  catalogItemId: "epic",
  starQuantity: 3,
  nickname: "Player One",
  userId: "123456",
  serverId: "7890",
  heroOrRoleRequest: "Roamer",
  winRateOrStreakRequest: "",
  notes: "Hubungi setelah jam 7",
};

describe("WhatsApp order message", () => {
  it("includes selected service, quantity, optional details and subtotal", () => {
    const item = perStarServices[1];
    const message = buildWhatsAppMessage(draft, calculateOrderSummary(item, 3), item);
    expect(message).toContain("Layanan: Epic");
    expect(message).toContain("Jumlah: 3 star");
    expect(message).toContain("Nickname: Player One");
    expect(message).toContain("User ID: 123456");
    expect(message).toContain("Server ID: 7890");
    expect(message).toContain("Request hero / role: Roamer");
    expect(message).toContain("Estimasi subtotal: Rp 13.500");
    expect(message).not.toContain("password");
    expect(message).not.toContain("kode verifikasi");
  });

  it("omits blank optional fields and quantity for fixed packages", () => {
    const item = fixedPackages[1];
    const fixedDraft = { ...draft, catalogItemId: item.id, starQuantity: 0,
      nickname: "", userId: "", serverId: "", heroOrRoleRequest: "", notes: "" };
    const message = buildWhatsAppMessage(fixedDraft, calculateOrderSummary(item, 0), item);
    expect(message).toContain("Layanan: 10 Stars Epic");
    expect(message).not.toContain("Jumlah:");
    expect(message).not.toContain("Nickname:");
  });

  it("includes bonus stars and testimonial eligibility without discounting subtotal", () => {
    const item = tierProgressions[2];
    const progression = { ...draft, catalogItemId: item.id };
    const message = buildWhatsAppMessage(progression, calculateOrderSummary(item, 1), item);
    expect(message).toContain("Estimasi subtotal: Rp 235.000");
    expect(message).toContain("Bonus paket: +1 star");
    expect(message).toContain("reward testimonial Rp5.000");
  });

  it("accepts a new database catalog item without a static catalog entry", () => {
    const item = { ...perStarServices[1], id: "new-service-from-db", name: "New Service" };
    const newDraft = { ...draft, catalogItemId: item.id };
    const message = buildWhatsAppMessage(newDraft, calculateOrderSummary(item, 2), item);
    expect(message).toContain("Layanan: New Service");
    expect(message).toContain("Jumlah: 2 star");
  });

  it("rejects invalid drafts", () => {
    const item = perStarServices[1];
    expect(() => buildWhatsAppMessage({ ...draft, starQuantity: 0 }, calculateOrderSummary(item, 1), item)).toThrow(RangeError);
  });

  it("builds an encoded Click to Chat URL for the configured store number", () => {
    const message = "Halo Credo Store\nSaya ingin order & konfirmasi.";
    const url = buildWhatsAppUrl(message);
    expect(url).toMatch(/^https:\/\/wa\.me\/6283165112261\?/);
    expect(new URL(url).searchParams.get("text")).toBe(message);
  });
});
