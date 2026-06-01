import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AccountSidebar } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorTabShellContent, usesMinaSidorTabShell } from "@/lib/mina-sidor-shell";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { toPublicCustomerId } from "@/lib/customer-id";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { CustomerProfile } from "@/types/commerce";

async function getProfileContext() {
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

function formatLongDate(dateValue: string) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(dateValue: string) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m12 6 4 4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

const editButtonClass =
  "inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50";
const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

type MinaUppgifterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function MinaUppgifterPage({ searchParams }: MinaUppgifterPageProps) {
  async function saveCommunicationSettings(values: {
    newsletterOptIn: boolean;
    orderUpdatesOptIn: boolean;
  }) {
    "use server";
    const context = await getProfileContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/profil");

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
      redirect("/mina-sidor/profil?status=error&section=communication");
    }

    revalidatePath("/mina-sidor/profil");
    redirect("/mina-sidor/profil?status=saved&section=communication");
  }

  async function updateProfileAction(formData: FormData) {
    "use server";
    const context = await getProfileContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/profil");

    const firstName = String(formData.get("first_name") || "").trim();
    const lastName = String(formData.get("last_name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const birthDate = String(formData.get("birth_date") || "").trim();

    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("customer_profiles").upsert(
      {
        tenant_id: context.tenantId,
        user_id: context.user.id,
        email: context.user.email,
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        birth_date: birthDate || null,
      },
      { onConflict: "tenant_id,user_id" },
    );
    if (error) {
      redirect("/mina-sidor/profil?status=error&section=profile");
    }
    revalidatePath("/mina-sidor/profil");
    redirect("/mina-sidor/profil?status=saved&section=profile");
  }

  async function updateCommunicationAction(formData: FormData) {
    "use server";
    const newsletter = formData.get("newsletter_opt_in") === "on";
    const orderUpdates = formData.get("order_updates_opt_in") === "on";
    await saveCommunicationSettings({
      newsletterOptIn: newsletter,
      orderUpdatesOptIn: orderUpdates,
    });
  }

  async function toggleNewsletterAction() {
    "use server";
    const context = await getProfileContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/profil");

    const { data } = await context.supabase
      .from("customer_profiles")
      .select("newsletter_opt_in, order_updates_opt_in")
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.user.id)
      .maybeSingle();

    const currentNewsletterOptIn = data?.newsletter_opt_in ?? true;
    const currentOrderUpdatesOptIn = data?.order_updates_opt_in ?? true;

    await saveCommunicationSettings({
      newsletterOptIn: !currentNewsletterOptIn,
      orderUpdatesOptIn: currentOrderUpdatesOptIn,
    });
  }

  async function toggleOrderUpdatesAction() {
    "use server";
    const context = await getProfileContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/profil");

    const { data } = await context.supabase
      .from("customer_profiles")
      .select("newsletter_opt_in, order_updates_opt_in")
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.user.id)
      .maybeSingle();

    const currentNewsletterOptIn = data?.newsletter_opt_in ?? true;
    const currentOrderUpdatesOptIn = data?.order_updates_opt_in ?? true;

    await saveCommunicationSettings({
      newsletterOptIn: currentNewsletterOptIn,
      orderUpdatesOptIn: !currentOrderUpdatesOptIn,
    });
  }

  async function updatePasswordAction(formData: FormData) {
    "use server";
    const context = await getProfileContext();
    if (!context) redirect("/konto/login?next=/mina-sidor/profil");

    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("password_confirm") || "");
    if (!password) {
      redirect("/mina-sidor/profil?status=error&section=password&password_error=empty");
    }
    if (password.length < 8) {
      redirect("/mina-sidor/profil?status=error&section=password&password_error=length");
    }
    if (password !== confirm) {
      redirect("/mina-sidor/profil?status=error&section=password&password_error=mismatch");
    }

    const { error } = await context.supabase.auth.updateUser({ password });
    if (error) {
      redirect("/mina-sidor/profil?status=error&section=password&password_error=save");
    }
    revalidatePath("/mina-sidor/profil");
    redirect("/mina-sidor/profil?status=saved&section=password");
  }

  const params = await searchParams;
  const status = getParam(params.status);
  const section = getParam(params.section);
  const passwordError = getParam(params.password_error);
  const context = await getProfileContext();
  if (!context) redirect("/konto/login?next=/mina-sidor/profil");
  const definition = getCmsPage("mina-sidor-profil");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("mina-sidor-profil", { blocks: fallbackBlocks });

  const { data } = await context.supabase
    .from("customer_profiles")
    .select("id, tenant_id, user_id, email, first_name, last_name, phone, birth_date, newsletter_opt_in, order_updates_opt_in")
    .eq("tenant_id", context.tenantId)
    .eq("user_id", context.user.id)
    .maybeSingle();

  const fullName = String(context.user.user_metadata?.full_name || "").trim();
  const [metaFirstName, ...restName] = fullName.split(" ").filter(Boolean);
  const metaLastName = restName.join(" ");

  const profile = (data as CustomerProfile | null) || null;
  const firstName = profile?.first_name || metaFirstName || "";
  const lastName = profile?.last_name || metaLastName || "";
  const phone = profile?.phone || "";
  const birthDate = profile?.birth_date || "";
  const newsletterOptIn = profile?.newsletter_opt_in ?? true;
  const orderUpdatesOptIn = profile?.order_updates_opt_in ?? true;
  const publicCustomerId = toPublicCustomerId(context.user.id);
  const fullNameLabel = [firstName, lastName].filter(Boolean).join(" ").trim() || "-";
  const passwordUpdatedLabel = formatShortDate(context.user.updated_at || "");

  const accountCtx = await loadAccountContext();
  const pageTitle = getCmsBlockField(cms.blocks, "hero", "title", "Mina uppgifter");
  const pageSubtitle = getCmsBlockField(
    cms.blocks,
    "hero",
    "subtitle",
    "Här kan du se och uppdatera dina personuppgifter, kontaktuppgifter och lösenord.",
  );

  const statusAlerts = (
    <>
      {status === "saved" ? (
        <p className="mb-4 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {section === "profile"
            ? "Personuppgifter sparades."
            : section === "password"
              ? "Lösenordet uppdaterades."
              : "Inställningarna sparades."}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mb-4 rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {section === "password"
            ? passwordError === "empty"
              ? "Ange ett nytt lösenord."
              : passwordError === "length"
                ? "Lösenordet måste vara minst 8 tecken."
                : passwordError === "mismatch"
                  ? "Lösenorden matchar inte."
                  : "Kunde inte uppdatera lösenordet. Försök igen."
            : "Kunde inte spara ändringarna. Kontrollera fälten och försök igen."}
        </p>
      ) : null}
    </>
  );

  const profileBody = (
    <>
      {statusAlerts}
      <section className="space-y-3">
              <article className="w-full rounded-xl border bg-white px-5 py-4" style={{ borderColor: "var(--store-card-border)" }}>
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700">
                    <ShieldIcon />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Dina uppgifter är skyddade</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Vi behandlar dina uppgifter i enlighet med vår integritetspolicy.
                    </p>
                    <Link href="/integritetspolicy" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-slate-800 hover:underline">
                      Läs mer om vår integritetspolicy
                      <ChevronRightIcon />
                    </Link>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                <details className="group">
                  <summary className="list-none">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
                      <h2 className="text-[33px] font-semibold text-slate-900">Personuppgifter</h2>
                      <span className={editButtonClass}>
                        <PencilIcon />
                        Redigera
                      </span>
                    </div>
                  </summary>
                  <form action={updateProfileAction} className="mb-3 grid gap-3 rounded-xl border p-3 sm:grid-cols-2" style={{ borderColor: "var(--store-footer-border)", background: "var(--store-soft-surface)" }}>
                    <label>
                      <span className={labelClass}>Förnamn</span>
                      <input name="first_name" defaultValue={firstName} placeholder="Förnamn" className={fieldClass} />
                    </label>
                    <label>
                      <span className={labelClass}>Efternamn</span>
                      <input name="last_name" defaultValue={lastName} placeholder="Efternamn" className={fieldClass} />
                    </label>
                    <label>
                      <span className={labelClass}>E-postadress</span>
                      <input value={context.user.email || ""} disabled className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500" />
                    </label>
                    <label>
                      <span className={labelClass}>Telefonnummer</span>
                      <input name="phone" defaultValue={phone} placeholder="Telefonnummer" className={fieldClass} />
                    </label>
                    <label className="sm:col-span-2">
                      <span className={labelClass}>Födelsedatum</span>
                      <input name="birth_date" type="date" defaultValue={birthDate} className={fieldClass} />
                    </label>
                    <div className="flex gap-2 sm:col-span-2">
                      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Spara uppgifter</button>
                    </div>
                  </form>
                </details>
                <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
                  <dt className="text-slate-600">Förnamn</dt>
                  <dd className="font-medium text-slate-900">{firstName || "-"}</dd>
                  <dt className="text-slate-600">Efternamn</dt>
                  <dd className="font-medium text-slate-900">{lastName || "-"}</dd>
                  <dt className="text-slate-600">E-postadress</dt>
                  <dd className="font-medium text-slate-900">{context.user.email || "-"}</dd>
                  <dt className="text-slate-600">Telefonnummer</dt>
                  <dd className="font-medium text-slate-900">{phone || "-"}</dd>
                  <dt className="text-slate-600">Födelsedatum</dt>
                  <dd className="font-medium text-slate-900">{formatLongDate(birthDate)}</dd>
                </dl>
              </article>

              <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                <details className="group">
                  <summary className="list-none">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
                      <h2 className="text-[33px] font-semibold text-slate-900">Lösenord</h2>
                      <span className={editButtonClass}>
                        <PencilIcon />
                        Ändra lösenord
                      </span>
                    </div>
                  </summary>
                  <form action={updatePasswordAction} className="mb-3 grid gap-3 rounded-xl border p-3 sm:grid-cols-2" style={{ borderColor: "var(--store-footer-border)", background: "var(--store-soft-surface)" }}>
                    <label>
                      <span className={labelClass}>Nytt lösenord</span>
                      <input name="password" type="password" minLength={8} required placeholder="Minst 8 tecken" className={fieldClass} />
                    </label>
                    <label>
                      <span className={labelClass}>Bekräfta lösenord</span>
                      <input name="password_confirm" type="password" minLength={8} required placeholder="Skriv igen" className={fieldClass} />
                    </label>
                    <div className="sm:col-span-2">
                      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Spara lösenord</button>
                    </div>
                  </form>
                </details>
                <div className="text-sm">
                  <p className="text-slate-600">Lösenord</p>
                  <p className="text-lg font-semibold text-slate-900">••••••••••</p>
                  <p className="text-slate-500">Senast ändrat: {passwordUpdatedLabel}</p>
                </div>
              </article>

              <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                <details className="group">
                  <summary className="list-none">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
                      <h2 className="text-[33px] font-semibold text-slate-900">Nyhetsbrev och kommunikation</h2>
                      <span className={editButtonClass}>
                        <PencilIcon />
                        Redigera
                      </span>
                    </div>
                  </summary>
                  <form action={updateCommunicationAction} className="mb-3 space-y-2 rounded-xl border p-3" style={{ borderColor: "var(--store-footer-border)", background: "var(--store-soft-surface)" }}>
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
                      <span className="font-medium text-slate-800">Nyhetsbrev</span>
                      <input type="checkbox" name="newsletter_opt_in" defaultChecked={newsletterOptIn} />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
                      <span className="font-medium text-slate-800">Orderuppdateringar</span>
                      <input type="checkbox" name="order_updates_opt_in" defaultChecked={orderUpdatesOptIn} />
                    </label>
                    <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Spara inställningar</button>
                  </form>
                </details>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                    <div>
                      <p className="font-semibold text-slate-900">Nyhetsbrev</p>
                      <p className="text-sm text-slate-600">Få inspiration, erbjudanden och nyheter direkt i din inkorg.</p>
                    </div>
                    <form action={toggleNewsletterAction}>
                      <button
                        type="submit"
                        aria-label={newsletterOptIn ? "Stäng av nyhetsbrev" : "Aktivera nyhetsbrev"}
                        className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition ${newsletterOptIn ? "bg-black" : "bg-slate-300"}`}
                      >
                        <span className={`h-5 w-5 rounded-full bg-white transition ${newsletterOptIn ? "translate-x-5" : ""}`} />
                      </button>
                    </form>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                    <div>
                      <p className="font-semibold text-slate-900">Orderuppdateringar</p>
                      <p className="text-sm text-slate-600">Få viktiga uppdateringar om dina ordrar och leveranser.</p>
                    </div>
                    <form action={toggleOrderUpdatesAction}>
                      <button
                        type="submit"
                        aria-label={orderUpdatesOptIn ? "Stäng av orderuppdateringar" : "Aktivera orderuppdateringar"}
                        className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition ${orderUpdatesOptIn ? "bg-black" : "bg-slate-300"}`}
                      >
                        <span className={`h-5 w-5 rounded-full bg-white transition ${orderUpdatesOptIn ? "translate-x-5" : ""}`} />
                      </button>
                    </form>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                <h2 className="text-[33px] font-semibold text-slate-900">Konto och samtycken</h2>
                <div className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200">
                  <Link href="/integritetspolicy" className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900">Integritetspolicy</p>
                      <p className="text-sm text-slate-600">Se hur vi behandlar dina uppgifter</p>
                    </div>
                    <ChevronRightIcon />
                  </Link>
                  <Link href="/cookies" className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900">Hantera cookies</p>
                      <p className="text-sm text-slate-600">Anpassa dina cookie-inställningar</p>
                    </div>
                    <ChevronRightIcon />
                  </Link>
                  <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900">Radera konto</p>
                      <p className="text-sm text-rose-700">Ta bort ditt konto och alla dina uppgifter</p>
                    </div>
                    <ChevronRightIcon />
                  </button>
                </div>
                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Kund-ID</p>
                  <p className="font-mono text-sm font-semibold text-slate-800">{publicCustomerId}</p>
                  <p className="text-xs text-slate-500">{fullNameLabel}</p>
                </div>
              </article>
      </section>
    </>
  );

  if (usesMinaSidorTabShell(accountCtx)) {
    return (
      <MinaSidorTabShellContent ctx={accountCtx} title={pageTitle} subtitle={pageSubtitle}>
        {profileBody}
      </MinaSidorTabShellContent>
    );
  }

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
          <StorefrontHeader cartCount={2} trustStripSize="large" />

          <div className="px-6 py-5">
          <p className="text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700">Hem</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor" className="hover:text-slate-700">Mina sidor</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor/profil" className="hover:text-slate-700">
              {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Mina uppgifter")}
            </Link>
          </p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-600">{pageSubtitle}</p>

          <div className="mt-4 grid gap-5 lg:grid-cols-[230px_1fr]">
            <AccountSidebar activeHref="/mina-sidor/profil" withIcons />
            {profileBody}
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
