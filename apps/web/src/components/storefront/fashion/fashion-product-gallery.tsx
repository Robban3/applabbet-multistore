"use client";

import { useState } from "react";

type FashionProductGalleryProps = {
  title: string;
  images: string[];
};

/**
 * Filippa K-stil produktgalleri: thumbnails vänster (vertikal) + stor huvudbild.
 */
export function FashionProductGallery({ title, images }: FashionProductGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];
  const main = list[active] || "";

  return (
    <div className="grid gap-3 lg:grid-cols-[80px_1fr]">
      {/* Thumbnails-kolumn */}
      <div className="order-2 hidden lg:order-1 lg:block">
        <div className="flex flex-col gap-3">
          {list.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Visa bild ${idx + 1}`}
              className={`relative aspect-square w-20 overflow-hidden bg-[#F5F1EA] transition ${
                idx === active ? "ring-1 ring-[#1A1A1A] ring-offset-2 ring-offset-[#FAF9F6]" : "hover:opacity-80"
              }`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1EA]">
          {main ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={main} alt={`${title} – bild ${active + 1}`} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          ) : null}
        </div>

        {list.length > 1 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 lg:hidden">
            {list.map((src, idx) => (
              <button
                key={`m-${src}-${idx}`}
                type="button"
                onClick={() => setActive(idx)}
                className={`relative aspect-square w-16 shrink-0 overflow-hidden bg-[#F5F1EA] ${
                  idx === active ? "ring-1 ring-[#1A1A1A] ring-offset-2 ring-offset-[#FAF9F6]" : ""
                }`}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
