import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { Tenant } from "@/types/commerce";

type TenantUserRole = "admin" | "editor" | "viewer";

interface AccessBase {
  tenant: Tenant;
}

interface AccessAllowed extends AccessBase {
  status: "allowed";
  role: TenantUserRole;
  user: {
    id: string;
    email: string | null;
  };
}

interface AccessTenantMissing {
  status: "tenant_missing";
}

interface AccessForbidden extends AccessBase {
  status: "forbidden";
}

export type AdminAccessResult = AccessAllowed | AccessTenantMissing | AccessForbidden;

export async function requireAdminAccess(nextPath = "/admin/products"): Promise<AdminAccessResult> {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);

  if (!tenant) return { status: "tenant_missing" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: membership } = await supabase
    .from("tenant_users")
    .select("role")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return { status: "forbidden", tenant };

  return {
    status: "allowed",
    tenant,
    role: membership.role as TenantUserRole,
    user: {
      id: user.id,
      email: user.email ?? null,
    },
  };
}
