import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminCustomPagesIndexProps = {
  searchParams: Promise<{
    status?: string;
    message?: string;
  }>;
};

function feedbackPath(status: "success" | "error", message: string) {
  const query = new URLSearchParams({ status, message });
  return `/admin/pages/custom?${query.toString()}`;
}

export default async function AdminCustomPagesIndex({ searchParams }: AdminCustomPagesIndexProps) {
  const query = await searchParams;
  const access = await requireAdminAccess("/admin/pages/custom");

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
  const { data: pages } = await supabase
    .from("custom_pages")
    .select("id, slug, title, status, updated_at")
    .eq("tenant_id", access.tenant.id)
    .order("updated_at", { ascending: false });

  async function createCustomPage(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/pages/custom");
    if (actionAccess.status !== "allowed") return;

    const title = (formData.get("title") as string)?.trim();
    const slugInput = (formData.get("slug") as string)?.trim();

    if (!title || !slugInput) {
      redirect(feedbackPath("error", "Du maste ange bade sidtitel och slug."));
    }

    const slug = slugInput
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug) {
      redirect(feedbackPath("error", "Slug blev ogiltig efter normalisering."));
    }

    const supabaseAction = await createSupabaseServerClient();
    const { data: existing } = await supabaseAction
      .from("custom_pages")
      .select("id")
      .eq("tenant_id", actionAccess.tenant.id)
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      redirect(feedbackPath("error", "Den sluggen finns redan. Valj en unik slug."));
    }

    const { error } = await supabaseAction.from("custom_pages").insert({
      tenant_id: actionAccess.tenant.id,
      title,
      slug,
      status: "draft",
      content: {
        heroTitle: title,
        body: "",
      },
    });

    if (error) {
      redirect(feedbackPath("error", `Kunde inte skapa sida: ${error.message}`));
    }

    revalidatePath("/admin/pages/custom");
    redirect(feedbackPath("success", `Sidan skapades: /sidor/${slug}`));
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Skapa ny CMS-sida</h2>
        <p className="mt-1 text-sm text-slate-600">Skapa helt nya landningssidor som publiceras under /sidor/[slug].</p>
        {query.message ? (
          <p
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              query.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {query.message}
          </p>
        ) : null}
        <form action={createCustomPage} className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sidtitel</span>
            <input
              name="title"
              placeholder="t.ex. Sommarkampanj 2026"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Slug</span>
            <input
              name="slug"
              placeholder="t.ex. sommarkampanj"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="mt-5 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Skapa sida
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Dina custom-sidor</h3>
          <Link href="/admin/pages" className="text-sm text-slate-700 hover:text-slate-900">
            Till standardsidor
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3">Titel</th>
                <th className="py-2 pr-3">URL</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Senast uppdaterad</th>
                <th className="py-2 pr-3">Hantera</th>
              </tr>
            </thead>
            <tbody>
              {(pages || []).map((page) => (
                <tr key={page.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-3 font-medium">{page.title}</td>
                  <td className="py-2 pr-3 font-mono text-xs">/sidor/{page.slug}</td>
                  <td className="py-2 pr-3">{page.status}</td>
                  <td className="py-2 pr-3">{page.updated_at ? new Date(page.updated_at).toLocaleString("sv-SE") : "-"}</td>
                  <td className="py-2 pr-3">
                    <Link
                      href={`/admin/pages/custom/${page.id}`}
                      className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Redigera
                    </Link>
                  </td>
                </tr>
              ))}
              {(pages || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-sm text-slate-500">
                    Inga custom-sidor ännu.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
