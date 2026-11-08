import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrderForm } from "../../src/features/order/components/order-form";

describe("OrderForm", () => {
  it("renders per-star quantity, account detail fields, and initial subtotal", () => {
    const markup = renderToStaticMarkup(
      createElement(OrderForm, { catalogItemId: "epic" }),
    );

    expect(markup).toContain("Jumlah star");
    expect(markup).toContain('id="starQuantity"');
    expect(markup).toContain("Nickname");
    expect(markup).toContain("User ID");
    expect(markup).toContain("Server ID");
    expect(markup).toContain("4.500");
    expect(markup).not.toContain("Lanjutkan ke WhatsApp");
    expect(markup).not.toContain('type="password"');
  });

  it("renders fixed-package pricing without a star quantity input", () => {
    const markup = renderToStaticMarkup(
      createElement(OrderForm, { catalogItemId: "epic-10-stars" }),
    );

    expect(markup).toContain("10 Stars Epic");
    expect(markup).toContain("40.000");
    expect(markup).not.toContain('id="starQuantity"');
    expect(markup).not.toContain("Lanjutkan ke WhatsApp");
  });

  it("renders tier progression bonus information in the order summary", () => {
    const markup = renderToStaticMarkup(
      createElement(OrderForm, { catalogItemId: "epic-v-to-mythic" }),
    );

    expect(markup).toContain("Epic V → Mythic");
    expect(markup).toContain("Bonus paket: +1 star");
    expect(markup).toContain("235.000");
  });
});
