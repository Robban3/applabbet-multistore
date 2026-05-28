import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getFavoriteProductIdsForCurrentUser(tenantId: string): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("customer_favorites")
    .select("product_id")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id);

  return (data || []).map((row) => row.product_id as string);
}
