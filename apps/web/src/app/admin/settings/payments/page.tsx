import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { normalizePaymentMethods } from "@/lib/tenant-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPaymentSettingsPage() {
  const access = await requireAdminAccess("/admin/settings/payments");

  if (access.status === "tenant_missing") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Ingen tenant hittades för host. Kontrollera tenant_domains.
      </p>
    );
  }

  if (access.status === "forbidden") {
    return (
      <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Ditt konto har inte åtkomst till den här adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("tenant_settings")
    .select("payment_methods, payment_config")
    .eq("tenant_id", access.tenant.id)
    .maybeSingle();

  const paymentMethods = normalizePaymentMethods(data?.payment_methods);
  const paymentConfig =
    typeof data?.payment_config === "object" && data.payment_config
      ? (data.payment_config as Record<string, string>)
      : {};

  async function savePaymentSettings(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/settings/payments");
    if (actionAccess.status !== "allowed") return;

    const payload = {
      tenant_id: actionAccess.tenant.id,
      payment_methods: {
        stripe: formData.get("payment_stripe") === "on",
        klarna: formData.get("payment_klarna") === "on",
        swish: formData.get("payment_swish") === "on",
      },
      payment_config: {
        stripePublishableKey: (formData.get("stripe_publishable_key") as string) || "",
        klarnaMerchantId: (formData.get("klarna_merchant_id") as string) || "",
        swishNumber: (formData.get("swish_number") as string) || "",
      },
    };

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("tenant_settings").upsert(payload, { onConflict: "tenant_id" });

    revalidatePath("/admin/settings/payments");
    revalidatePath("/checkout");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Betalningar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Hantera aktiva betalsätt och respektive integrationsinställningar.
      </p>

      <form action={savePaymentSettings} className="mt-4 space-y-5">
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
          Spara betalningar
        </button>
      </form>
    </section>
  );
}

