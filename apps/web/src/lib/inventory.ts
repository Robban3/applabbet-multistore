import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface InventoryRow {
  id: string;
  product_id: string;
  on_hand_quantity: number;
  reserved_quantity: number;
}

interface OrderItemRow {
  product_id: string;
  product_title: string;
  quantity: number;
}

export async function finalizeInventoryForOrder(params: {
  tenantId: string;
  orderId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createSupabaseAdminClient();
  const { tenantId, orderId } = params;

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, product_title, quantity")
    .eq("tenant_id", tenantId)
    .eq("order_id", orderId);

  const items = (orderItems || []) as OrderItemRow[];
  if (items.length === 0) {
    return { ok: true };
  }

  const productIds = Array.from(
    new Set(items.map((item) => item.product_id).filter((value): value is string => Boolean(value))),
  );

  if (productIds.length === 0) {
    return { ok: true };
  }

  const { data: inventoryRows } = await supabase
    .from("inventory_levels")
    .select("id, product_id, on_hand_quantity, reserved_quantity")
    .eq("tenant_id", tenantId)
    .in("product_id", productIds);

  const rowsByProduct = new Map<string, InventoryRow[]>();
  for (const row of (inventoryRows || []) as InventoryRow[]) {
    const existing = rowsByProduct.get(row.product_id) || [];
    existing.push(row);
    rowsByProduct.set(row.product_id, existing);
  }

  for (const item of items) {
    const rows = rowsByProduct.get(item.product_id) || [];
    if (rows.length === 0) {
      return { ok: false, error: `Saknar lagernivå för ${item.product_title}.` };
    }
    const available = rows.reduce(
      (sum, row) => sum + Math.max(0, Number(row.on_hand_quantity) - Number(row.reserved_quantity)),
      0,
    );
    if (available < item.quantity) {
      return { ok: false, error: `Otillräckligt lagersaldo för ${item.product_title}.` };
    }
  }

  for (const item of items) {
    const rows = [...(rowsByProduct.get(item.product_id) || [])].sort(
      (a, b) => Number(b.on_hand_quantity) - Number(a.on_hand_quantity),
    );
    let remaining = item.quantity;

    for (const row of rows) {
      if (remaining <= 0) break;
      const available = Math.max(0, Number(row.on_hand_quantity) - Number(row.reserved_quantity));
      const allocate = Math.min(remaining, available);
      if (allocate <= 0) continue;

      const nextOnHand = Math.max(0, Number(row.on_hand_quantity) - allocate);
      const nextReserved = Math.max(0, Number(row.reserved_quantity) - allocate);

      const { error } = await supabase
        .from("inventory_levels")
        .update({
          on_hand_quantity: nextOnHand,
          reserved_quantity: nextReserved,
        })
        .eq("id", row.id);

      if (error) {
        return { ok: false, error: `Kunde inte uppdatera lager: ${error.message}` };
      }

      row.on_hand_quantity = nextOnHand;
      row.reserved_quantity = nextReserved;
      remaining -= allocate;
    }
  }

  return { ok: true };
}

