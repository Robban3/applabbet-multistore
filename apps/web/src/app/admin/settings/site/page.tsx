import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireAdminAccess } from "@/lib/admin-access";
import { normalizeLoyaltyProgramEnabled, normalizeThemeKey } from "@/lib/tenant-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function canManageTheme(email: string | null) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return false;
  if (normalized.endsWith("@applabbet.local")) return true;
  if (normalized.endsWith("@applabbet.com")) return true;

  const allowList = (process.env.THEME_BUILDER_EMAILS || process.env.ADMIN_BOOTSTRAP_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return allowList.includes(normalized);
}

export default async function AdminSiteSettingsPage() {
  const access = await requireAdminAccess("/admin/settings/site");

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
      "logo_url, brand_name, support_email, support_phone, loyalty_program_enabled, footer_show_company_name, footer_show_org_number, footer_show_support_phone, footer_show_support_email, theme_key",
    )
    .eq("tenant_id", access.tenant.id)
    .maybeSingle();
  const themeAllowed = canManageTheme(access.user.email);

  async function saveSiteSettings(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/settings/site");
    if (actionAccess.status !== "allowed") return;
    const actionThemeAllowed = canManageTheme(actionAccess.user.email);

    const logoUrlInput = (formData.get("logo_url") as string) || "";
    const logoFile = formData.get("logo_file");
    let finalLogoUrl = logoUrlInput || null;

    if (logoFile instanceof File && logoFile.size > 0) {
      const extension = logoFile.name.includes(".")
        ? logoFile.name.split(".").pop()?.toLowerCase() || "png"
        : "png";
      const path = `${actionAccess.tenant.id}/logo-${Date.now()}.${extension}`;
      const admin = createSupabaseAdminClient();
      const bucket = "brand-assets";

      await admin.storage
        .createBucket(bucket, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024,
        })
        .catch(() => undefined);

      const { error } = await admin.storage.from(bucket).upload(path, logoFile, {
        contentType: logoFile.type || "image/png",
        upsert: true,
      });

      if (!error) {
        const { data: publicData } = admin.storage.from(bucket).getPublicUrl(path);
        finalLogoUrl = publicData.publicUrl;
      }
    }

    const payload: Record<string, unknown> = {
      tenant_id: actionAccess.tenant.id,
      logo_url: finalLogoUrl,
      brand_name: (formData.get("brand_name") as string) || null,
      support_email: (formData.get("support_email") as string) || null,
      support_phone: (formData.get("support_phone") as string) || null,
      footer_show_company_name: formData.get("footer_show_company_name") === "on",
      footer_show_org_number: formData.get("footer_show_org_number") === "on",
      footer_show_support_phone: formData.get("footer_show_support_phone") === "on",
      footer_show_support_email: formData.get("footer_show_support_email") === "on",
      loyalty_program_enabled: normalizeLoyaltyProgramEnabled(
        formData.get("loyalty_program_enabled") === "on",
      ),
    };
    if (actionThemeAllowed) {
      payload.theme_key = normalizeThemeKey(formData.get("theme_key"));
    }

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("tenant_settings").upsert(payload, { onConflict: "tenant_id" });

    revalidatePath("/admin/settings/site");
    revalidatePath("/admin/settings/company");
    revalidatePath("/admin/settings/payments");
    revalidatePath("/");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Butiksinställningar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Allt som visas i storefront hanteras här: logo, site name, kontaktinfo och footer-visning.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Topbar trygghetsrad hanteras under{" "}
        <Link href="/admin/trust-strip" className="underline">
          Topbar trygghetsrad
        </Link>
        .
      </p>

      <form action={saveSiteSettings} className="mt-4 space-y-5">
        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Varumärke & visning</legend>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Logo URL</span>
              <input
                name="logo_url"
                defaultValue={data?.logo_url ?? ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Ladda upp logo</span>
              <input
                name="logo_file"
                type="file"
                accept="image/*"
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
              />
              <span className="mt-1 block text-xs text-slate-500">
                Om du laddar upp en fil ersätter den Logo URL.
              </span>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Site name (visningsnamn)</span>
              <input
                name="brand_name"
                defaultValue={data?.brand_name ?? access.tenant.name}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Support E-post</span>
              <input
                name="support_email"
                defaultValue={data?.support_email ?? ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Support Telefon</span>
              <input
                name="support_phone"
                defaultValue={data?.support_phone ?? ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            {themeAllowed ? (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Tema / skal</span>
                <select
                  name="theme_key"
                  defaultValue={normalizeThemeKey(data?.theme_key)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="classic">Classic</option>
                  <option value="sport">Sport</option>
                  <option value="fashion">Klädbutik</option>
                  <option value="beauty">Skönhet</option>
                  <option value="electronics">Elektronik</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
            ) : (
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Tema hanteras internt av butikbyggaren.
              </div>
            )}
          </div>
          {data?.logo_url ? (
            <div className="mt-3 rounded-md border border-slate-200 p-3">
              <p className="mb-2 text-xs font-medium text-slate-600">Nuvarande logo</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.logo_url} alt="Nuvarande logo" className="h-10 w-auto object-contain" />
            </div>
          ) : null}
        </fieldset>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Footer: visa företagsuppgifter</legend>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input
                type="checkbox"
                name="footer_show_company_name"
                defaultChecked={Boolean(data?.footer_show_company_name ?? true)}
              />
              Visa företagsnamn
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input
                type="checkbox"
                name="footer_show_org_number"
                defaultChecked={Boolean(data?.footer_show_org_number ?? false)}
              />
              Visa organisationsnummer
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input
                type="checkbox"
                name="footer_show_support_phone"
                defaultChecked={Boolean(data?.footer_show_support_phone ?? false)}
              />
              Visa telefon
            </label>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
              <input
                type="checkbox"
                name="footer_show_support_email"
                defaultChecked={Boolean(data?.footer_show_support_email ?? true)}
              />
              Visa e-post
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

        <button
          type="submit"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Spara butiksinställningar
        </button>
      </form>
    </section>
  );
}

