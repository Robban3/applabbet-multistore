import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AccountSidebar } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureStripeCustomerProfile, getStripeClient } from "@/lib/payments";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MinaBetalningsmetoderPage({ searchParams }: PageProps) {
  async function setDefaultAction(formData: FormData) {
    "use server";
    const paymentMethodId = String(formData.get("payment_method_id") || "").trim();
    if (!paymentMethodId) return;

    const host = await getCurrentHost();
    const tenant = await resolveTenantByHost(host);
    if (!tenant) return;

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return;

    const customerId = await ensureStripeCustomerProfile({
      tenantId: tenant.id,
      userId: user.id,
      email: user.email,
      name: (user.user_metadata?.full_name as string | undefined) || null,
    });
    const stripe = getStripeClient();
    if (!customerId || !stripe) return;

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    revalidatePath("/mina-sidor/betalningsmetoder");
  }

  async function removeMethodAction(formData: FormData) {
    "use server";
    const paymentMethodId = String(formData.get("payment_method_id") || "").trim();
    if (!paymentMethodId) return;

    const host = await getCurrentHost();
    const tenant = await resolveTenantByHost(host);
    if (!tenant) return;

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return;

    const customerId = await ensureStripeCustomerProfile({
      tenantId: tenant.id,
      userId: user.id,
      email: user.email,
      name: (user.user_metadata?.full_name as string | undefined) || null,
    });
    const stripe = getStripeClient();
    if (!customerId || !stripe) return;

    const customer = await stripe.customers.retrieve(customerId);
    const defaultMethod =
      !("deleted" in customer) && typeof customer.invoice_settings.default_payment_method === "string"
        ? customer.invoice_settings.default_payment_method
        : null;

    if (defaultMethod === paymentMethodId) {
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: undefined },
      });
    }

    await stripe.paymentMethods.detach(paymentMethodId);
    revalidatePath("/mina-sidor/betalningsmetoder");
  }

  const params = await searchParams;
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const definition = getCmsPage("mina-sidor-betalningsmetoder");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("mina-sidor-betalningsmetoder", { blocks: fallbackBlocks });

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const stripe = getStripeClient();
  if (!tenant) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Tenant hittades inte.
        </p>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/konto/login?next=/mina-sidor/betalningsmetoder");

  const customerId = stripe
    ? await ensureStripeCustomerProfile({
        tenantId: tenant.id,
        userId: user.id,
        email: user.email,
        name: (user.user_metadata?.full_name as string | undefined) || null,
      })
    : null;

  let defaultPaymentMethodId: string | null = null;
  let cards: Array<{ id: string; brand: string; last4: string; expMonth: number; expYear: number }> = [];

  if (stripe && customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    defaultPaymentMethodId =
      !("deleted" in customer) && typeof customer.invoice_settings.default_payment_method === "string"
        ? customer.invoice_settings.default_payment_method
        : null;

    const cardMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
      limit: 20,
    });

    cards = cardMethods.data.map((method) => ({
      id: method.id,
      brand: method.card?.brand || "kort",
      last4: method.card?.last4 || "0000",
      expMonth: method.card?.exp_month || 0,
      expYear: method.card?.exp_year || 0,
    }));
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
          <p className="text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700">Hem</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor" className="hover:text-slate-700">Mina sidor</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor/betalningsmetoder" className="hover:text-slate-700">
              {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Betalningsmetoder")}
            </Link>
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "hero", "title", "Betalningsmetoder")}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "subtitle",
                  "Hantera dina sparade betalmetoder och välj hur du vill betala.",
                )}
              </p>
            </div>
            <a
              href="/api/payment-methods/portal"
              className={`inline-flex rounded-md px-4 py-2 text-sm font-semibold ${
                stripe
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              + Lägg till betalmetod
            </a>
          </div>

          {errorParam ? (
            <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Kunde inte öppna betalmetodshantering just nu.
            </p>
          ) : null}

          <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
            <AccountSidebar activeHref="/mina-sidor/betalningsmetoder" />

            <section className="space-y-3">
              <h2 className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "payments", "sectionTitle", "Dina sparade betalmetoder")}
              </h2>
              {cards.map((card) => (
                <article key={card.id} className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {card.brand.toUpperCase()} •••• {card.last4}
                      </p>
                      <p className="text-sm text-slate-600">
                        Utgår {String(card.expMonth).padStart(2, "0")}/{String(card.expYear).slice(-2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {defaultPaymentMethodId === card.id ? (
                        <p className="rounded bg-[#e6f7ed] px-2 py-1 text-xs font-semibold text-[#2f7d4f]">
                          Används som standard
                        </p>
                      ) : (
                        <form action={setDefaultAction}>
                          <input type="hidden" name="payment_method_id" value={card.id} />
                          <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800">
                            Använd
                          </button>
                        </form>
                      )}
                      <form action={removeMethodAction}>
                        <input type="hidden" name="payment_method_id" value={card.id} />
                        <button className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700">
                          Ta bort
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
              {cards.length === 0 ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {getCmsBlockField(
                    cms.blocks,
                    "payments",
                    "emptyState",
                    "Inga sparade kort ännu. Klicka på \"Lägg till betalmetod\" för att koppla ett riktigt kort eller bankmetod via Stripe.",
                  )}
                </p>
              ) : null}

              <article className="rounded-xl border p-4 text-sm text-slate-700" style={{ borderColor: "var(--store-card-border)", background: "var(--store-soft-surface)" }}>
                Säker betalning: vi lagrar aldrig kortnummer eller bankuppgifter i vår databas. All känslig betaldata hanteras av Stripe.
              </article>
            </section>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
