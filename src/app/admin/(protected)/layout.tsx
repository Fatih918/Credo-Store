import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { logoutAction } from "@/features/admin/auth/actions";
import { requireAdmin } from "@/features/admin/auth/authorization";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface ProtectedAdminLayoutProps {
  children: ReactNode;
}

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <Link href="/admin" className="text-lg font-bold tracking-tight">
              Credo Store <span className="text-fuchsia-400">/ Admin</span>
            </Link>
            <p className="mt-1 text-xs text-zinc-500">
              Area pengelolaan internal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-200">
                {admin.displayName || admin.email || "Administrator"}
              </p>
              <p className="text-xs capitalize text-zinc-500">
                {admin.role.replaceAll("_", " ")}
              </p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-fuchsia-400 hover:text-white"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 py-10">
        {children}
      </main>
    </div>
  );
}
