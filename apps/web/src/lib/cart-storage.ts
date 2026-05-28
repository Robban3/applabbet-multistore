export type CartItem = {
  productId: string;
  title: string;
  priceMinor: number;
  quantity: number;
  currency: string;
  selectedColor?: string;
  selectedMaterial?: string;
  selectedSize?: string;
};

export const CART_KEY = "applabbet_multistore_cart_v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addProductToCart(input: {
  productId: string;
  title: string;
  priceMinor: number;
  currency: string;
  quantity?: number;
  selectedColor?: string;
  selectedMaterial?: string;
  selectedSize?: string;
}) {
  const quantityToAdd = Math.max(1, Math.floor(input.quantity || 1));
  const current = readCart();
  const existing = current.find(
    (item) =>
      item.productId === input.productId &&
      (item.selectedColor || "") === (input.selectedColor || "") &&
      (item.selectedMaterial || "") === (input.selectedMaterial || "") &&
      (item.selectedSize || "") === (input.selectedSize || ""),
  );
  const next = existing
    ? current.map((item) =>
        item.productId === input.productId &&
        (item.selectedColor || "") === (input.selectedColor || "") &&
        (item.selectedMaterial || "") === (input.selectedMaterial || "") &&
        (item.selectedSize || "") === (input.selectedSize || "")
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item,
      )
    : [
        ...current,
        {
          productId: input.productId,
          title: input.title,
          priceMinor: input.priceMinor,
          currency: input.currency,
          quantity: quantityToAdd,
          selectedColor: input.selectedColor,
          selectedMaterial: input.selectedMaterial,
          selectedSize: input.selectedSize,
        },
      ];
  writeCart(next);
}
