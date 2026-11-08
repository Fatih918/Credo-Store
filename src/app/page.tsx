import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const highlights = [
  { number: "01", title: "Pilih layanan", description: "Lihat kategori dan paket yang tersedia di katalog Credo Store." },
  { number: "02", title: "Isi detail pesanan", description: "Masukkan detail yang ingin disampaikan untuk kebutuhan order." },
  { number: "03", title: "Konfirmasi via WhatsApp", description: "Periksa ringkasan dan lanjutkan percakapan dengan toko." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08070d] text-white">
      <SiteHeader />
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#130d1c] shadow-[0_25px_100px_rgba(168,85,247,0.12)]">
          <Image
            src="/img/banner_credo_store.png"
            alt="Welcome to Credo Store — layanan Mobile Legends"
            width={900}
            height={296}
            priority
            unoptimized
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-fuchsia-300">MOBILE LEGENDS SERVICE</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Push rank bersama <span className="text-fuchsia-400">Credo Store.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Temukan layanan yang sesuai dengan target rank kamu. Pilih paket, isi detail pesanan, lalu konfirmasi langsung melalui WhatsApp.
          </p>
          <Link href="/paket" className="mt-7 inline-flex items-center justify-center rounded-full bg-fuchsia-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-950/40 transition hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-[#08070d]">
            Lihat Pilihan Paket <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
        <section className="mt-16 grid gap-4 sm:grid-cols-3" aria-label="Alur pemesanan">
          {highlights.map((item) => (
            <article key={item.number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold tracking-[0.2em] text-fuchsia-400">{item.number}</p>
              <h2 className="mt-3 font-bold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
            </article>
          ))}
        </section>
      </section>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-zinc-500">
        Credo Store · Pemesanan dan konfirmasi dilakukan langsung melalui WhatsApp.
      </footer>
    </main>
  );
}
