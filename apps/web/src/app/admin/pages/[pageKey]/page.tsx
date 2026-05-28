import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { createDefaultBlocksContent, getCmsPage, type CmsBlocksContent } from "@/lib/cms/registry";
import { getCmsBlocksContent } from "@/lib/cms/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminCmsEditorProps = {
  params: Promise<{ pageKey: string }>;
};

export default async function AdminCmsEditorPage({ params }: AdminCmsEditorProps) {
  const { pageKey } = await params;
  const page = getCmsPage(pageKey);
  if (!page) notFound();
  const pageDefinition = page;

  const access = await requireAdminAccess(`/admin/pages/${pageKey}`);

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
  const { data } = await supabase
    .from("page_content")
    .select("content, status")
    .eq("tenant_id", access.tenant.id)
    .eq("page_key", pageKey)
    .maybeSingle();

  const currentStatus = data?.status === "published" ? "published" : "draft";
  const defaultBlocks = createDefaultBlocksContent(pageDefinition);
  const storedBlocks = getCmsBlocksContent(data?.content);
  const mergedBlocks: CmsBlocksContent = { ...defaultBlocks };
  for (const [blockKey, fields] of Object.entries(storedBlocks)) {
    mergedBlocks[blockKey] = { ...(mergedBlocks[blockKey] || {}), ...fields };
  }

  async function savePageContent(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess(`/admin/pages/${pageKey}`);
    if (accessAction.status !== "allowed") return;

    const status = formData.get("status");
    if (typeof status !== "string") return;

    const contentBlocks = createDefaultBlocksContent(pageDefinition);
    for (const block of pageDefinition.blocks) {
      for (const field of block.fields) {
        const formKey = `block__${block.key}__${field.key}`;
        const value = formData.get(formKey);
        if (typeof value === "string") {
          contentBlocks[block.key][field.key] = value;
        }
      }
    }

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("page_content").upsert(
      {
        tenant_id: accessAction.tenant.id,
        page_key: pageKey,
        status: status === "published" ? "published" : "draft",
        content: {
          blocks: contentBlocks,
        },
      },
      { onConflict: "tenant_id,page_key" },
    );

    revalidatePath(`/admin/pages/${pageKey}`);
    revalidatePath(pageDefinition.route);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            CMS: {pageDefinition.title}
          </h2>
          <p className="text-sm text-slate-600">
            Route: <span className="font-mono">{pageDefinition.route}</span> · Sida-nyckel: <span className="font-mono">{pageDefinition.key}</span>
          </p>
        </div>
        <Link href="/admin/pages" className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
          Tillbaka
        </Link>
      </div>

      <form action={savePageContent} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
          <select
            name="status"
            defaultValue={currentStatus}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        {pageDefinition.blocks.map((block) => (
          <fieldset key={block.key} className="rounded-lg border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-800">{block.title}</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {block.fields.map((field) => {
                const inputName = `block__${block.key}__${field.key}`;
                const currentValue = mergedBlocks[block.key]?.[field.key] ?? field.defaultValue;
                const isTextarea = field.type === "textarea";

                return (
                  <label key={field.key} className={`block ${isTextarea ? "md:col-span-2" : ""}`}>
                    <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
                    {isTextarea ? (
                      <textarea
                        name={inputName}
                        defaultValue={currentValue}
                        rows={4}
                        placeholder={field.placeholder}
                        className="w-full rounded-md border border-slate-300 p-3 text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        name={inputName}
                        defaultValue={currentValue}
                        placeholder={field.placeholder}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Den här sidan använder block-baserad CMS-redigering. Alla fält sparas som
          {' '}
          <span className="font-mono">content.blocks</span>
          {' '}
          per sida och tenant.
        </div>

        <button
          type="submit"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Spara sida
        </button>
      </form>
    </section>
  );
}
