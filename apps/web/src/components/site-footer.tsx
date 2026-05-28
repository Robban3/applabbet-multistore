import Link from "next/link";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getTenantSettings } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

const footerGroups = [
  {
    title: "Support",
    links: [
      { label: "Kundservice", href: "/kundservice" },
      { label: "Returer & återbetalningar", href: "/returer-aterbetalningar" },
      { label: "Leverans", href: "/leverans" },
    ],
  },
  {
    title: "Juridiskt",
    links: [
      { label: "Köpvillkor", href: "/kopvillkor" },
      { label: "Integritetspolicy", href: "/integritetspolicy" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

function GroupIcon({ title }: { title: string }) {
  if (title === "Support") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#c8a164]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-5h4" />
        <path d="M4 13h4v5H6a2 2 0 0 1-2-2v-3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#c8a164]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#c8a164]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6h9v9" />
      <path d="m8 16 10-10" />
    </svg>
  );
}

export async function SiteFooter() {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const definition = getCmsPage("footer");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("footer", { blocks: fallbackBlocks });
  const brandName = settings?.brand_name || tenant?.name || "APPLABBET";
  const normalizedBrandHandle = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const companyName = settings?.company_name || `${brandName} AB`;
  const supportEmail = settings?.support_email || `info@${normalizedBrandHandle || "store"}.se`;
  const footerLogoUrl = getCmsBlockField(cms.blocks, "brand", "logoUrl", settings?.logo_url ?? "");
  const footerBrandName = getCmsBlockField(cms.blocks, "brand", "brandName", brandName);
  const footerDescription = getCmsBlockField(
    cms.blocks,
    "brand",
    "description",
    "Premiumprodukter för träning, rörelse och vardag.",
  );
  const footerCompanyLine = getCmsBlockField(cms.blocks, "brand", "companyLine", companyName);
  const footerEmailLine = getCmsBlockField(cms.blocks, "brand", "emailLine", supportEmail);
  const cmsFooterGroups = [1, 2, 3]
    .map((groupNumber) => ({
    title: getCmsBlockField(cms.blocks, `group${groupNumber}`, "title", footerGroups[groupNumber - 1]?.title ?? ""),
    links: [1, 2, 3]
      .map((linkNumber) => ({
        label: getCmsBlockField(
          cms.blocks,
          `group${groupNumber}`,
          `link${linkNumber}Label`,
          footerGroups[groupNumber - 1]?.links[linkNumber - 1]?.label ?? "",
        ),
        href: getCmsBlockField(
          cms.blocks,
          `group${groupNumber}`,
          `link${linkNumber}Href`,
          footerGroups[groupNumber - 1]?.links[linkNumber - 1]?.href ?? "/",
        ),
      }))
      .filter((link) => link.label.trim()),
    }))
    .filter((group, index) => {
      if (index < 2) return true;
      return Boolean(group.title.trim() || group.links.length > 0);
    });
  const copyrightLine = getCmsBlockField(
    cms.blocks,
    "meta",
    "copyright",
    `© ${new Date().getFullYear()} ${footerBrandName}. Alla rättigheter förbehållna.`,
  );
  const footerGridClass = cmsFooterGroups.length >= 3 ? "sm:grid-cols-4" : "sm:grid-cols-3";

  return (
    <footer className="border-t border-[#e4d9cc] bg-[#f6f3ee]">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-5">
        <div className={`grid gap-6 bg-[#0f0f0f] px-6 py-8 ${footerGridClass}`}>
          <div>
          {footerLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={footerLogoUrl} alt={footerBrandName} className="h-8 w-auto object-contain" />
          ) : null}
            <p className="text-xs tracking-[0.26em] text-[#b88f50]">{footerBrandName}</p>
            <p className="mt-2 text-sm text-white/70">{footerDescription}</p>
            <p className="mt-2 text-xs text-white/60">{footerCompanyLine}</p>
            <p className="text-xs text-white/60">{footerEmailLine}</p>
          </div>

          {cmsFooterGroups.map((group) => (
            <div key={group.title}>
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <GroupIcon title={group.title} />
                {group.title}
              </p>
              <div className="mt-2 space-y-1">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 transition hover:text-[#c8a164]"
                  >
                    <LinkIcon />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 bg-[#0f0f0f] px-6 pb-4 pt-3">
          <p className="text-center text-xs text-white/55">{copyrightLine}</p>
        </div>
      </div>
    </footer>
  );
}
