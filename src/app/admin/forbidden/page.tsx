import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Akses Ditolak",
  robots: { index: false, follow: false },
};

export default function AdminForbiddenPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-12"
    >
      <section className="max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-300">
          403 — Forbidden
        </p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Akses administrator ditolak
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Akun ini belum memiliki profil administrator aktif atau tidak
          mempunyai izin untuk membuka halaman tersebut.
        </p>
        <Link
          href="/admin/login"
          className="mt-7 inline-flex rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400"
        >
          Kembali ke login
        </Link>
      </section>
    </main>
  );
}
