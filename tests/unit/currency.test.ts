import { describe, expect, it } from "vitest";
import { formatRupiah } from "../../src/lib/currency";

describe("formatRupiah", () => {
  it("formats integer rupiah values using Indonesian locale", () => {
    expect(formatRupiah(45000)).toContain("45.000");
    expect(formatRupiah(3000)).toContain("3.000");
  });

  it("supports zero", () => {
    expect(formatRupiah(0)).toContain("0");
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid amount %s",
    (amount) => {
      expect(() => formatRupiah(amount)).toThrow(RangeError);
    },
  );
});
