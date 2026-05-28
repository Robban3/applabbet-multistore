import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";
import { formatMinorPrice } from "@/lib/format";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

const navItems = [
  { label: "Hem", href: "/" },
  { label: "Kategorier", href: "/products" },
  { label: "Nyheter", href: "/nyheter" },
  { label: "Bästsäljare", href: "/bastsaljare" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
];

const trustCards = [
  { title: "Fri frakt över 499 kr", text: "Snabb och spårbar leverans med PostNord.", icon: "truck" },
  { title: "30 dagars öppet köp", text: "Enkelt att returnera om du inte är nöjd.", icon: "rotate" },
  { title: "Säker betalning", text: "Vi använder krypterad betalning.", icon: "shield" },
  { title: "Kundservice", text: "Vi finns här för dig - alla dagar 08-20.", icon: "headset" },
] as const;

const bottomHighlights = [
  { title: "Exklusiva erbjudanden", text: "Få tillgång till unika deals och kampanjer.", icon: "tag" },
  { title: "Nyheter först", text: "Bli först med att se nya produkter och drops.", icon: "bell" },
  { title: "Bonus på alla köp", text: "Tjäna poäng och få rabatt på framtida köp.", icon: "star" },
] as const;

function TrustIcon({ type }: { type: (typeof trustCards)[number]["icon"] }) {
  if (type === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.7" />
        <circle cx="17" cy="18" r="1.7" />
      </svg>
    );
  }
  if (type === "rotate") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 5v5h-5" />
        <path d="M4 19v-5h5" />
        <path d="M19 10a7 7 0 0 0-12-3" />
        <path d="M5 14a7 7 0 0 0 12 3" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 3v6c0 4.4-2.7 7.6-7 9-4.3-1.4-7-4.6-7-9V6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}

function BottomIcon({ type }: { type: (typeof bottomHighlights)[number]["icon"] }) {
  if (type === "tag") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11l8-8h7l3 3v7l-8 8-10-10z" />
        <circle cx="15.5" cy="8.5" r="1" />
      </svg>
    );
  }
  if (type === "bell") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 9a6 6 0 1 1 12 0v5l2 2H4l2-2z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.5 5-.7z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.6 2.6L16 9.2" />
    </svg>
  );
}

interface OrderConfirmationPageProps {
  searchParams: Promise<{
    order_id?: string;
  }>;
}

