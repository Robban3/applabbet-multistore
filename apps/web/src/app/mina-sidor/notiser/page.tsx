import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AccountSidebar } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorTabShellContent, usesMinaSidorTabShell } from "@/lib/mina-sidor-shell";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

async function getNotiserContext() {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  return { tenantId: tenant.id, user, supabase };
}

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

type NotiserPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NotiserPage({ searchParams }: NotiserPageProps) {
  async function saveSettings(values: {
    newsletterOptIn: boolean;
    orderUpdatesOptIn: boolean;
  }) {
    "use server";
    const context = await getNotiserContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/notiser");

    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("customer_profiles").upsert(
      {
        tenant_id: context.tenantId,
        user_id: context.user.id,
        email: context.user.email,
        newsletter_opt_in: values.newsletterOptIn,
        order_updates_opt_in: values.orderUpdatesOptIn,
      },
      { onConflict: "tenant_id,user_id" },
    );
    if (error) {
      redirect("/mina-sidor/notiser?status=error");
    }
    revalidatePath("/mina-sidor/notiser");
    redirect("/mina-sidor/notiser?status=saved");
  }

  async function toggleNewsletterAction() {
    "use server";
    const context = await getNotiserContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/notiser");
    const { data } = await context.supabase
      .from("customer_profiles")
      .select("newsletter_opt_in, order_updates_opt_in")
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.user.id)
      .maybeSingle();
    await saveSettings({
      newsletterOptIn: !(data?.newsletter_opt_in ?? true),
      orderUpdatesOptIn: data?.order_updates_opt_in ?? true,
    });
  }

  async function toggleOrderUpdatesAction() {
    "use server";
    const context = await getNotiserContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/notiser");
    const { data } = await context.supabase
      .from("customer_profiles")
      .select("newsletter_opt_in, order_updates_opt_in")
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.user.id)
      .maybeSingle();
    await saveSettings({
      newsletterOptIn: data?.newsletter_opt_in ?? true,
      orderUpdatesOptIn: !(data?.order_updates_opt_in ?? true),
    });
  }

  const params = await searchParams;
  const status = getParam(params.status);

  const context = await getNotiserContext();
  if (!context) redirect("/konto/login?next=/mina-sidor/notiser");

  const { data: profile } = await context.supabase
    .from("customer_profiles")
    .select("newsletter_opt_in, order_updates_opt_in")
    .eq("tenant_id", context.tenantId)
    .eq("user_id", context.user.id)
    .maybeSingle();

  const newsletterOptIn = profile?.newsletter_opt_in ?? true;
  const orderUpdatesOptIn = profile?.order_updates_opt_in ?? true;

  const accountCtx = await loadAccountContext();
  const pageTitle = "Nyhetsbrev & notiser";
  const pageSubtitle = "Välj vilka mejl och uppdateringar du vill få från oss.";

  const toggleRow = (
    opts: {
      title: string;
      description: string;
      checked: boolean;
      action: () => Promise<void>;
      label: string;
    },
  ) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div>
        <p className="font-semibold text-slate-900">{opts.title}</p>
        <p className="mt-0.5 text-sm text-slate-600">{opts.description}</p>
      </div>
      <form action={opts.action}>
        <button
          type="submit"
          aria-label={opts.label}
          className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${
            opts.checked ? "bg-slate-900" : "bg-slate-300"
          }`}
        >
          <span className={`h-5 w-5 rounded-full bg-white transition ${opts.checked ? "translate-x-5" : ""}`} />
        </button>
      </form>
    </div>
  );

  const body = (
    <>
      {status === "saved" ? (
        <p className="mb-4 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Dina inställningar sparades.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mb-4 rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          Kunde inte spara inställningarna. Försök igen.
        </p>
      ) : null}

      <div className="space-y-3">
        {toggleRow({
          title: "Nyhetsbrev",
          description: "Få inspiration, erbjudanden och nyheter direkt i din inkorg.",
          checked: newsletterOptIn,
          action: toggleNewsletterAction,
          label: newsletterOptIn ? "Stäng av nyhetsbrev" : "Aktivera nyhetsbrev",
        })}
        {toggleRow({
          title: "Orderuppdateringar",
          description: "Få viktiga uppdateringar om dina ordrar och leveranser.",
          checked: orderUpdatesOptIn,
          action: toggleOrderUpdatesAction,
          label: orderUpdatesOptIn ? "Stäng av orderuppdateringar" : "Aktivera orderuppdateringar",
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Du kan när som helst ändra dina val. Vi behandlar dina uppgifter enligt vår{" "}
        <Link href="/integritetspolicy" className="font-medium text-slate-800 hover:underline">
          integritetspolicy
        </Link>
        .
      </p>
    </>
  );

  if (usesMinaSidorTabShell(accountCtx)) {
    return (
      <MinaSidorTabShellContent ctx={accountCtx} title={pageTitle} subtitle={pageSubtitle}>
        {body}
      </MinaSidorTabShellContent>
    );
  }

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={0} />
          <div className="px-6 py-8">
            <p className="text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-700">Hem</Link>
              <span className="mx-1">&gt;</span>
              <Link href="/mina-sidor" className="hover:text-slate-700">Mina sidor</Link>
              <span className="mx-1">&gt;</span>
              <span>Nyhetsbrev</span>
            </p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
            <p className="mt-1 text-sm text-slate-600">{pageSubtitle}</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
              <AccountSidebar activeHref="/mina-sidor/notiser" />
              <section>{body}</section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
