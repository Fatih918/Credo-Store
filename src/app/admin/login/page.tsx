import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction } from "@/features/admin/auth/actions";
import { requireAdmin } from "@/features/admin/auth/authorization";
import { getSupabasePublicEnvOrNull } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const supabaseEnv = getSupabasePublicEnvOrNull();

  if (supabaseEnv) {
    const admin = await requireAdmin().catch(() => null);
    if (admin) redirect("/admin");
  }

  const { error } = await searchParams;
  const isForbidden = error === "forbidden";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12"
    >
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-7 shadow-2xl shadow-fuchsia-950/10 sm:p-9">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          ← Kembali ke Credo Store
        </Link>

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-400">
            Credo Store
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Masuk menggunakan akun administrator yang telah didaftarkan oleh
            pengelola toko.
          </p>
        </div>

        {!supabaseEnv ? (
          <p
            role="alert"
            className="mt-7 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200"
          >
            Supabase belum dikonfigurasi. Atur URL project dan publishable key
            pada environment aplikasi sebelum login digunakan.
          </p>
        ) : (
          <form action={loginAction} className="mt-8 space-y-5">
            {error === "credentials" ? (
              <p
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
              >
                Email atau password tidak valid.
              </p>
            ) : null}
            {isForbidden ? (
              <p
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
              >
                Akun ini tidak memiliki akses administrator aktif.
              </p>
            ) : null}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                maxLength={254}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400"
                placeholder="admin@credostore.id"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={1024}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-fuchsia-500 px-4 py-3 font-semibold text-white transition hover:bg-fuchsia-400 focus-visible:outline-offset-4"
            >
              Masuk ke Dashboard
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
