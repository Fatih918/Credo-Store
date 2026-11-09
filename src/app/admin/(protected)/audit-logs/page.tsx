import { requirePermission } from "@/features/admin/auth/authorization";
import { createClient } from "@/lib/supabase/server";

const actionLabels: Record<string, string> = {
  create: "Dibuat",
  update: "Diperbarui",
  activate: "Diaktifkan",
  deactivate: "Dinonaktifkan",
  delete: "Dihapus",
};

const entityLabels: Record<string, string> = {
  category: "Kategori",
  subcategory: "Subkategori",
  admin_profile: "Profil admin",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export default async function AdminAuditLogsPage() {
  await requirePermission("audit:read");
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("id, actor_user_id, action, entity_type, entity_id, before_data, after_data, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error("Unable to load audit history.");
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-400">
        Security
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        Audit Log
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
        Riwayat perubahan katalog dan profil administrator yang dicatat oleh
        database. Data ditampilkan dari yang terbaru, maksimal 50 catatan.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="font-semibold text-white">Aktivitas terbaru</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {logs?.length ?? 0} catatan ditampilkan
          </p>
        </div>

        {!logs?.length ? (
          <p className="px-6 py-10 text-sm text-zinc-400">
            Belum ada aktivitas yang tercatat.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {logs.map((log) => (
              <article key={log.id} className="grid gap-3 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {actionLabels[log.action] ?? log.action} ·{" "}
                      {entityLabels[log.entity_type] ?? log.entity_type}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                    {log.action}
                  </span>
                </div>

                <dl className="grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-zinc-500">Actor user ID</dt>
                    <dd className="mt-1 break-all text-zinc-300">
                      {log.actor_user_id ?? "Tidak diketahui"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Entity ID</dt>
                    <dd className="mt-1 break-all text-zinc-300">
                      {log.entity_id ?? "Tidak tersedia"}
                    </dd>
                  </div>
                </dl>

                {(log.before_data !== null || log.after_data !== null) && (
                  <details className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <summary className="cursor-pointer text-xs font-medium text-fuchsia-300">
                      Lihat data sebelum / sesudah
                    </summary>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold text-zinc-400">
                          Sebelum
                        </p>
                        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-zinc-400">
                          {log.before_data === null
                            ? "Tidak ada data sebelumnya"
                            : JSON.stringify(log.before_data, null, 2)}
                        </pre>
                      </div>
                      <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold text-zinc-400">
                          Sesudah
                        </p>
                        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-zinc-400">
                          {log.after_data === null
                            ? "Tidak ada data sesudahnya"
                            : JSON.stringify(log.after_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
