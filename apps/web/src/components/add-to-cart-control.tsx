"use client";

import type { MouseEvent, ReactNode } from "react";
import { addProductToCart } from "@/lib/cart-storage";

type AddToCartControlProps = {
  productId: string;
  title: string;
  priceMinor: number;
  currency: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  preventDefault?: boolean;
};

export function AddToCartControl({
  productId,
  title,
  priceMinor,
  currency,
  className,
  children,
  ariaLabel,
  preventDefault = false,
}: AddToCartControlProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }
    addProductToCart({ productId, title, priceMinor, currency });
  }

  return (
    <button type="button" onClick={handleClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  );
}
