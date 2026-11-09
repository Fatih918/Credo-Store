import Link from "next/link";

import { requirePermission } from "@/features/admin/auth/authorization";
import { hasAdminPermission } from "@/features/admin/auth/permissions";

export default async function AdminDashboardPage() {
  const admin = await requirePermission("dashboard:view");

  const modules = [
    {
      title: "Kategori",
      description: "Kelola kategori katalog",
      href: "/admin/categories",
      permission: "catalog:read" as const,
    },
    {
      title: "Subkategori & Harga",
      description: "Kelola paket, harga, dan tampilan kartu",
      href: "/admin/subcategories",
      permission: "catalog:read" as const,
    },
    {
      title: "Manajemen Admin",
      description: "Kelola akun administrator dan role",
      href: "/admin/users",
      permission: "admins:manage" as const,
    },
    {
      title: "Audit Log",
      description: "Periksa riwayat perubahan data",
      href: "/admin/audit-logs",
      permission: "audit:read" as const,
    },
  ];

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-400">
        Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        Selamat datang{admin.displayName ? `, ${admin.displayName}` : ""}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        Pusat pengelolaan katalog Credo Store. Pilih modul sesuai hak akses
        akun; setiap halaman tetap memverifikasi izin di server.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const canAccess = hasAdminPermission(admin.role, module.permission);

          return (
            <article
              key={module.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <h2 className="font-semibold text-white">{module.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{module.description}</p>
              {canAccess ? (
                <Link
                  href={module.href}
                  className="mt-5 inline-block text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200"
                >
                  Buka modul →
                </Link>
              ) : (
                <p className="mt-5 text-xs font-medium text-zinc-500">
                  Tidak tersedia untuk role ini
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <p className="text-sm font-semibold text-zinc-200">Role aktif</p>
        <p className="mt-1 text-sm capitalize text-fuchsia-300">
          {admin.role.replaceAll("_", " ")}
        </p>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          Hak akses modul ditentukan oleh role dan diperiksa kembali di server.
          Status menu hanya membantu navigasi, bukan mekanisme keamanan.
        </p>
      </div>
    </section>
  );
}
