import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CustomPageBlockEditor } from "@/components/custom-page-block-editor";
import { requireAdminAccess } from "@/lib/admin-access";
import {
  getCustomBlockTemplate,
  normalizeCustomBlocks,
  type CustomPageBlock,
} from "@/lib/cms/custom-page-blocks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminCustomPageEditorProps = {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminCustomPageEditor({ params, searchParams }: AdminCustomPageEditorProps) {
  const { pageId } = await params;
  const query = await searchParams;
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
        Ditt konto har inte åtkomst till den här adminpanelen.
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
  const currentStatus = pageData.status === "published" ? "published" : "draft";

  const content =
    typeof pageData.content === "object" && pageData.content
      ? (pageData.content as Record<string, unknown>)
      : {};
  const existingBlocks = normalizeCustomBlocks(content.blocks);
  const legacyHeroTitle = typeof content.heroTitle === "string" ? content.heroTitle : pageData.title;
  const legacyBody = typeof content.body === "string" ? content.body : "";
  const legacyCtaLabel = typeof content.ctaLabel === "string" ? content.ctaLabel : "";
  const legacyCtaHref = typeof content.ctaHref === "string" ? content.ctaHref : "";
  const initialBlocks: CustomPageBlock[] =
    existingBlocks.length > 0
      ? existingBlocks
      : [
          {
            ...getCustomBlockTemplate("hero"),
            data: {
              ...getCustomBlockTemplate("hero").data,
              title: legacyHeroTitle,
            },
          },
          {
            ...getCustomBlockTemplate("text"),
            data: {
              ...getCustomBlockTemplate("text").data,
              body: legacyBody,
            },
          },
          ...(legacyCtaLabel && legacyCtaHref
            ? [
                {
                  ...getCustomBlockTemplate("cta"),
                  data: {
                    ...getCustomBlockTemplate("cta").data,
                    label: legacyCtaLabel,
                    href: legacyCtaHref,
                  },
                },
              ]
            : []),
        ];

  async function saveCustomPage(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess(`/admin/pages/custom/${pageId}`);
    if (actionAccess.status !== "allowed") return;

    const title = (formData.get("title") as string)?.trim() || pageData.title;
    const slugInput = (formData.get("slug") as string)?.trim() || pageData.slug;
    const intentValue = formData.get("intent");
    const intent =
      intentValue === "publish" || intentValue === "preview" || intentValue === "save_draft"
        ? intentValue
        : "save_draft";
    const status =
      intent === "publish"
        ? "published"
        : intent === "save_draft"
          ? "draft"
          : pageData.status;
    const blocksPayload = String(formData.get("blocksPayload") || "[]");
    let parsedBlocks = normalizeCustomBlocks([]);
    try {
      parsedBlocks = normalizeCustomBlocks(JSON.parse(blocksPayload));
    } catch {
      parsedBlocks = normalizeCustomBlocks([]);
    }

    const slug = slugInput
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      redirect(`/admin/pages/custom/${pageId}?status=error&message=${encodeURIComponent("Ogiltig slug.")}`);
    }

    const heroBlock = parsedBlocks.find((block) => block.type === "hero");
    const textBlock = parsedBlocks.find((block) => block.type === "text");
    const ctaBlock = parsedBlocks.find((block) => block.type === "cta");
    const heroTitle = heroBlock?.data.title || title;
    const body = textBlock?.data.body || "";
    const ctaLabel = ctaBlock?.data.label || "";
    const ctaHref = ctaBlock?.data.href || "";

    const supabaseAction = await createSupabaseServerClient();
    const { error } = await supabaseAction
      .from("custom_pages")
      .update({
        title,
        slug,
        status,
        content: {
          blocks: parsedBlocks,
          heroTitle,
          body,
          ctaLabel,
          ctaHref,
        },
      })
      .eq("tenant_id", actionAccess.tenant.id)
      .eq("id", pageId);

    if (error) {
      redirect(
        `/admin/pages/custom/${pageId}?status=error&message=${encodeURIComponent(`Kunde inte spara sidan: ${error.message}`)}`,
      );
    }

    revalidatePath(`/admin/pages/custom/${pageId}`);
    revalidatePath("/admin/pages/custom");
    revalidatePath(`/sidor/${slug}`);
    const cookieStore = await cookies();
    if (intent === "preview") {
      cookieStore.set("cms_preview_custom_page_id", pageId, {
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        maxAge: 60 * 60,
      });
      redirect(`/sidor/${slug}`);
    }

    if (intent === "publish") {
      cookieStore.delete("cms_preview_custom_page_id");
      redirect(
        `/admin/pages/custom/${pageId}?status=success&message=${encodeURIComponent(
          "Sidan publicerades.",
        )}`,
      );
    }

    redirect(
      `/admin/pages/custom/${pageId}?status=success&message=${encodeURIComponent(
        "Sidan sparades som utkast.",
      )}`,
    );
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
        {query.message ? (
          <p
            className={`rounded-md border px-3 py-2 text-sm ${
              query.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {query.message}
          </p>
        ) : null}

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

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          Live-status:{" "}
          <span className="font-semibold">
            {currentStatus === "published" ? "Publicerad" : "Utkast"}
          </span>
        </div>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Block & komponenter</legend>
          <CustomPageBlockEditor initialBlocks={initialBlocks} />
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            name="intent"
            value="save_draft"
            className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Spara utkast
          </button>
          <button
            type="submit"
            name="intent"
            value="preview"
            formTarget="_blank"
            className="inline-flex rounded-md border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
          >
            Preview
          </button>
          <button
            type="submit"
            name="intent"
            value="publish"
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Publicera
          </button>
        </div>
      </form>
    </section>
  );
}
