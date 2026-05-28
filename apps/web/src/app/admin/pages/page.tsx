import Link from "next/link";
import { requireAdminAccess } from "@/lib/admin-access";
import { CMS_PAGES } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPagesIndex() {
  const access = await requireAdminAccess("/admin/pages");

  if (access.status === "tenant_missing") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Ingen tenant hittades for host. Kontrollera tenant_domains.
      </p>
    );
  }

  if (access.status === "forbidden") {
    return (
      <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Ditt konto har inte åtkomst till den här adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("page_content")
    .select("page_key, status, updated_at")
    .eq("tenant_id", access.tenant.id);

  const byKey = new Map((data || []).map((row) => [row.page_key as string, row]));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">CMS-sidor for {access.tenant.name}</h2>
        <Link
          href="/admin/pages/custom"
          className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Hantera custom-sidor
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Redigera texter, bilder, länkar och sektioner per sida. Publicera när du är redo.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-3">Sida</th>
              <th className="py-2 pr-3">Route</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Senast uppdaterad</th>
              <th className="py-2 pr-3">Hantera</th>
            </tr>
          </thead>
          <tbody>
            {CMS_PAGES.map((page) => {
              const row = byKey.get(page.key);
              return (
                <tr key={page.key} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-3 font-medium">{page.title}</td>
                  <td className="py-2 pr-3">{page.route}</td>
                  <td className="py-2 pr-3">{row?.status || "saknas"}</td>
                  <td className="py-2 pr-3">{row?.updated_at ? new Date(row.updated_at).toLocaleString("sv-SE") : "-"}</td>
                  <td className="py-2 pr-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/pages/${page.key}`}
                        className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Redigera
                      </Link>
                      <Link
                        href={`/admin/pages/${page.key}?view=edit`}
                        className="inline-flex rounded-md border border-sky-300 bg-sky-50 px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-100"
                      >
                        Edit view
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
