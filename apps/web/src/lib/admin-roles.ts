export const ADMIN_ROLES = ["admin", "editor", "viewer", "product_manager"] as const;

export type TenantUserRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABELS: Record<TenantUserRole, string> = {
  admin: "Admin",
  editor: "Editera / Redigera",
  viewer: "Läsbehörighet",
  product_manager: "Produktansvarig",
};

function isTenantUserRole(value: string): value is TenantUserRole {
  return (ADMIN_ROLES as readonly string[]).includes(value);
}

export function normalizeTenantUserRole(value: string | null | undefined): TenantUserRole | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized === "editera" || normalized === "redigera" || normalized === "redigerare") {
    return "editor";
  }
  if (normalized === "produktansvarig" || normalized === "product manager") {
    return "product_manager";
  }

  return isTenantUserRole(normalized) ? normalized : null;
}

export function hasAdminRouteAccess(role: TenantUserRole, nextPath: string): boolean {
  if (role === "admin") return true;
  if (role === "viewer") return false;

  if (role === "editor") {
    return !nextPath.startsWith("/admin/users");
  }

  if (role === "product_manager") {
    return nextPath.startsWith("/admin/products") || nextPath.startsWith("/admin/inventory");
  }

  return false;
}