function formatDateLabel(value: string | null): string {
  if (!value) return "25 maj 2024, 10:42";
  const date = new Date(value);
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const definition = getCmsPage("order-confirmation");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("order-confirmation", { blocks: fallbackBlocks });

  const { order_id } = await searchParams;
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();
  const supabase = createSupabaseAdminClient();

  let orderNumber = "APL-2024-10568";
  let orderDate = "25 maj 2024, 10:42";
  let totalMinor = 559700;
  let shippingPriceMinor = 0;
  let currency = "SEK";
  let customerEmail = "anna.ekstrom@example.se";
  let itemCount = 3;
  let paymentProviderLabel = "Stripe";
  let shippingMethodLabel = "Hemleverans";
  let estimatedDeliveryLabel = "28 maj - 30 maj";
  let orderItems: Array<{ title: string; quantity: number; line_total_minor: number }> = [
    { title: "Nike Pegasus 41", quantity: 1, line_total_minor: 159900 },
    { title: "Sony WH-1000XM5", quantity: 1, line_total_minor: 349900 },
    { title: "Adidas 4Athlts Duffel M", quantity: 1, line_total_minor: 49900 },
  ];

  if (tenant && order_id) {
    const { data: order } = await supabase
      .from("orders")
      .select("id, tenant_id, customer_email, total_minor, currency, shipping_price_minor, created_at, payment_provider, shipping_method_name, estimated_delivery_start, estimated_delivery_end")
      .eq("id", order_id)
      .eq("tenant_id", tenant.id)
      .maybeSingle();

    if (order) {
      totalMinor = order.total_minor;
      shippingPriceMinor = Number(order.shipping_price_minor || 0);
      currency = order.currency;
      customerEmail = order.customer_email;
      orderDate = formatDateLabel(order.created_at);
      orderNumber = `APL-${new Date(order.created_at).getFullYear()}-${order.id.slice(0, 5).toUpperCase()}`;
      paymentProviderLabel =
        order.payment_provider === "klarna"
          ? "Klarna"
          : order.payment_provider === "swish"
            ? "Swish"
            : "Stripe";
      shippingMethodLabel = order.shipping_method_name || shippingMethodLabel;
      if (order.estimated_delivery_start && order.estimated_delivery_end) {
        const start = new Date(order.estimated_delivery_start).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
        const end = new Date(order.estimated_delivery_end).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
        estimatedDeliveryLabel = `${start} - ${end}`;
      }

      const { data: lines } = await supabase
        .from("order_items")
        .select("product_title, quantity, line_total_minor")
        .eq("order_id", order.id)
        .eq("tenant_id", tenant.id);

      if (lines && lines.length > 0) {
        orderItems = lines.map((line) => ({
          title: line.product_title,
          quantity: line.quantity,
          line_total_minor: line.line_total_minor,
        }));
      }

      itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    }
  }

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
          <header className="relative flex items-center justify-between px-4 py-3 text-white sm:px-6" style={{ background: "var(--store-header-gradient)" }}>
            <p className="text-xs tracking-[0.26em] text-[color:var(--store-accent)]">{brandName.toUpperCase()}</p>
            <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/90 xl:flex">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-[color:var(--store-accent)]">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-white/85">
              <details className="relative xl:hidden">
                <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </summary>
                <div
                  className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]"
                  style={{ background: "var(--store-header-overlay-surface)" }}
                >
                  {navItems.map((item) => (
                    <Link
                      key={`mobile-${item.label}`}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
              <Link href="/sok" aria-label="Sök" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" /></svg>
              </Link>
              <Link href="/mina-sidor" aria-label="Konto" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="8" r="3.5" /><path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" /></svg>
              </Link>
              <Link href="/cart" aria-label="Varukorg" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" /></svg>
                <CartCountBadge initialCount={0} />
              </Link>
            </div>
          </header>

          <div className="px-6 py-5">
            <div className="grid gap-5 lg:grid-cols-[1.55fr_0.85fr]">
              <section className="space-y-4 rounded-xl border bg-white p-5" style={{ borderColor: "var(--store-card-border)" }}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-600 text-4xl text-emerald-600">
                    <CheckCircleIcon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {getCmsBlockField(cms.blocks, "hero", "subtitle", "Tack för ditt köp!")}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                      {getCmsBlockField(cms.blocks, "hero", "title", "Din beställning är bekräftad")}
                    </h1>
                    <p className="mt-2 text-sm text-slate-700">
                      Vi har tagit emot din beställning och skickar en bekräftelse till
                      {" "}
                      <span className="font-semibold">{customerEmail}</span>
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Link href="/mina-sidor" className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white">Se dina ordrar</Link>
                      <Link href="/products" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900">Fortsätt handla</Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ordernummer</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900 sm:text-4xl">#{orderNumber}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <div><p className="text-xs text-slate-500">Orderdatum</p><p className="text-sm font-semibold">{orderDate}</p></div>
                    <div><p className="text-xs text-slate-500">Betalning</p><p className="text-sm font-semibold">{paymentProviderLabel}</p></div>
                    <div><p className="text-xs text-slate-500">Leveranssätt</p><p className="text-sm font-semibold">{shippingMethodLabel}</p></div>
                    <div><p className="text-xs text-slate-500">Beräknad leverans</p><p className="text-sm font-semibold">{estimatedDeliveryLabel}</p></div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <article className="rounded-md border border-slate-200 px-3 py-2 text-center">
                      <p className="text-sm font-semibold">Order mottagen</p>
                      <p className="text-xs text-slate-500">25 maj, 10:42</p>
                    </article>
                    <article className="rounded-md border border-slate-200 px-3 py-2 text-center">
                      <p className="text-sm font-semibold">Behandlas</p>
                      <p className="text-xs text-slate-500">Vi förbereder din order</p>
                    </article>
                    <article className="rounded-md border border-slate-200 px-3 py-2 text-center">
                      <p className="text-sm font-semibold">Skickad</p>
                      <p className="text-xs text-slate-500">På väg till dig</p>
                    </article>
                    <article className="rounded-md border border-slate-200 px-3 py-2 text-center">
                      <p className="text-sm font-semibold">Levererad</p>
                      <p className="text-xs text-slate-500">Levereras inom 28 maj - 30 maj</p>
                    </article>
                  </div>
                </div>
              </section>

              <aside className="space-y-3 rounded-xl border bg-white p-5" style={{ borderColor: "var(--store-card-border)" }}>
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Din beställning ({itemCount} produkter)</h2>
                <div className="space-y-2 border-b border-slate-200 pb-3">
                  {orderItems.map((item) => (
                    <div key={item.title} className="flex items-center justify-between text-sm">
                      <div><p className="font-medium">{item.title}</p><p className="text-slate-500">Antal: {item.quantity}</p></div>
                      <p className="font-semibold">{formatMinorPrice(item.line_total_minor, currency)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 border-b border-slate-200 pb-3 text-sm">
                  <div className="flex justify-between"><span>Delsumma</span><span className="font-medium">{formatMinorPrice(totalMinor - shippingPriceMinor, currency)}</span></div>
                  <div className="flex justify-between"><span>Frakt</span><span className="font-medium">{formatMinorPrice(shippingPriceMinor, currency)}</span></div>
                  <div className="flex justify-between"><span>Rabattkod</span><span className="font-medium">-</span></div>
                </div>
                <div className="flex items-end justify-between"><div><p className="text-sm text-slate-500">Totalt</p><p className="text-xs text-slate-500">inkl. moms</p></div><p className="text-4xl font-semibold">{formatMinorPrice(totalMinor, currency)}</p></div>
                <div className="rounded-md px-3 py-2 text-sm" style={{ background: "var(--store-soft-surface)" }}>Betalt med {paymentProviderLabel} · Betalning kommer att dras när order skickas.</div>
              </aside>
            </div>

            <section
              className="mt-6 grid overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4"
              style={{ borderColor: "var(--store-card-border)", background: "var(--store-trust-gradient)" }}
            >
              {trustCards.map((item) => (
                <article key={item.title} className="flex min-h-[86px] items-center gap-4 border-t px-5 py-3 lg:border-l lg:border-t-0 lg:first:border-l-0" style={{ borderColor: "var(--store-footer-border)" }}>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white" style={{ borderColor: "var(--store-footer-border)" }}>
                    <TrustIcon type={item.icon} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-6 rounded-xl px-5 py-4 text-white" style={{ background: "var(--store-footer-surface)" }}>
              <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
                <div>
                  <h3 className="text-4xl font-semibold tracking-tight">Tack för att du handlar hos oss!</h3>
                  <p className="mt-1 text-sm text-white/75">Som tack får du 100 bonuspoäng till ditt konto när din order är levererad.</p>
                  <Link href="/mina-sidor" className="mt-3 inline-flex rounded-md bg-[color:var(--store-accent)] px-4 py-2 text-sm font-semibold text-slate-900">Till mina sidor</Link>
                </div>
                {bottomHighlights.map((item) => (
                  <article key={item.title} className="flex min-h-[78px] items-center gap-3 border-l border-white/15 pl-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--store-accent)]/45 bg-white/5">
                      <BottomIcon type={item.icon} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--store-accent)]">{item.title}</p>
                      <p className="text-xs text-white/75">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
