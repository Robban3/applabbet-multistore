import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { hasAdminRouteAccess, normalizeTenantUserRole } from "@/lib/admin-roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

interface AdminLoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { next } = await searchParams;
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);

  if (!tenant) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Ingen tenant hittades för host. Kontrollera tenant_domains.
        </p>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: membership } = await supabase
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", tenant.id)
      .eq("user_id", user.id)
      .maybeSingle();

    const role = normalizeTenantUserRole(membership?.role);
    const preferredPath = next || "/admin/products";
    if (role && hasAdminRouteAccess(role, preferredPath)) {
      redirect(preferredPath);
    }
    if (role && hasAdminRouteAccess(role, "/admin/products")) {
      redirect("/admin/products");
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Admin inloggning</h1>
        <p className="mt-1 text-sm text-slate-600">Tenant: {tenant.name}</p>
        <p className="mt-4 text-sm text-slate-600">
          Logga in med ett konto som finns i tenant_users för den här butiken.
        </p>
        <div className="mt-5">
          <AdminLoginForm nextPath={next || "/admin/products"} />
        </div>
      </section>
    </main>
  );
}
