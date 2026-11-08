import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteTitle = "Credo Store | Joki Rank Mobile Legends";
const siteDescription =
  "Lihat layanan joki rank Mobile Legends dari Credo Store, bandingkan paket, dan lanjutkan pemesanan melalui WhatsApp.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | Credo Store",
  },
  description: siteDescription,
  applicationName: "Credo Store",
  creator: "Credo Store",
  publisher: "Credo Store",
  icons: {
    icon: [
      {
        url: "/img/893258602_1789918332067415_1040173948934607025_n-removebg-preview.png",
        type: "image/png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Credo Store",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
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
      <body>
        <a className="skip-link" href="#main-content">
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
