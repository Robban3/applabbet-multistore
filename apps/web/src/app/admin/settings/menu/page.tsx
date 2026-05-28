import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { defaultNavigationMenu, normalizeNavigationMenu } from "@/lib/tenant-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminMenuSettingsPage() {
  const access = await requireAdminAccess("/admin/settings/menu");

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
    .select("navigation_menu")
    .eq("tenant_id", access.tenant.id)
    .maybeSingle();

  const menuItems = normalizeNavigationMenu(data?.navigation_menu);
  const rows = Array.from({ length: 10 }, (_, index) => {
    const item = menuItems[index] || defaultNavigationMenu[index];
    return {
      label: item?.label || "",
      href: item?.href || "",
      slug: item?.slug || "",
      order: item?.order ?? (index + 1) * 10,
      enabled: item?.enabled ?? false,
    };
  });

  async function saveMenuSettings(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/settings/menu");
    if (actionAccess.status !== "allowed") return;

    const payloadItems = Array.from({ length: 10 }, (_, index) => ({
      label: String(formData.get(`item_${index}_label`) || "").trim(),
      href: String(formData.get(`item_${index}_href`) || "").trim(),
      slug: String(formData.get(`item_${index}_slug`) || "").trim(),
      order: Number(formData.get(`item_${index}_order`) || (index + 1) * 10),
      enabled: formData.get(`item_${index}_enabled`) === "on",
    }));

    const normalized = normalizeNavigationMenu(payloadItems);

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("tenant_settings").upsert(
      {
        tenant_id: actionAccess.tenant.id,
        navigation_menu: normalized,
      },
      { onConflict: "tenant_id" },
    );

    revalidatePath("/admin/settings/menu");
    revalidatePath("/");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Menyinställningar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Välj vad som ska visas i toppmenyn, ange länk eller slug och ändra ordning.
      </p>

      <form action={saveMenuSettings} className="mt-4 space-y-3">
        {rows.map((item, index) => (
          <fieldset key={`menu-item-${index}`} className="rounded-lg border border-slate-200 p-3">
            <legend className="px-2 text-xs font-semibold text-slate-700">
              Menyrad {index + 1}
            </legend>
            <div className="grid gap-3 md:grid-cols-[1.3fr_1.3fr_1fr_90px_auto]">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Text</span>
                <input
                  name={`item_${index}_label`}
                  defaultValue={item.label}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Länk (href)</span>
                <input
                  name={`item_${index}_href`}
                  defaultValue={item.href}
                  placeholder="/om-oss eller /bastsaljare"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Slug (valfri)</span>
                <input
                  name={`item_${index}_slug`}
                  defaultValue={item.slug}
                  placeholder="t.ex. kampanj-2026"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Ordning</span>
                <input
                  type="number"
                  name={`item_${index}_order`}
                  defaultValue={item.order}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="mt-6 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={`item_${index}_enabled`}
                  defaultChecked={item.enabled}
                />
                Visa
              </label>
            </div>
          </fieldset>
        ))}

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Om både länk och slug anges används länken. Om länk är tom och slug är ifylld
          skapas länk automatiskt som <span className="font-mono">/sidor/slug</span>.
        </div>

        <button
          type="submit"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Spara meny
        </button>
      </form>
    </section>
  );
}

