"use client";

import { useMemo, useState } from "react";
import { addProductToCart } from "@/lib/cart-storage";

type ProductPurchaseControlsProps = {
  productId: string;
  title: string;
  priceMinor: number;
  currency: string;
  productColors?: string[] | null;
  productMaterials?: string[] | null;
  productSizes?: string[] | null;
  availableStock?: number | null;
};

function resolveColorSwatch(colorName: string): string | null {
  const normalized = colorName.trim().toLowerCase();
  const map: Record<string, string> = {
    svart: "#171717",
    vit: "#f8fafc",
    vitan: "#f8fafc",
    silver: "#9ca3af",
    gra: "#6b7280",
    grå: "#6b7280",
    bla: "#2563eb",
    blå: "#2563eb",
    rod: "#dc2626",
    röd: "#dc2626",
    gron: "#16a34a",
    grön: "#16a34a",
    gul: "#eab308",
    orange: "#ea580c",
    beige: "#d6c2a1",
    brun: "#7c4a2d",
    guld: "#c8a164",
    roseguld: "#b76e79",
    "roséguld": "#b76e79",
  };
  return map[normalized] || null;
}

export function ProductPurchaseControls({
  productId,
  title,
  priceMinor,
  currency,
  productColors,
  productMaterials,
  productSizes,
  availableStock,
}: ProductPurchaseControlsProps) {
  const colors = useMemo(
    () =>
      (productColors || [])
        .map((item) => item.trim())
        .filter(Boolean),
    [productColors],
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const materials = useMemo(
    () =>
      (productMaterials || [])
        .map((item) => item.trim())
        .filter(Boolean),
    [productMaterials],
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(materials[0] || null);
  const sizes = useMemo(
    () =>
      (productSizes || [])
        .map((item) => item.trim())
        .filter(Boolean),
    [productSizes],
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const stock = typeof availableStock === "number" ? Math.max(0, availableStock) : null;
  const isOutOfStock = stock === 0;
  const lowStock = typeof stock === "number" && stock > 0 && stock <= 5;

  function handleAddToCart() {
    addProductToCart({
      productId,
      title,
      priceMinor,
      currency,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedMaterial: selectedMaterial || undefined,
      selectedSize: selectedSize || undefined,
    });
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1400);
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    setIsBuyingNow(true);
    addProductToCart({
      productId,
      title,
      priceMinor,
      currency,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedMaterial: selectedMaterial || undefined,
      selectedSize: selectedSize || undefined,
    });
    window.location.href = "/checkout";
  }

  return (
    <>
      <div className="border-b border-slate-200 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Färg{selectedColor ? `: ${selectedColor}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.length > 0 ? (
            colors.map((color) => {
              const swatch = resolveColorSwatch(color);
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    active
                      ? "border-slate-900 ring-2 ring-slate-300"
                      : "border-slate-300 hover:border-slate-500"
                  }`}
                  aria-pressed={active}
                  aria-label={`Välj färg ${color}`}
                  title={color}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: swatch || "#9ca3af" }}
                  />
                </button>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">Inga färger tillagda i admin för produkten ännu.</p>
          )}
        </div>
      </div>

      <div className="border-b border-slate-200 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Armband{selectedMaterial ? `: ${selectedMaterial}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {materials.length > 0 ? (
            materials.map((material) => {
              const active = selectedMaterial === material;
              return (
                <button
                  key={material}
                  type="button"
                  onClick={() => setSelectedMaterial(material)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    active
                      ? "border-[color:var(--store-accent)] bg-white text-slate-900"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                  aria-pressed={active}
                >
                  {material}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">Inga armbandsalternativ tillagda i admin ännu.</p>
          )}
        </div>
      </div>
      {sizes.length > 0 ? (
        <div className="border-b border-slate-200 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Storlek{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    active
                      ? "border-[color:var(--store-accent)] bg-white text-slate-900"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                  aria-pressed={active}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className={`py-4 text-sm ${isOutOfStock ? "text-rose-700" : lowStock ? "text-amber-700" : "text-emerald-700"}`}>
        {isOutOfStock
          ? "Slut i lager"
          : lowStock
            ? `Fåtal kvar i lager (${stock} st)`
            : typeof stock === "number"
              ? `I lager (${stock} st) · Skickas inom 1-2 arbetsdagar`
              : "I lager · Skickas inom 1-2 arbetsdagar"}
      </p>
      <div className="flex items-center gap-3 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Antal</span>
        <div className="inline-flex items-center rounded-md border border-slate-300">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="px-3 py-1.5 text-slate-700"
            aria-label="Minska antal"
          >
            -
          </button>
          <span className="border-x border-slate-300 px-4 py-1.5 text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((value) => {
                const next = value + 1;
                if (typeof stock === "number") {
                  return Math.min(Math.max(1, stock), next);
                }
                return next;
              })
            }
            className="px-3 py-1.5 text-slate-700"
            aria-label="Öka antal"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full rounded-md px-4 py-3 text-sm font-semibold transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-slate-300 text-slate-600"
              : isAdded
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : "bg-[color:var(--store-accent)] text-slate-900 hover:brightness-95"
          }`}
          aria-live="polite"
        >
          {isOutOfStock
            ? "SLUT I LAGER"
            : isAdded
              ? "Tillagd i varukorgen"
              : `LÄGG I VARUKORG${quantity > 1 ? ` (${quantity})` : ""}`}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock || isBuyingNow}
          className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          style={{ background: "var(--store-footer-surface)" }}
        >
          {isBuyingNow ? "Skickar till kassan..." : "KÖP NU"}
        </button>
      </div>
    </>
  );
}
