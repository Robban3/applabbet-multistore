import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CmsBlockComposer } from "@/components/cms-block-composer";
import { CmsEditPreviewPanel } from "@/components/cms-edit-preview-panel";
import { requireAdminAccess } from "@/lib/admin-access";
import { createDefaultBlocksContent, getCmsPage, type CmsBlocksContent } from "@/lib/cms/registry";
import { applyThemePlaceholdersToDefaults } from "@/lib/cms/theme-placeholders";
import { getCmsBlocksVariants } from "@/lib/cms/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSettings } from "@/lib/tenant-settings";

type AdminCmsEditorProps = {
  params: Promise<{ pageKey: string }>;
  searchParams: Promise<{ view?: string; saved?: string }>;
};

function parseEnabledValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  return ["true", "1", "yes", "on", "ja", "aktiv"].includes(normalized);
}

export default async function AdminCmsEditorPage({ params, searchParams }: AdminCmsEditorProps) {
  const { pageKey } = await params;
  const query = await searchParams;
  const isEditView = query.view === "edit";
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
        Ditt konto har inte åtkomst till den här adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const tenantSettings = await getTenantSettings(access.tenant);
  const activeTheme = tenantSettings?.theme_key || "classic";
  const tenantPaymentConfig = tenantSettings?.payment_config || {};
  const liveChatModel = String(tenantPaymentConfig.liveChatModel || process.env.OPENAI_MODEL || "gpt-4o-mini");
  const hasLiveChatApiKey = String(tenantPaymentConfig.liveChatApiKey || "").trim().length > 0;
  const isLiveChatPage = pageKey === "live-chat";
  const { data } = await supabase
    .from("page_content")
    .select("content, status")
    .eq("tenant_id", access.tenant.id)
    .eq("page_key", pageKey)
    .maybeSingle();

  const currentStatus = data?.status === "published" ? "published" : "draft";
  const defaultBlocks = applyThemePlaceholdersToDefaults(
    pageKey,
    activeTheme,
    createDefaultBlocksContent(pageDefinition),
  );
  const storedBlocks = getCmsBlocksVariants(data?.content);
  const mergedBlocks: CmsBlocksContent = { ...defaultBlocks };
  for (const [blockKey, fields] of Object.entries(storedBlocks.draft)) {
    mergedBlocks[blockKey] = { ...(mergedBlocks[blockKey] || {}), ...fields };
  }
  const isLiveChatEnabled = parseEnabledValue(mergedBlocks.settings?.enabled || "true");
  let previewRoute = pageDefinition.route;
  if (pageDefinition.route === "/products/[slug]") {
    const { data: productPreview } = await supabase
      .from("products")
      .select("slug")
      .eq("tenant_id", access.tenant.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (productPreview?.slug) {
      previewRoute = `/products/${productPreview.slug}`;
    } else {
      previewRoute = "/products";
    }
  }

  async function savePageContent(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess(`/admin/pages/${pageKey}`);
    if (accessAction.status !== "allowed") return;

    const intentValue = formData.get("intent");
    const intent =
      intentValue === "publish" ||
      intentValue === "preview" ||
      intentValue === "save_draft" ||
      intentValue === "reset_theme"
        ? intentValue
        : "save_draft";
    const editorView = formData.get("editorView") === "edit" ? "edit" : "classic";
    const tenantSettingsAction = await getTenantSettings(accessAction.tenant);
    const activeThemeAction = tenantSettingsAction?.theme_key || "classic";
    const paymentConfigAction = tenantSettingsAction?.payment_config || {};

    const contentBlocks =
      intent === "reset_theme"
        ? applyThemePlaceholdersToDefaults(
            pageKey,
            activeThemeAction,
            createDefaultBlocksContent(pageDefinition),
          )
        : createDefaultBlocksContent(pageDefinition);
    if (intent !== "reset_theme") {
      for (const block of pageDefinition.blocks) {
        for (const field of block.fields) {
          const formKey = `block__${block.key}__${field.key}`;
          const value = formData.get(formKey);
          if (typeof value === "string") {
            contentBlocks[block.key][field.key] = value;
          }
        }
      }
    }
    if (pageKey === "live-chat") {
      contentBlocks.settings = {
        ...(contentBlocks.settings || {}),
        enabled: formData.get("live_chat_enabled") === "on" ? "true" : "false",
      };
    }

    const supabaseAction = await createSupabaseServerClient();
    const { data: existingRow } = await supabaseAction
      .from("page_content")
      .select("content, status")
      .eq("tenant_id", accessAction.tenant.id)
      .eq("page_key", pageKey)
      .maybeSingle();

    const existingVariants = getCmsBlocksVariants(existingRow?.content);
    const publishedBlocks =
      intent === "publish"
        ? contentBlocks
        : Object.keys(existingVariants.published).length > 0
          ? existingVariants.published
          : contentBlocks;
    const status =
      intent === "publish" || existingRow?.status === "published" ? "published" : "draft";

    await supabaseAction.from("page_content").upsert(
      {
        tenant_id: accessAction.tenant.id,
        page_key: pageKey,
        status,
        content: {
          // blocks behålls för bakåtkompatibilitet.
          blocks: publishedBlocks,
          publishedBlocks,
          draftBlocks: contentBlocks,
        },
      },
      { onConflict: "tenant_id,page_key" },
    );

    if (pageKey === "live-chat") {
      const liveChatApiKeyInput = String(formData.get("live_chat_api_key") || "").trim();
      const clearLiveChatApiKey = formData.get("clear_live_chat_api_key") === "on";
      const liveChatModelInput = String(formData.get("live_chat_model") || "").trim();
      const updatedPaymentConfig: Record<string, string> = {
        ...paymentConfigAction,
      };

      if (clearLiveChatApiKey) {
        delete updatedPaymentConfig.liveChatApiKey;
      } else if (liveChatApiKeyInput) {
        updatedPaymentConfig.liveChatApiKey = liveChatApiKeyInput;
      }

      if (liveChatModelInput) {
        updatedPaymentConfig.liveChatModel = liveChatModelInput;
      } else {
        delete updatedPaymentConfig.liveChatModel;
      }

      await supabaseAction.from("tenant_settings").upsert(
        {
          tenant_id: accessAction.tenant.id,
          payment_config: updatedPaymentConfig,
        },
        { onConflict: "tenant_id" },
      );
    }

    revalidatePath(`/admin/pages/${pageKey}`);
    revalidatePath(previewRoute);
    if (previewRoute !== pageDefinition.route) {
      revalidatePath("/products");
    }
    revalidatePath("/");

    const cookieStore = await cookies();

    if (intent === "preview") {
      cookieStore.set("cms_preview_page_key", pageKey, {
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        maxAge: 60 * 60,
      });
      if (editorView === "edit") {
        redirect(`/admin/pages/${pageKey}?view=edit&saved=preview`);
      }
      redirect(previewRoute);
    }

    if (intent === "publish") {
      cookieStore.delete("cms_preview_page_key");
      redirect(`/admin/pages/${pageKey}?${editorView === "edit" ? "view=edit&" : ""}saved=published`);
    }
    if (intent === "reset_theme") {
      redirect(`/admin/pages/${pageKey}?${editorView === "edit" ? "view=edit&" : ""}saved=theme-reset`);
    }

    redirect(`/admin/pages/${pageKey}?${editorView === "edit" ? "view=edit&" : ""}saved=draft`);
  }

  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${isEditView ? "p-3" : "p-5"}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            CMS: {pageDefinition.title}
          </h2>
          <p className="text-sm text-slate-600">
            Route: <span className="font-mono">{pageDefinition.route}</span> · Sida-nyckel: <span className="font-mono">{pageDefinition.key}</span>
          </p>
          <p className="text-xs text-slate-500">
            Aktivt tema: <span className="font-mono">{activeTheme}</span> (theme-baserade placeholders visas i editorn)
          </p>
          {previewRoute !== pageDefinition.route ? (
            <p className="text-xs text-slate-500">
              Preview öppnas på: <span className="font-mono">{previewRoute}</span>
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/pages/${pageKey}${isEditView ? "" : "?view=edit"}`}
            className="inline-flex rounded-md border border-sky-300 bg-sky-50 px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-100"
          >
            {isEditView ? "Klassisk vy" : "Edit view"}
          </Link>
          <Link href="/admin/pages" className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            Tillbaka
          </Link>
        </div>
      </div>

      <form action={savePageContent} className="space-y-3">
        <input type="hidden" name="editorView" value={isEditView ? "edit" : "classic"} />
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          Live-status:{" "}
          <span className="font-semibold">
            {currentStatus === "published" ? "Publicerad" : "Utkast"}
          </span>
        </div>
        {query.saved ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            {query.saved === "preview"
              ? "Preview uppdaterad med senaste utkast."
              : query.saved === "published"
                ? "Sidan publicerades."
                : query.saved === "theme-reset"
                  ? `Utkastet återställdes till preset för temat "${activeTheme}".`
                : "Utkast sparat."}
          </p>
        ) : null}

        {isLiveChatPage ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
            <p className="font-semibold">AI-nyckel per butik (server-side)</p>
            <p className="mt-1 text-xs text-amber-800">
              Nyckeln sparas endast i tenant-inställningar och skickas aldrig ut till klienten.
            </p>
            <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-800">
              <input type="checkbox" name="live_chat_enabled" defaultChecked={isLiveChatEnabled} />
              Aktivera livechat på storefront
            </label>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Ny API-nyckel (OpenAI)</span>
                <input
                  type="password"
                  name="live_chat_api_key"
                  autoComplete="off"
                  placeholder={hasLiveChatApiKey ? "En nyckel är redan sparad. Skriv ny för att byta." : "sk-..."}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">AI-modell (valfritt)</span>
                <input
                  name="live_chat_model"
                  defaultValue={liveChatModel}
                  placeholder="gpt-4o-mini"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" name="clear_live_chat_api_key" />
              Rensa sparad API-nyckel
            </label>
            <p className="mt-2 text-xs text-slate-600">
              Status: {hasLiveChatApiKey ? "Egen API-nyckel är konfigurerad för tenant." : "Ingen tenant-nyckel sparad (fallback till OPENAI_API_KEY)."}
            </p>
          </div>
        ) : null}

        {isEditView ? (
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <CmsBlockComposer blocks={pageDefinition.blocks} initialValues={mergedBlocks} pageKey={pageKey} />
            </div>
            <div>
              <CmsEditPreviewPanel previewRoute={previewRoute} pageKey={pageKey} />
            </div>
          </div>
        ) : (
          <CmsBlockComposer blocks={pageDefinition.blocks} initialValues={mergedBlocks} pageKey={pageKey} />
        )}

        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Den här sidan använder block-baserad CMS-redigering. Alla fält sparas som
          {' '}
          <span className="font-mono">content.blocks</span>
          {' '}
          per sida och tenant.
        </div>

        <div className={`flex flex-wrap gap-2 ${isEditView ? "sticky bottom-3 z-20 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur" : ""}`}>
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
            value="reset_theme"
            className="inline-flex rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
          >
            Återställ till aktivt tema
          </button>
          <button
            type="submit"
            name="intent"
            value="preview"
            formTarget={isEditView ? undefined : "_blank"}
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
