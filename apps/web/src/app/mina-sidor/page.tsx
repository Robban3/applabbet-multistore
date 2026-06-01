import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountSidebar, buildAccountSidebarItems } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorTabShellContent, usesMinaSidorTabShell } from "@/lib/mina-sidor-shell";
import { SportAccountShell } from "@/components/storefront/sport/sport-account-shell";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { formatMinorPrice } from "@/lib/format";
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

const electronicsTrustCards = [
  { title: "Fri frakt över 499 kr", text: "Snabb & spårbar leverans" },
  { title: "30 dagars öppet köp", text: "Enkelt att returnera" },
  { title: "Snabb leverans", text: "1–2 arbetsdagar" },
  { title: "Expertkunskap", text: "Vi hjälper dig rätt" },
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

  const accountCtx = await loadAccountContext();
  const isSport = accountCtx.isSport;
  const isElectronics = accountCtx.isElectronics;

  let orderCount = 0;
  let activeDeliveryCount = 0;
  const recentOrderPreviews: Array<{ id: string; title: string; quantity: number; price: string }> = [];

  if (tenant && user.email) {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("id, status, fulfillment_status, total_minor, currency, created_at")
      .eq("tenant_id", tenant.id)
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false })
      .limit(8);

    const orders = ordersData || [];
    orderCount = orders.length;
    activeDeliveryCount = orders.filter(
      (o) => o.fulfillment_status !== "delivered" && o.status !== "refunded",
    ).length;

    const orderIds = orders.slice(0, 4).map((o) => o.id);
    const { data: itemsData } = orderIds.length
      ? await supabase.from("order_items").select("order_id, product_title, quantity").in("order_id", orderIds)
      : { data: [] as Array<{ order_id: string; product_title: string; quantity: number }> };

    const firstItemByOrder = new Map<string, { product_title: string; quantity: number }>();
    for (const item of itemsData || []) {
      if (!firstItemByOrder.has(item.order_id)) {
        firstItemByOrder.set(item.order_id, {
          product_title: item.product_title,
          quantity: item.quantity,
        });
      }
    }

    for (const order of orders.slice(0, 4)) {
      const item = firstItemByOrder.get(order.id);
      recentOrderPreviews.push({
        id: order.id.slice(0, 8).toUpperCase(),
        title: item?.product_title || "Beställning",
        quantity: item?.quantity || 1,
        price: formatMinorPrice(order.total_minor, order.currency),
      });
    }
  }

  const electronicsTopCards = [
    { title: "Mina ordrar", value: String(orderCount), action: "Visa alla ordrar", href: "/mina-sidor/ordrar" },
    {
      title: "Aktiva leveranser",
      value: String(activeDeliveryCount),
      action: "Se leveransstatus",
      href: "/mina-sidor/ordrar?tab=pagaende",
    },
    { title: "Returer", value: "0", action: "Starta retur", href: "/returer-aterbetalningar?account=1" },
    ...(loyaltyProgramEnabled
      ? [{ title: "Poängsaldo", value: "120 p", action: "Se dina förmåner", href: "/mina-sidor/poang" }]
      : []),
  ];

  if (isElectronics) {
    return (
      <MinaSidorTabShellContent
        ctx={accountCtx}
        title={getCmsBlockField(cms.blocks, "overview", "title", "Översikt")}
        subtitle={getCmsBlockField(cms.blocks, "overview", "subtitle", "Här är en sammanfattning av ditt konto.")}
      >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {electronicsTopCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col justify-between rounded-[12px] border border-[#DCE6F5] bg-white p-5 shadow-[0_2px_8px_rgba(10,37,64,0.04)] transition hover:border-[#2f7dff]/40 hover:shadow-[0_4px_16px_rgba(47,125,255,0.12)]"
              >
                <p className="text-[13px] font-medium text-[#0A2540]/65">{card.title}</p>
                <p className="mt-3 text-[32px] font-bold text-[#0A2540]">{card.value}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#2f7dff] group-hover:underline">
                  {card.action}
                  <ArrowRightIcon />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[12px] border border-[#DCE6F5] bg-white p-5 shadow-[0_2px_8px_rgba(10,37,64,0.04)]">
              <div className="flex items-end justify-between">
                <h2 className="text-[20px] font-bold text-[#0A2540]">Senaste ordrar</h2>
                <Link
                  href="/mina-sidor/ordrar"
                  className="text-[14px] font-semibold text-[#2f7dff] hover:underline"
                >
                  Visa alla →
                </Link>
              </div>
              <div className="mt-4 divide-y divide-[#DCE6F5]">
                {recentOrderPreviews.length > 0 ? (
                  recentOrderPreviews.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="h-14 w-14 shrink-0 rounded-[10px] bg-[#F4F7FC]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-[#0A2540]">Order #{order.id}</p>
                        <p className="text-[13px] text-[#0A2540]/55">
                          {order.quantity} produkt{order.quantity === 1 ? "" : "er"} · {order.title}
                        </p>
                      </div>
                      <p className="text-[15px] font-bold text-[#0A2540]">{order.price}</p>
                      <Link
                        href="/mina-sidor/ordrar"
                        className="shrink-0 text-[13px] font-semibold text-[#2f7dff] hover:underline"
                      >
                        Detaljer
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-[14px] text-[#0A2540]/65">Du har inga ordrar ännu.</p>
                    <Link
                      href="/products"
                      className="mt-4 inline-flex h-10 items-center rounded-full bg-[#2f7dff] px-5 text-[14px] font-semibold text-white hover:bg-[#1a6cf0]"
                    >
                      Börja handla
                    </Link>
                  </div>
                )}
              </div>
            </article>

            <div className="space-y-6">
              <article className="rounded-[12px] border border-[#DCE6F5] bg-white p-5 shadow-[0_2px_8px_rgba(10,37,64,0.04)]">
                <div className="flex items-end justify-between">
                  <h2 className="text-[20px] font-bold text-[#0A2540]">Mina favoriter</h2>
                  <Link
                    href="/mina-sidor/favoriter"
                    className="text-[14px] font-semibold text-[#2f7dff] hover:underline"
                  >
                    Visa alla →
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="space-y-2">
                      <div className="aspect-square rounded-[10px] bg-[#F4F7FC]" />
                      <p className="line-clamp-2 text-[12px] font-medium text-[#0A2540]/55">Sparad produkt</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[12px] border border-[#DCE6F5] bg-[#EAF1FB] p-6">
                <h3 className="text-[18px] font-bold text-[#0A2540]">Behöver du hjälp?</h3>
                <p className="mt-1 text-[14px] text-[#0A2540]/65">
                  Våra teknikexperter finns här för dig — före, under och efter köpet.
                </p>
                <Link
                  href="/kundservice"
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[#2f7dff] px-6 text-[14px] font-semibold text-white hover:bg-[#1a6cf0]"
                >
                  Kontakta kundservice
                </Link>
              </article>
            </div>
          </div>

          <section className="mt-8 grid overflow-hidden rounded-[12px] border border-[#DCE6F5] bg-white sm:grid-cols-2 lg:grid-cols-4">
            {electronicsTrustCards.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[74px] flex-col justify-center border-t border-[#DCE6F5] px-5 py-4 lg:border-l lg:border-t-0 lg:first:border-l-0"
              >
                <p className="text-[13px] font-semibold text-[#0A2540]">{item.title}</p>
                <p className="text-[12px] text-[#0A2540]/55">{item.text}</p>
              </article>
            ))}
          </section>
      </MinaSidorTabShellContent>
    );
  }

  if (isSport) {
    // Layout (mina-sidor/layout.tsx) renderar header + Hej + tabs.
    // Sidan returnerar bara sitt content.
    return (
      <section className="bg-white px-6 py-10 lg:px-10">
        {/* Tiles — Nike "Recently viewed"-stil */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topCards.map((card) => (
            <Link key={card.title} href={card.href} className="group flex flex-col justify-between bg-[#f5f5f5] p-5 transition hover:bg-[#ececec]">
              <p className="text-[13px] text-[#111]">{card.title}</p>
              <p className="mt-4 text-[32px] font-medium text-[#111]">{card.value}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] text-[#111] underline-offset-2 group-hover:underline">
                {card.action} →
              </span>
            </Link>
          ))}
        </div>

        {/* Två kolumner */}
        <div className="mt-10 grid gap-10 border-t border-[#e5e5e5] pt-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-end justify-between">
              <h2 className="text-[24px] font-medium text-[#111]">Senaste ordrar</h2>
              <Link href="/mina-sidor/ordrar" className="text-[14px] font-medium text-[#111] underline-offset-2 hover:underline">Visa alla →</Link>
            </div>
            <div className="mt-5 divide-y divide-[#e5e5e5]">
              {["APL-10568", "APL-10321", "APL-10211", "APL-10005"].map((id) => (
                <div key={id} className="flex items-center gap-4 py-4">
                  <div className="h-14 w-14 shrink-0 bg-[#f5f5f5]" />
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#111]">Order #{id}</p>
                    <p className="text-[13px] text-[#757575]">2 produkter</p>
                  </div>
                  <p className="text-[15px] font-medium text-[#111]">5 597 kr</p>
                  <Link href="/mina-sidor/ordrar" className="text-[13px] text-[#111] underline-offset-2 hover:underline">Detaljer</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-end justify-between">
                <h2 className="text-[24px] font-medium text-[#111]">Leverans på väg</h2>
                <Link href="/mina-sidor/leveranser" className="text-[14px] font-medium text-[#111] underline-offset-2 hover:underline">Spåra →</Link>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-16 w-16 bg-[#f5f5f5]" />
                <div>
                  <p className="text-[15px] font-medium text-[#111]">Stride Air Runner</p>
                  <p className="text-[13px] text-[#757575]">Beräknad leverans</p>
                  <p className="text-[14px] font-medium text-[#111]">28 maj – 30 maj</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between">
                <h2 className="text-[24px] font-medium text-[#111]">Mina favoriter</h2>
                <Link href="/mina-sidor/favoriter" className="text-[14px] font-medium text-[#111] underline-offset-2 hover:underline">Visa alla →</Link>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {["Stride Air Runner", "Core Training Shirt", "Power Dumbbell Set", "Hydro Flow Flaska"].map((name) => (
                  <div key={name} className="space-y-2">
                    <div className="aspect-square bg-[#f5f5f5]" />
                    <p className="line-clamp-2 text-[12px] font-medium text-[#111]">{name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f5f5f5] p-6">
              <h3 className="text-[20px] font-medium text-[#111]">Behöver du hjälp?</h3>
              <p className="mt-1 text-[14px] text-[#757575]">Vårt kundserviceteam finns här för dig.</p>
              <Link href="/kundservice" className="mt-4 inline-flex h-11 items-center rounded-full bg-[#111] px-6 text-[14px] font-medium text-white hover:bg-black">
                Kontakta kundservice
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
          <StorefrontHeader cartCount={0} />

          <div className="px-6 py-5">
            <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
              <aside className="space-y-3 rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
                <div className="border-b border-slate-200 pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mina sidor</p>
                  <p className="mt-1 text-3xl font-semibold">{`Hej, ${greetingName} 👋`}</p>
                  <p className="text-sm text-slate-600">Välkommen tillbaka!</p>
                </div>
                <AccountSidebar activeHref="/mina-sidor" items={sidebarItems} />
                {loyaltyProgramEnabled ? (
                  <div className="rounded-xl p-4 text-white" style={{ background: "var(--store-header-gradient)" }}>
                    <p className="text-xs uppercase tracking-wide text-[color:var(--store-accent)]">Medlem</p>
                    <p className="text-2xl font-semibold">{brandName} Club</p>
                    <p className="mt-1 text-sm">Du har 120 poäng</p>
                    <Link href="/mina-sidor/poang" className="mt-3 inline-flex rounded-md bg-[color:var(--store-accent)] px-3 py-2 text-sm font-semibold text-[color:var(--store-accent-fg)]">Se dina förmåner</Link>
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
                    <article key={card.title} className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
                      <p className="text-sm text-slate-600">{card.title}</p>
                      <p className="text-4xl font-semibold text-slate-900">{card.value}</p>
                      <Link href={card.href} className="mt-1 inline-flex items-center gap-1 text-sm text-slate-700">{card.action}<ArrowRightIcon /></Link>
                    </article>
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                  <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
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
                    <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
                      <div className="mb-2 flex items-center justify-between"><h3 className="text-xl font-semibold">Leverans på väg</h3><Link href="/mina-sidor/leveranser" className="inline-flex items-center gap-1 text-sm text-slate-700">Spåra paket <ArrowRightIcon /></Link></div>
                      <div className="grid grid-cols-[90px_1fr] gap-3">
                        <div className="h-16 rounded bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b]" />
                        <div><p className="font-semibold">Nike Pegasus 41</p><p className="text-sm text-slate-600">Beräknad leverans</p><p className="font-semibold">28 maj - 30 maj</p></div>
                      </div>
                    </article>

                    <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
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

                    <article className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "var(--store-footer-border)" }}>
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

            <section
              className="mt-6 grid overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4"
              style={{ borderColor: "var(--store-footer-border)", background: "var(--store-trust-gradient)" }}
            >
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
