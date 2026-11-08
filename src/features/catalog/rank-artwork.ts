import type { CatalogItem } from "./types";

const rankArtworkByPackageId: Record<string, { src: string; alt: string }> = {
  "grand-master": {
    src: "/img/New_rank_mlbb_Grand_master_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Grand Master Mobile Legends",
  },
  epic: {
    src: "/img/rank_epic_mlbb_png_hd-removebg-preview.png",
    alt: "Emblem rank Epic Mobile Legends",
  },
  legend: {
    src: "/img/New_rank_mlbb_Legend_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Legend Mobile Legends",
  },
  mythic: {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic Mobile Legends",
  },
  "mythic-honor": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic untuk layanan Mythic Honor",
  },
  "mythic-glory": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic untuk layanan Mythic Glory",
  },
  "placement-mythic-10-matches": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic untuk paket Placement Mythic",
  },
  "epic-10-stars": {
    src: "/img/rank_epic_mlbb_png_hd-removebg-preview.png",
    alt: "Emblem rank Epic untuk paket 10 Stars Epic",
  },
  "legend-10-stars": {
    src: "/img/New_rank_mlbb_Legend_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Legend untuk paket 10 Stars Legend",
  },
  "mythic-10-stars": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic untuk paket 10 Stars Mythic",
  },
  "honor-10-stars": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic untuk paket 10 Stars Honor",
  },
  "epic-v-to-legend-v": {
    src: "/img/New_rank_mlbb_Legend_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank tujuan Legend",
  },
  "legend-v-to-mythic": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank tujuan Mythic",
  },
  "epic-v-to-mythic": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank tujuan Mythic",
  },
  "mythic-to-honor-25": {
    src: "/img/New_rank_mlbb_mytich_CR_xzeel-removebg-preview.png",
    alt: "Emblem rank Mythic untuk progression ke Mythic Honor",
  },
};

export function getRankArtwork(item: CatalogItem) {
  return rankArtworkByPackageId[item.id] ?? null;
}
