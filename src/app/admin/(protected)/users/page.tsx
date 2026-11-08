import { requirePermission } from "@/features/admin/auth/authorization";
import {
  inviteAdminAction,
  toggleAdminActiveAction,
  updateAdminRoleAction,
} from "@/features/admin/users/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminRole, ADMIN_ROLES } from "@/features/admin/auth/permissions";

interface AdminUsersPageProps {
  searchParams: Promise<{ result?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const actor = await requirePermission("admins:manage");
  const { result } = await searchParams;
  const supabase = createAdminClient();

  const [{ data: profiles, error: profilesError }, { data: authUsers, error: usersError }] =
    await Promise.all([
      supabase
        .from("admin_profiles")
        .select("user_id, role, display_name, is_active, created_at")
        .order("created_at", { ascending: true }),
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

  if (profilesError || usersError) {
    throw new Error("Unable to load administrator accounts.");
  }

  const emailByUserId = new Map(
    (authUsers.users ?? []).map((user) => [user.id, user.email ?? "—"]),
  );

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-400">
        Administrators
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        Manajemen akun admin
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        Undang akun melalui email, ubah role, atau nonaktifkan akses admin.
        Kredensial tetap dikelola oleh Supabase Auth.
      </p>

      {result === "success" && (
        <p role="status" className="mt-5 rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          Perubahan akun berhasil disimpan.
        </p>
      )}
      {result === "invalid" && (
        <p role="alert" className="mt-5 rounded-lg border border-amber-900 bg-amber-950/40 p-3 text-sm text-amber-300">
          Data tidak valid. Periksa kembali input dan pastikan Anda tidak mengubah akun sendiri.
        </p>
      )}
      {result === "failed" && (
        <p role="alert" className="mt-5 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          Operasi gagal. Pastikan email belum terdaftar dan aturan database mengizinkan perubahan.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-white">Undang administrator</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Supabase akan mengirim email undangan. Akun baru mendapat akses setelah profil admin dibuat.
        </p>
        <form action={inviteAdminAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-zinc-300">
            Email
            <input name="email" type="email" required maxLength={254} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400" />
          </label>
          <label className="grid gap-2 text-sm text-zinc-300">
            Nama tampilan
            <input name="displayName" type="text" maxLength={100} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400" />
          </label>
          <label className="grid gap-2 text-sm text-zinc-300">
            Role
            <select name="role" defaultValue="viewer" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-400">
              {ADMIN_ROLES.map((role) => (
                <option key={role} value={role}>{role.replaceAll("_", " ")}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500">
              Kirim undangan
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="font-semibold text-white">Daftar administrator</h2>
          <p className="mt-1 text-xs text-zinc-500">{profiles?.length ?? 0} akun terdaftar</p>
        </div>
        <div className="divide-y divide-zinc-800">
          {(profiles ?? []).map((profile) => {
            const isSelf = profile.user_id === actor.userId;
            return (
              <article key={profile.user_id} className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{profile.display_name || "Tanpa nama"}</p>
                  <p className="mt-1 truncate text-sm text-zinc-400">{emailByUserId.get(profile.user_id) ?? "Email tidak ditemukan"}</p>
                  <p className="mt-1 text-xs text-zinc-600">{profile.user_id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={profile.is_active ? "rounded-full bg-emerald-950 px-3 py-1 text-xs text-emerald-300" : "rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"}>
                    {profile.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                  <form action={updateAdminRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={profile.user_id} />
                    <select name="role" defaultValue={isAdminRole(profile.role) ? profile.role : "viewer"} disabled={isSelf} aria-label={`Role untuk ${emailByUserId.get(profile.user_id) ?? profile.user_id}`} className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-xs text-white disabled:opacity-40">
                      {ADMIN_ROLES.map((role) => <option key={role} value={role}>{role.replaceAll("_", " ")}</option>)}
                    </select>
                    <button type="submit" disabled={isSelf} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-fuchsia-400 disabled:opacity-40">Simpan role</button>
                  </form>
                  <form action={toggleAdminActiveAction}>
                    <input type="hidden" name="userId" value={profile.user_id} />
                    <input type="hidden" name="isActive" value={String(!profile.is_active)} />
                    <button type="submit" disabled={isSelf} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-fuchsia-400 disabled:opacity-40">
                      {profile.is_active ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
