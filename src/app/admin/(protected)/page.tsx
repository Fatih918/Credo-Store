import Link from "next/link";

import { requirePermission } from "@/features/admin/auth/authorization";

export default async function AdminDashboardPage() {
  const admin = await requirePermission("dashboard:view");

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-400">
        Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        Selamat datang{admin.displayName ? `, ${admin.displayName}` : ""}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        Autentikasi dan pemeriksaan role aktif sudah berjalan. Pengelolaan
        kategori kini tersedia; modul subkategori, audit log, dan integrasi
        katalog publik akan dilanjutkan pada tahap berikutnya.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Kategori", "Manajemen kategori", "Tersedia"],
          ["Subkategori", "Paket dan harga layanan", "Belum tersedia"],
          ["Admin", "Akun dan hak akses", "Belum tersedia"],
          ["Audit Log", "Riwayat perubahan data", "Belum tersedia"],
        ].map(([title, description, status]) => (
          <article
            key={title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{description}</p>
            {title === "Kategori" ? (
              <Link href="/admin/categories" className="mt-5 inline-block text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200">
                Buka manajemen kategori →
              </Link>
            ) : (
              <p className="mt-5 text-xs font-medium text-zinc-500">{status}</p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <p className="text-sm font-semibold text-zinc-200">Role aktif</p>
        <p className="mt-1 text-sm capitalize text-fuchsia-300">
          {admin.role.replaceAll("_", " ")}
        </p>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          Akses setiap modul tetap diverifikasi di server. Menyembunyikan menu
          pada antarmuka bukan pengganti pemeriksaan izin.
        </p>
      </div>
    </section>
  );
}
