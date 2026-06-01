"use client";

import { useState } from "react";

type SportProductGalleryProps = {
  title: string;
  images: string[];
};

/**
 * Nike.com-stil produktgalleri.
 * Vertikal thumbnails-stripe vänster (kolumn) + stor huvudbild höger.
 * Klick på en thumbnail byter huvudbild. Aktiv thumbnail får svart kant.
 * Mobil: thumbnails döljs, huvudbild full bredd.
 */
export function SportProductGallery({ title, images }: SportProductGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];
  const main = list[active] || "";

  return (
    <div className="grid gap-3 lg:grid-cols-[80px_1fr]">
      {/* Thumbnails-kolumn (vänster) */}
      <div className="order-2 hidden lg:order-1 lg:block">
        <div className="flex flex-col gap-3">
          {list.map((src, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Visa bild ${idx + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative aspect-square w-20 overflow-hidden bg-[#f5f5f5] transition ${
                  isActive ? "ring-2 ring-[#111] ring-offset-2" : "hover:ring-1 hover:ring-[#cccccc]"
                }`}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Huvudbild (höger / mobil-full-bredd) */}
      <div className="order-1 lg:order-2">
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
          {main ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={main}
              alt={`${title} – bild ${active + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          ) : null}
        </div>

        {/* Mobil-thumbnails (horisontell scroll) */}
        {list.length > 1 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 lg:hidden">
            {list.map((src, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={`m-${src}-${idx}`}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`Visa bild ${idx + 1}`}
                  className={`relative aspect-square w-16 shrink-0 overflow-hidden bg-[#f5f5f5] transition ${
                    isActive ? "ring-2 ring-[#111] ring-offset-2" : ""
                  }`}
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
