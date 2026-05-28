export type CartItem = {
  productId: string;
  title: string;
  priceMinor: number;
  quantity: number;
  currency: string;
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
}) {
  const current = readCart();
  const existing = current.find((item) => item.productId === input.productId);
  const next = existing
    ? current.map((item) =>
        item.productId === input.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [
        ...current,
        {
          productId: input.productId,
          title: input.title,
          priceMinor: input.priceMinor,
          currency: input.currency,
          quantity: 1,
        },
      ];
  writeCart(next);
}
