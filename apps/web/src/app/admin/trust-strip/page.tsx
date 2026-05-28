import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTrustStripEditor } from "@/components/admin-trust-strip-editor";
import { requireAdminAccess } from "@/lib/admin-access";
import { normalizeTrustBadges } from "@/lib/tenant-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminTrustStripPageProps = {
  searchParams: Promise<{
    status?: string;
    message?: string;
  }>;
};

function feedbackPath(status: "success" | "error", message: string) {
  const query = new URLSearchParams({ status, message });
  return `/admin/trust-strip?${query.toString()}`;
}

export default async function AdminTrustStripPage({ searchParams }: AdminTrustStripPageProps) {
  const query = await searchParams;
  const access = await requireAdminAccess("/admin/trust-strip");

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
    .select("trust_badges")
    .eq("tenant_id", access.tenant.id)
    .maybeSingle();

  const trustBadges = normalizeTrustBadges(data?.trust_badges);

  async function saveTrustStrip(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/trust-strip");
    if (actionAccess.status !== "allowed") return;

    const payloadRaw = String(formData.get("trust_badges_payload") || "[]");
    let parsedPayload: unknown = [];
    try {
      parsedPayload = JSON.parse(payloadRaw);
    } catch {
      redirect(feedbackPath("error", "Kunde inte tolka formulardata för trygghetsraden."));
    }

    const normalized = normalizeTrustBadges(parsedPayload);

    const supabaseAction = await createSupabaseServerClient();
    const { error } = await supabaseAction.from("tenant_settings").upsert(
      {
        tenant_id: actionAccess.tenant.id,
        trust_badges: normalized,
      },
      { onConflict: "tenant_id" },
    );

    if (error) {
      redirect(feedbackPath("error", `Kunde inte spara trygghetsraden: ${error.message}`));
    }

    revalidatePath("/admin/trust-strip");
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/nyheter");
    revalidatePath("/leverans");
    revalidatePath("/kundservice");
    redirect(feedbackPath("success", "Trygghetsraden är uppdaterad."));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Topbar trygghetsrad</h2>
          <p className="mt-1 text-sm text-slate-600">
            Hantera vilka kort som visas under topbaren med live preview.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Till Företag & betalningar
        </Link>
      </div>

      {query.message ? (
        <p
          className={`mb-3 rounded-md border px-3 py-2 text-sm ${
            query.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {query.message}
        </p>
      ) : null}

      <form action={saveTrustStrip} className="space-y-4">
        <AdminTrustStripEditor initialBadges={trustBadges} />

        <button
          type="submit"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Spara trygghetsrad
        </button>
      </form>
    </section>
  );
}

