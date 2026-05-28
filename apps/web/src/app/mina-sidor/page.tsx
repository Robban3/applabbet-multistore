import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountSidebar, buildAccountSidebarItems } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSettings } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

const trustCards = [
  { title: "Fri frakt över 499 kr", text: "Snabb & spårbar leverans" },
  { title: "30 dagars öppet köp", text: "Enkelt att returnera" },
  { title: "Premium kvalitet", text: "Utvalt med omsorg" },
  { title: "Säker betalning", text: "Tryggt & säkert" },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default async function MinaSidorPage() {
  const definition = getCmsPage("mina-sidor");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("mina-sidor", { blocks: fallbackBlocks });
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/konto/login?next=/mina-sidor");
  }

  let greetingName = "där";
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const loyaltyProgramEnabled = settings?.loyalty_program_enabled ?? false;
  const brandName = await getStoreBrandName();
  const sidebarItems = buildAccountSidebarItems(loyaltyProgramEnabled);
  const topCards = [
    { title: "Mina ordrar", value: "8", action: "Visa alla ordrar", href: "/mina-sidor/ordrar" },
    { title: "Aktiva leveranser", value: "1", action: "Se leveransstatus", href: "/mina-sidor/leveranser" },
    { title: "Returer", value: "0", action: "Starta retur", href: "/returer-aterbetalningar?account=1" },
    ...(loyaltyProgramEnabled
      ? [{ title: "Poängsaldo", value: "120 p", action: "Se dina förmåner", href: "/mina-sidor/poang" }]
      : []),
  ];
  const fullNameFromAuth = String(user.user_metadata?.full_name || "").trim();
  const fallbackName = fullNameFromAuth || (user.email ? user.email.split("@")[0] : "");

  if (tenant) {
    const [firstNameMeta, ...rest] = fullNameFromAuth.split(" ").filter(Boolean);
    await supabase.from("customer_profiles").upsert(
      {
        tenant_id: tenant.id,
        user_id: user.id,
        email: user.email || "",
        first_name: firstNameMeta || null,
        last_name: rest.join(" ") || null,
      },
      { onConflict: "tenant_id,user_id" },
    );

    const { data: profile } = await supabase
      .from("customer_profiles")
      .select("first_name, last_name")
      .eq("tenant_id", tenant.id)
      .eq("user_id", user.id)
      .maybeSingle();
    const fullNameFromProfile = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
    greetingName = fullNameFromProfile || fallbackName || greetingName;
  } else if (fallbackName) {
    greetingName = fallbackName;
  }

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={0} />

          <div className="px-6 py-5">
            <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
              <aside className="space-y-3 rounded-xl border border-[#e6ddd1] bg-white p-4">
                <div className="border-b border-slate-200 pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mina sidor</p>
                  <p className="mt-1 text-3xl font-semibold">{`Hej, ${greetingName} 👋`}</p>
                  <p className="text-sm text-slate-600">Välkommen tillbaka!</p>
                </div>
                <AccountSidebar activeHref="/mina-sidor" items={sidebarItems} />
                {loyaltyProgramEnabled ? (
                  <div className="rounded-xl bg-gradient-to-r from-[#11100d] to-[#1f1811] p-4 text-white">
                    <p className="text-xs uppercase tracking-wide text-[#c8a164]">Medlem</p>
                    <p className="text-2xl font-semibold">{brandName} Club</p>
                    <p className="mt-1 text-sm">Du har 120 poäng</p>
                    <Link href="/mina-sidor/poang" className="mt-3 inline-flex rounded-md bg-[#c8a164] px-3 py-2 text-sm font-semibold text-slate-900">Se dina förmåner</Link>
                  </div>
                ) : null}
              </aside>

              <section className="space-y-4">
                <header>
                  <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                    {getCmsBlockField(cms.blocks, "overview", "title", "Översikt")}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {getCmsBlockField(cms.blocks, "overview", "subtitle", "Här är en sammanfattning av ditt konto.")}
                  </p>
                </header>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {topCards.map((card) => (
                    <article key={card.title} className="rounded-xl border border-[#e6ddd1] bg-white p-4">
                      <p className="text-sm text-slate-600">{card.title}</p>
                      <p className="text-4xl font-semibold text-slate-900">{card.value}</p>
                      <Link href={card.href} className="mt-1 inline-flex items-center gap-1 text-sm text-slate-700">{card.action}<ArrowRightIcon /></Link>
                    </article>
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                  <article className="rounded-xl border border-[#e6ddd1] bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Senaste ordrar</h2>
                      <Link href="/mina-sidor/ordrar" className="inline-flex items-center gap-1 text-sm text-slate-700">Visa alla ordrar <ArrowRightIcon /></Link>
                    </div>
                    <div className="space-y-2">
                      {["APL-10568", "APL-10321", "APL-10211", "APL-10005"].map((id) => (
                        <div key={id} className="grid grid-cols-[90px_1fr_auto_auto] items-center gap-3 rounded-md border border-slate-200 p-2">
                          <div className="h-14 rounded bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b]" />
                          <div><p className="font-semibold">Order #{id}</p><p className="text-xs text-slate-500">2 produkter</p></div>
                          <p className="font-semibold">5 597 kr</p>
                          <Link href="/mina-sidor/ordrar" className="rounded border border-slate-300 px-2 py-1 text-xs">Visa detaljer</Link>
                        </div>
                      ))}
                    </div>
                  </article>

                  <div className="space-y-3">
                    <article className="rounded-xl border border-[#e6ddd1] bg-white p-4">
                      <div className="mb-2 flex items-center justify-between"><h3 className="text-xl font-semibold">Leverans på väg</h3><Link href="/mina-sidor/leveranser" className="inline-flex items-center gap-1 text-sm text-slate-700">Spåra paket <ArrowRightIcon /></Link></div>
                      <div className="grid grid-cols-[90px_1fr] gap-3">
                        <div className="h-16 rounded bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b]" />
                        <div><p className="font-semibold">Nike Pegasus 41</p><p className="text-sm text-slate-600">Beräknad leverans</p><p className="font-semibold">28 maj - 30 maj</p></div>
                      </div>
                    </article>

                    <article className="rounded-xl border border-[#e6ddd1] bg-white p-4">
                      <div className="mb-2 flex items-center justify-between"><h3 className="text-xl font-semibold">Mina favoriter</h3><Link href="/mina-sidor/favoriter" className="inline-flex items-center gap-1 text-sm text-slate-700">Visa alla <ArrowRightIcon /></Link></div>
                      <div className="grid grid-cols-4 gap-2">
                        {["Nike Dr-FIT Jacket", "SmartShake Reforce", "Under Armour Blitzing", "Nike Everyday Plus"].map((name) => (
                          <div key={name} className="space-y-1">
                            <div className="h-16 rounded bg-gradient-to-br from-[#31271d] via-[#1b1611] to-[#0f0d0b]" />
                            <p className="line-clamp-2 text-xs font-medium">{name}</p>
                            <p className="text-xs font-semibold">149 kr</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-xl border border-[#e6ddd1] bg-white">
                      <div className="grid grid-cols-[1fr_170px] items-stretch">
                        <div className="p-4">
                          <h3 className="text-2xl font-semibold text-slate-900">Behöver du hjälp?</h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Vårt kundserviceteam finns här för dig.
                          </p>
                          <Link href="/kundservice" className="mt-3 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                            Kontakta kundservice <ArrowRightIcon />
                          </Link>
                        </div>
                        <div className="h-full bg-gradient-to-br from-[#d9d3cb] via-[#bcb5ad] to-[#7f776f]" />
                      </div>
                    </article>
                  </div>
                </div>
              </section>
            </div>

            <section className="mt-6 grid overflow-hidden rounded-xl border border-[#e6ddd1] bg-[#faf6ef] sm:grid-cols-2 lg:grid-cols-4">
              {trustCards.map((item) => (
                <article key={item.title} className="flex min-h-[74px] flex-col justify-center border-t border-[#e7ddcf] px-5 py-3 lg:border-l lg:border-t-0 lg:first:border-l-0">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.text}</p>
                </article>
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
