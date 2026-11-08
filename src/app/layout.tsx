import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Credo Store | Joki Rank Mobile Legends",
    template: "%s | Credo Store",
  },
  description:
    "Lihat layanan joki rank Mobile Legends dari Credo Store dan pesan langsung melalui WhatsApp.",
  applicationName: "Credo Store",
  metadataBase: new URL("https://credo-store.vercel.app"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
