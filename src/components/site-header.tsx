import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#08070d]/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[0.18em] text-white">
          CREDO<span className="text-fuchsia-400">.</span>
          <span className="ml-1 text-zinc-400">STORE</span>
        </Link>
        <nav aria-label="Navigasi utama" className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/" className="text-zinc-300 transition hover:text-white">Home</Link>
          <Link href="/paket" className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-4 py-2 text-fuchsia-200 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/20">
            Pilihan Paket
          </Link>
        </nav>
      </div>
    </header>
  );
}
