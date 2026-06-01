"use client";

import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart-storage";

type CartCountBadgeProps = {
  initialCount?: number;
};

function getCartCount() {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function CartCountBadge({ initialCount = 0 }: CartCountBadgeProps) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    const syncCount = () => setCount(getCartCount());
    syncCount();
    window.addEventListener("cart-updated", syncCount);
    window.addEventListener("storage", syncCount);
    return () => {
      window.removeEventListener("cart-updated", syncCount);
      window.removeEventListener("storage", syncCount);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span
      suppressHydrationWarning
      className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--store-accent)] px-1 text-[10px] font-semibold text-[color:var(--store-accent-fg)]"
    >
      {count}
    </span>
  );
}
