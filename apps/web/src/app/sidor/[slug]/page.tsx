import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type CustomPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomCmsPage({ params }: CustomPageProps) {
  const { slug } = await params;
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);

  if (!tenant) notFound();

  const supabase = createSupabaseAdminClient();
  const { data: page } = await supabase
    .from("custom_pages")
    .select("title, content, status")
    .eq("tenant_id", tenant.id)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!page) notFound();

  const content = typeof page.content === "object" && page.content ? (page.content as Record<string, string>) : {};
  const heroTitle = content.heroTitle || page.title;
  const body = content.body || "";
  const ctaLabel = content.ctaLabel || "";
  const ctaHref = content.ctaHref || "";

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <header className="bg-gradient-to-b from-[#11100d] via-[#12100e] to-[#0e0d0b] px-6 py-10 text-white">
            <p className="text-xs tracking-[0.26em] text-[#c8a164]">CMS-SIDA</p>
            <h1 className="mt-3 text-5xl font-semibold">{heroTitle}</h1>
          </header>
          <article className="space-y-4 px-6 py-6">
            {body.split("\n").map((paragraph, index) => (
              <p key={`${paragraph}-${index}`} className="text-sm leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}
            {ctaLabel && ctaHref ? (
              <Link
                href={ctaHref}
                className="inline-flex rounded-md bg-[#c8a164] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#b88f50]"
              >
                {ctaLabel}
              </Link>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
}
