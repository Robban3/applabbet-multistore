import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import {
  getCustomBlockLabel,
  normalizeCustomBlocks,
  type CustomPageBlock,
} from "@/lib/cms/custom-page-blocks";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type CustomPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomCmsPage({ params }: CustomPageProps) {
  const { slug } = await params;
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);

  if (!tenant) notFound();

  const cookieStore = await cookies();
  const previewPageId = cookieStore.get("cms_preview_custom_page_id")?.value;
  const supabase = createSupabaseAdminClient();
  let page:
    | {
        id?: string;
        title: string;
        content: unknown;
        status: string;
        slug?: string;
      }
    | null = null;

  if (previewPageId) {
    const supabaseServer = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (user) {
      const { data: membership } = await supabaseServer
        .from("tenant_users")
        .select("id")
        .eq("tenant_id", tenant.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership) {
        const { data: previewPage } = await supabase
          .from("custom_pages")
          .select("id, title, slug, content, status")
          .eq("tenant_id", tenant.id)
          .eq("id", previewPageId)
          .maybeSingle();
        if (previewPage) {
          if (previewPage.slug !== slug) {
            redirect(`/sidor/${previewPage.slug}`);
          }
          page = previewPage;
        }
      }
    }
  }

  if (!page) {
    const { data: publishedPage } = await supabase
      .from("custom_pages")
      .select("id, title, slug, content, status")
      .eq("tenant_id", tenant.id)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    page = publishedPage;
  }

  if (!page) notFound();

  const content =
    typeof page.content === "object" && page.content
      ? (page.content as Record<string, unknown>)
      : {};
  const blocks = normalizeCustomBlocks(content.blocks);
  const legacyHeroTitle = typeof content.heroTitle === "string" ? content.heroTitle : page.title;
  const legacyBody = typeof content.body === "string" ? content.body : "";
  const legacyCtaLabel = typeof content.ctaLabel === "string" ? content.ctaLabel : "";
  const legacyCtaHref = typeof content.ctaHref === "string" ? content.ctaHref : "";

  const renderedBlocks: CustomPageBlock[] =
    blocks.length > 0
      ? blocks
      : [
          {
            id: "legacy-hero",
            type: "hero",
            data: {
              eyebrow: "CMS-SIDA",
              title: legacyHeroTitle,
              subtitle: "",
            },
          },
          {
            id: "legacy-text",
            type: "text",
            data: {
              title: "",
              body: legacyBody,
            },
          },
          ...(legacyCtaLabel && legacyCtaHref
            ? [
                {
                  id: "legacy-cta",
                  type: "cta" as const,
                  data: {
                    title: "",
                    text: "",
                    label: legacyCtaLabel,
                    href: legacyCtaHref,
                  },
                },
              ]
            : []),
        ];

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          {renderedBlocks.map((block) => {
            if (block.type === "hero") {
              return (
                <header
                  key={block.id}
                  className="bg-gradient-to-b from-[#11100d] via-[#12100e] to-[#0e0d0b] px-6 py-10 text-white"
                >
                  <p className="text-xs tracking-[0.26em] text-[#c8a164]">
                    {block.data.eyebrow || "CMS-SIDA"}
                  </p>
                  <h1 className="mt-3 text-5xl font-semibold">{block.data.title || page.title}</h1>
                  {block.data.subtitle ? (
                    <p className="mt-3 max-w-3xl text-sm text-slate-200">{block.data.subtitle}</p>
                  ) : null}
                </header>
              );
            }

            if (block.type === "text") {
              return (
                <article key={block.id} className="space-y-4 px-6 py-6">
                  {block.data.title ? (
                    <h2 className="text-3xl font-semibold text-slate-900">{block.data.title}</h2>
                  ) : null}
                  {(block.data.body || "").split("\n").map((paragraph, index) => (
                    <p key={`${block.id}-${index}`} className="text-sm leading-relaxed text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </article>
              );
            }

            if (block.type === "image") {
              if (!block.data.src) return null;
              return (
                <figure key={block.id} className="px-6 py-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.data.src}
                    alt={block.data.alt || ""}
                    className="w-full rounded-lg border border-[#e8dfd1] object-cover"
                  />
                  {block.data.caption ? (
                    <figcaption className="mt-2 text-sm text-slate-600">{block.data.caption}</figcaption>
                  ) : null}
                </figure>
              );
            }

            if (block.type === "cta") {
              return (
                <section key={block.id} className="mx-6 my-4 rounded-lg border border-[#e8dfd1] bg-[#fcf8f2] px-5 py-4">
                  {block.data.title ? (
                    <h2 className="text-xl font-semibold text-slate-900">{block.data.title}</h2>
                  ) : null}
                  {block.data.text ? (
                    <p className="mt-1 text-sm text-slate-700">{block.data.text}</p>
                  ) : null}
                  {block.data.label && block.data.href ? (
                    <Link
                      href={block.data.href}
                      className="mt-3 inline-flex rounded-md bg-[#c8a164] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#b88f50]"
                    >
                      {block.data.label}
                    </Link>
                  ) : null}
                </section>
              );
            }

            if (block.type === "faq") {
              return (
                <section key={block.id} className="px-6 py-6">
                  <h2 className="text-3xl font-semibold text-slate-900">{block.data.title || "FAQ"}</h2>
                  <div className="mt-3 space-y-2">
                    {[1, 2].map((n) => {
                      const q = block.data[`q${n}`];
                      const a = block.data[`a${n}`];
                      if (!q && !a) return null;
                      return (
                        <details key={`${block.id}-${n}`} className="rounded-md border border-slate-200 px-3 py-2">
                          <summary className="cursor-pointer text-sm font-medium text-slate-800">{q || `Fraga ${n}`}</summary>
                          <p className="mt-2 text-sm text-slate-700">{a || ""}</p>
                        </details>
                      );
                    })}
                  </div>
                </section>
              );
            }

            if (block.type === "split") {
              return (
                <section key={block.id} className="grid gap-4 px-6 py-6 md:grid-cols-2">
                  <article className="rounded-md border border-slate-200 p-4">
                    <h3 className="text-xl font-semibold text-slate-900">{block.data.leftTitle}</h3>
                    <p className="mt-1 text-sm text-slate-700">{block.data.leftBody}</p>
                  </article>
                  <article className="rounded-md border border-slate-200 p-4">
                    <h3 className="text-xl font-semibold text-slate-900">{block.data.rightTitle}</h3>
                    <p className="mt-1 text-sm text-slate-700">{block.data.rightBody}</p>
                  </article>
                </section>
              );
            }

            return (
              <section key={block.id} className="px-6 py-6">
                <h2 className="text-3xl font-semibold text-slate-900">{getCustomBlockLabel(block.type)}</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <article key={`${block.id}-${n}`} className="rounded-md border border-slate-200 p-3">
                      <h3 className="text-sm font-semibold text-slate-900">{block.data[`item${n}Title`] || ""}</h3>
                      <p className="mt-1 text-xs text-slate-600">{block.data[`item${n}Text`] || ""}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
