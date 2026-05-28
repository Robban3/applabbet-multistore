import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  normalizeLoyaltyProgramEnabled,
  normalizePaymentMethods,
  normalizeTrustBadges,
} from "@/lib/tenant-settings";

const TRUST_ICON_OPTIONS = [
  { value: "truck", label: "Lastbil / leverans" },
  { value: "rotate", label: "Retur / öppet köp" },
  { value: "shield", label: "Sköld / säkerhet" },
  { value: "star", label: "Stjärna / fördel" },
] as const;

export default async function AdminSettingsPage() {
  const access = await requireAdminAccess("/admin/settings");

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
        Ditt konto har inte access till den har adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("tenant_settings")
    .select(
      "logo_url, brand_name, company_name, org_number, vat_number, support_email, support_phone, address_line1, postal_code, city, country, payment_methods, payment_config, trust_badges, loyalty_program_enabled",
    )
    .eq("tenant_id", access.tenant.id)
    .maybeSingle();

  const paymentMethods = normalizePaymentMethods(data?.payment_methods);
  const trustBadges = normalizeTrustBadges(data?.trust_badges);
  const paymentConfig =
    typeof data?.payment_config === "object" && data.payment_config
      ? (data.payment_config as Record<string, string>)
      : {};

  async function saveSettings(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/settings");
    if (actionAccess.status !== "allowed") return;

    const stripeEnabled = formData.get("payment_stripe") === "on";
    const klarnaEnabled = formData.get("payment_klarna") === "on";
    const swishEnabled = formData.get("payment_swish") === "on";

    const payload = {
      tenant_id: actionAccess.tenant.id,
      logo_url: (formData.get("logo_url") as string) || null,
      brand_name: (formData.get("brand_name") as string) || null,
      company_name: (formData.get("company_name") as string) || null,
      org_number: (formData.get("org_number") as string) || null,
      vat_number: (formData.get("vat_number") as string) || null,
      support_email: (formData.get("support_email") as string) || null,
      support_phone: (formData.get("support_phone") as string) || null,
      address_line1: (formData.get("address_line1") as string) || null,
      postal_code: (formData.get("postal_code") as string) || null,
      city: (formData.get("city") as string) || null,
      country: (formData.get("country") as string) || "Sverige",
      payment_methods: {
        stripe: stripeEnabled,
        klarna: klarnaEnabled,
        swish: swishEnabled,
      },
      payment_config: {
        stripePublishableKey: (formData.get("stripe_publishable_key") as string) || "",
        klarnaMerchantId: (formData.get("klarna_merchant_id") as string) || "",
        swishNumber: (formData.get("swish_number") as string) || "",
      },
      trust_badges: normalizeTrustBadges([
        {
          title: (formData.get("trust_1_title") as string) || "",
          text: (formData.get("trust_1_text") as string) || "",
          icon: (formData.get("trust_1_icon") as string) || "truck",
          enabled: formData.get("trust_1_enabled") === "on",
        },
        {
          title: (formData.get("trust_2_title") as string) || "",
          text: (formData.get("trust_2_text") as string) || "",
          icon: (formData.get("trust_2_icon") as string) || "rotate",
          enabled: formData.get("trust_2_enabled") === "on",
        },
        {
          title: (formData.get("trust_3_title") as string) || "",
          text: (formData.get("trust_3_text") as string) || "",
          icon: (formData.get("trust_3_icon") as string) || "shield",
          enabled: formData.get("trust_3_enabled") === "on",
        },
        {
          title: (formData.get("trust_4_title") as string) || "",
          text: (formData.get("trust_4_text") as string) || "",
          icon: (formData.get("trust_4_icon") as string) || "star",
          enabled: formData.get("trust_4_enabled") === "on",
        },
      ]),
      loyalty_program_enabled: normalizeLoyaltyProgramEnabled(formData.get("loyalty_program_enabled") === "on"),
    };

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("tenant_settings").upsert(payload, { onConflict: "tenant_id" });

    revalidatePath("/admin/settings");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Företagsprofil & betalningar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Hantera logo, företagsuppgifter och vilka betallösningar som är aktiva i checkout.
      </p>

      <form action={saveSettings} className="mt-4 space-y-5">
        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Varumärke & företag</legend>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Logo URL</span>
              <input name="logo_url" defaultValue={data?.logo_url ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Store name (visningsnamn)</span>
              <input name="brand_name" defaultValue={data?.brand_name ?? access.tenant.name} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Företagsnamn</span>
              <input name="company_name" defaultValue={data?.company_name ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Organisationsnummer</span>
              <input name="org_number" defaultValue={data?.org_number ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Momsnummer</span>
              <input name="vat_number" defaultValue={data?.vat_number ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Support E-post</span>
              <input name="support_email" defaultValue={data?.support_email ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Support Telefon</span>
              <input name="support_phone" defaultValue={data?.support_phone ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Adress</span>
              <input name="address_line1" defaultValue={data?.address_line1 ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Postnummer</span>
              <input name="postal_code" defaultValue={data?.postal_code ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Stad</span>
              <input name="city" defaultValue={data?.city ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Land</span>
              <input name="country" defaultValue={data?.country ?? "Sverige"} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Topbar trygghetsrad</legend>
          <p className="mb-3 text-sm text-slate-600">
            Valj vilka kort som ska visas under topbaren, samt ikon och text per kort.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 1 - Rubrik</span>
              <input name="trust_1_title" defaultValue={trustBadges[0]?.title ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 1 - Underrubrik</span>
              <input name="trust_1_text" defaultValue={trustBadges[0]?.text ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 1 - Ikon</span>
              <select name="trust_1_icon" defaultValue={trustBadges[0]?.icon ?? "truck"} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {TRUST_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="trust_1_enabled" defaultChecked={trustBadges[0]?.enabled ?? true} />
              Visa kort 1
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 2 - Rubrik</span>
              <input name="trust_2_title" defaultValue={trustBadges[1]?.title ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 2 - Underrubrik</span>
              <input name="trust_2_text" defaultValue={trustBadges[1]?.text ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 2 - Ikon</span>
              <select name="trust_2_icon" defaultValue={trustBadges[1]?.icon ?? "rotate"} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {TRUST_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="trust_2_enabled" defaultChecked={trustBadges[1]?.enabled ?? true} />
              Visa kort 2
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 3 - Rubrik</span>
              <input name="trust_3_title" defaultValue={trustBadges[2]?.title ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 3 - Underrubrik</span>
              <input name="trust_3_text" defaultValue={trustBadges[2]?.text ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 3 - Ikon</span>
              <select name="trust_3_icon" defaultValue={trustBadges[2]?.icon ?? "shield"} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {TRUST_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="trust_3_enabled" defaultChecked={trustBadges[2]?.enabled ?? true} />
              Visa kort 3
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 4 - Rubrik</span>
              <input name="trust_4_title" defaultValue={trustBadges[3]?.title ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 4 - Underrubrik</span>
              <input name="trust_4_text" defaultValue={trustBadges[3]?.text ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kort 4 - Ikon</span>
              <select name="trust_4_icon" defaultValue={trustBadges[3]?.icon ?? "star"} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {TRUST_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="trust_4_enabled" defaultChecked={trustBadges[3]?.enabled ?? false} />
              Visa kort 4
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Lojalitetsprogram</legend>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
            <input
              type="checkbox"
              name="loyalty_program_enabled"
              defaultChecked={normalizeLoyaltyProgramEnabled(data?.loyalty_program_enabled)}
            />
            Aktivera Mina poäng i kundens konto
          </label>
        </fieldset>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Betallösningar</legend>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="payment_stripe" defaultChecked={paymentMethods.stripe} />
              Stripe
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="payment_klarna" defaultChecked={paymentMethods.klarna} />
              Klarna
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input type="checkbox" name="payment_swish" defaultChecked={paymentMethods.swish} />
              Swish
            </label>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Stripe publishable key</span>
              <input
                name="stripe_publishable_key"
                defaultValue={paymentConfig.stripePublishableKey ?? ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Klarna merchant ID</span>
              <input
                name="klarna_merchant_id"
                defaultValue={paymentConfig.klarnaMerchantId ?? ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Swish-nummer</span>
              <input
                name="swish_number"
                defaultValue={paymentConfig.swishNumber ?? ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Spara inställningar
        </button>
      </form>
    </section>
  );
}
