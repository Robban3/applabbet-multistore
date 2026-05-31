import { redirect } from "next/navigation";
import { hasAdminRouteAccess, normalizeTenantUserRole, type TenantUserRole } from "@/lib/admin-roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { Tenant } from "@/types/commerce";

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

function canBootstrapAdminMembership(email: string | null) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  // Applabbet-anställda och lokala testkonton bootstrappas automatiskt.
  if (normalized.endsWith("@applabbet.local")) return true;
  if (normalized.endsWith("@applabbet.com")) return true;

  const allowList = (process.env.ADMIN_BOOTSTRAP_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return allowList.includes(normalized);
}

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

  if (!membership) {
    if (canBootstrapAdminMembership(user.email ?? null)) {
      const admin = createSupabaseAdminClient();
      const { error } = await admin.from("tenant_users").upsert(
        {
          tenant_id: tenant.id,
          user_id: user.id,
          role: "admin",
        },
        { onConflict: "tenant_id,user_id" },
      );

      if (!error) {
        return {
          status: "allowed",
          tenant,
          role: "admin",
          user: {
            id: user.id,
            email: user.email ?? null,
          },
        };
      }
    }

    return { status: "forbidden", tenant };
  }

  const role = normalizeTenantUserRole(membership.role);
  if (!role || !hasAdminRouteAccess(role, nextPath)) {
    return { status: "forbidden", tenant };
  }

  return {
    status: "allowed",
    tenant,
    role,
    user: {
      id: user.id,
      email: user.email ?? null,
    },
  };
}
