import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminCompanySettingsPage() {
  const access = await requireAdminAccess("/admin/settings/company");

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
    .select(
      "company_name, org_number, vat_number, address_line1, postal_code, city, country",
    )
    .eq("tenant_id", access.tenant.id)
    .maybeSingle();

  async function saveCompanySettings(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/settings/company");
    if (actionAccess.status !== "allowed") return;

    const payload = {
      tenant_id: actionAccess.tenant.id,
      company_name: (formData.get("company_name") as string) || null,
      org_number: (formData.get("org_number") as string) || null,
      vat_number: (formData.get("vat_number") as string) || null,
      address_line1: (formData.get("address_line1") as string) || null,
      postal_code: (formData.get("postal_code") as string) || null,
      city: (formData.get("city") as string) || null,
      country: (formData.get("country") as string) || "Sverige",
    };

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("tenant_settings").upsert(payload, { onConflict: "tenant_id" });

    revalidatePath("/admin/settings/company");
    revalidatePath("/admin/settings");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Företagsinställningar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Hantera juridiska företagsuppgifter och adressuppgifter.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Allt som visas i storefront hanteras under{" "}
        <Link href="/admin/settings/site" className="underline">
          Butiksinställningar
        </Link>
        .
      </p>

      <form action={saveCompanySettings} className="mt-4 space-y-5">
        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Företagsuppgifter</legend>
          <div className="grid gap-3 md:grid-cols-2">
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

        <button
          type="submit"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Spara företagsinställningar
        </button>
      </form>
    </section>
  );
}

