import { describe, expect, it } from "vitest";
import { catalogItems } from "../../src/features/catalog/data/catalog";
import { getRankArtwork } from "../../src/features/catalog/rank-artwork";

describe("catalog rank artwork", () => {
  it("provides artwork for every current catalog item", () => {
    for (const item of catalogItems) {
      expect(getRankArtwork(item), item.id).not.toBeNull();
    }
  });

  it("uses the matching rank emblem for rank-based packages", () => {
    expect(getRankArtwork(catalogItems.find((item) => item.id === "grand-master")!)?.src)
      .toBe("/img/New_rank_mlbb_Grand_master_CR_xzeel-removebg-preview.png");
    expect(getRankArtwork(catalogItems.find((item) => item.id === "epic")!)?.src)
      .toBe("/img/rank_epic_mlbb_png_hd-removebg-preview.png");
    expect(getRankArtwork(catalogItems.find((item) => item.id === "legend")!)?.src)
      .toBe("/img/New_rank_mlbb_Legend_CR_xzeel-removebg-preview.png");
    expect(getRankArtwork(catalogItems.find((item) => item.id === "mythic")!)?.src)
      .toBe("/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png");
  });
});
