import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_ROLE_LABELS, ADMIN_ROLES, normalizeTenantUserRole } from "@/lib/admin-roles";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface AdminUsersPageProps {
  searchParams: Promise<{
    status?: string;
    message?: string;
  }>;
}

interface TenantMembershipRow {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

function feedbackPath(status: "success" | "error", message: string) {
  const query = new URLSearchParams({ status, message });
  return `/admin/users?${query.toString()}`;
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = createSupabaseAdminClient();
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) return null;

    const match = data.users.find((user) => (user.email || "").trim().toLowerCase() === email);
    if (match) return match.id;

    if (data.users.length < perPage) return null;
    page += 1;
  }
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const access = await requireAdminAccess("/admin/users");

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
        Ditt konto saknar behörighet att hantera användare och roller.
      </p>
    );
  }

  const admin = createSupabaseAdminClient();
  const { data: membershipsData } = await admin
    .from("tenant_users")
    .select("id, user_id, role, created_at")
    .eq("tenant_id", access.tenant.id)
    .order("created_at", { ascending: true });

  const memberships = ((membershipsData || []) as TenantMembershipRow[]).map((membership) => ({
    ...membership,
    normalizedRole: normalizeTenantUserRole(membership.role) ?? "viewer",
  }));

  const usersWithEmail = await Promise.all(
    memberships.map(async (membership) => {
      const { data } = await admin.auth.admin.getUserById(membership.user_id);
      return {
        ...membership,
        email: data?.user?.email || "(okänd e-post)",
      };
    }),
  );

  async function assignRoleAction(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/users");
    if (actionAccess.status !== "allowed") return;

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const roleInput = String(formData.get("role") || "").trim();
    const role = normalizeTenantUserRole(roleInput);

    if (!email || !role) {
      redirect(feedbackPath("error", "Ange en giltig e-post och roll."));
    }

    const userId = await findUserIdByEmail(email);
    if (!userId) {
      redirect(feedbackPath("error", "Ingen användare med den e-posten hittades i auth.users."));
    }

    const adminAction = createSupabaseAdminClient();
    const { error } = await adminAction.from("tenant_users").upsert(
      {
        tenant_id: actionAccess.tenant.id,
        user_id: userId,
        role,
      },
      { onConflict: "tenant_id,user_id" },
    );

    if (error) {
      redirect(feedbackPath("error", `Kunde inte tilldela roll: ${error.message}`));
    }

    revalidatePath("/admin/users");
    redirect(feedbackPath("success", `Rollen ${ADMIN_ROLE_LABELS[role]} sparades för ${email}.`));
  }

  async function updateRoleAction(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/users");
    if (actionAccess.status !== "allowed") return;

    const userId = String(formData.get("user_id") || "").trim();
    const roleInput = String(formData.get("role") || "").trim();
    const role = normalizeTenantUserRole(roleInput);

    if (!userId || !role) {
      redirect(feedbackPath("error", "Ogiltig användare eller roll."));
    }

    const adminAction = createSupabaseAdminClient();
    const { error } = await adminAction
      .from("tenant_users")
      .update({ role })
      .eq("tenant_id", actionAccess.tenant.id)
      .eq("user_id", userId);

    if (error) {
      redirect(feedbackPath("error", `Kunde inte uppdatera roll: ${error.message}`));
    }

    revalidatePath("/admin/users");
    redirect(feedbackPath("success", "Rollen uppdaterades."));
  }

  async function removeAccessAction(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/users");
    if (actionAccess.status !== "allowed") return;

    const userId = String(formData.get("user_id") || "").trim();
    if (!userId) return;

    if (userId === actionAccess.user.id) {
      redirect(feedbackPath("error", "Du kan inte ta bort din egen adminaccess."));
    }

    const adminAction = createSupabaseAdminClient();
    const { error } = await adminAction
      .from("tenant_users")
      .delete()
      .eq("tenant_id", actionAccess.tenant.id)
      .eq("user_id", userId);

    if (error) {
      redirect(feedbackPath("error", `Kunde inte ta bort access: ${error.message}`));
    }

    revalidatePath("/admin/users");
    redirect(feedbackPath("success", "Access borttagen."));
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Användare & roller</h2>
        <p className="mt-1 text-sm text-slate-600">
          Koppla en roll till en e-post inom tenant <span className="font-medium">{access.tenant.name}</span>.
        </p>
      </div>

      {params.message ? (
        <p
          className={`rounded-md border px-4 py-3 text-sm ${
            params.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {params.message}
        </p>
      ) : null}

      <form action={assignRoleAction} className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-[2fr_1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">E-post</span>
          <input
            type="email"
            name="email"
            required
            placeholder="user@dindoman.se"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Roll</span>
          <select name="role" defaultValue="editor" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            {ADMIN_ROLES.map((role) => (
              <option key={role} value={role}>
                {ADMIN_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </label>
        <div className="self-end">
          <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Lägg till / uppdatera
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">E-post</th>
              <th className="px-3 py-2">Roll</th>
              <th className="px-3 py-2">Skapad</th>
              <th className="px-3 py-2">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {usersWithEmail.map((membership) => (
              <tr key={membership.id} className="border-t border-slate-100 align-middle">
                <td className="px-3 py-2 text-slate-800">{membership.email}</td>
                <td className="px-3 py-2">
                  <form action={updateRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="user_id" value={membership.user_id} />
                    <select
                      name="role"
                      defaultValue={membership.normalizedRole}
                      className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    >
                      {ADMIN_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ADMIN_ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      Spara
                    </button>
                  </form>
                </td>
                <td className="px-3 py-2 text-slate-500">
                  {new Date(membership.created_at).toLocaleString("sv-SE")}
                </td>
                <td className="px-3 py-2">
                  <form action={removeAccessAction}>
                    <input type="hidden" name="user_id" value={membership.user_id} />
                    <button type="submit" className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50">
                      Ta bort access
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {usersWithEmail.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-slate-500" colSpan={4}>
                  Inga användare har tilldelats adminroller ännu.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <p>
          <span className="font-semibold">Roller:</span> Admin (full åtkomst), Editera/Redigera (ordrar, CMS, inställningar och logistik), Produktansvarig (endast produkter) och Läsbehörighet (ingen skrivåtkomst i admin).
        </p>
      </div>
    </section>
  );
}
