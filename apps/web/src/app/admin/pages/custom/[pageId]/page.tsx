import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminCustomPageEditorProps = {
  params: Promise<{ pageId: string }>;
};

export default async function AdminCustomPageEditor({ params }: AdminCustomPageEditorProps) {
  const { pageId } = await params;
  const access = await requireAdminAccess(`/admin/pages/custom/${pageId}`);

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
        Ditt konto har inte access till den har adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: page } = await supabase
    .from("custom_pages")
    .select("id, title, slug, status, content")
    .eq("tenant_id", access.tenant.id)
    .eq("id", pageId)
    .maybeSingle();

  if (!page) notFound();
  const pageData = page;

  const content = typeof pageData.content === "object" && pageData.content ? (pageData.content as Record<string, string>) : {};

  async function saveCustomPage(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess(`/admin/pages/custom/${pageId}`);
    if (actionAccess.status !== "allowed") return;

    const title = (formData.get("title") as string)?.trim() || pageData.title;
    const slugInput = (formData.get("slug") as string)?.trim() || pageData.slug;
    const status = (formData.get("status") as string) === "published" ? "published" : "draft";
    const heroTitle = (formData.get("heroTitle") as string)?.trim() || title;
    const body = (formData.get("body") as string)?.trim() || "";
    const ctaLabel = (formData.get("ctaLabel") as string)?.trim() || "";
    const ctaHref = (formData.get("ctaHref") as string)?.trim() || "";

    const slug = slugInput
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction
      .from("custom_pages")
      .update({
        title,
        slug,
        status,
        content: {
          heroTitle,
          body,
          ctaLabel,
          ctaHref,
        },
      })
      .eq("tenant_id", actionAccess.tenant.id)
      .eq("id", pageId);

    revalidatePath(`/admin/pages/custom/${pageId}`);
    revalidatePath("/admin/pages/custom");
    revalidatePath(`/sidor/${slug}`);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Redigera custom-sida</h2>
        <Link href="/admin/pages/custom" className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
          Tillbaka
        </Link>
      </div>

      <form action={saveCustomPage} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Titel</span>
            <input name="title" defaultValue={pageData.title} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Slug</span>
            <input name="slug" defaultValue={pageData.slug} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
          <select name="status" defaultValue={pageData.status} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Hero-rubrik</span>
          <input name="heroTitle" defaultValue={content.heroTitle ?? pageData.title} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Sidinnehåll</span>
          <textarea
            name="body"
            defaultValue={content.body ?? ""}
            rows={10}
            className="w-full rounded-md border border-slate-300 p-3 text-sm"
            placeholder="Skriv sidans text här..."
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">CTA knapptext</span>
            <input name="ctaLabel" defaultValue={content.ctaLabel ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">CTA länk</span>
            <input name="ctaHref" defaultValue={content.ctaHref ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>

        <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Spara sida
        </button>
      </form>
    </section>
  );
}
