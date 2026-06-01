"use client";

import { useState } from "react";

type MinimalProductGalleryProps = {
  title: string;
  images: string[];
};

/**
 * Apple-stil produktgalleri: stor centrerad produktbild på ljusgrå yta,
 * thumbnails som prickar/små rutor under (centrerade).
 */
export function MinimalProductGallery({ title, images }: MinimalProductGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];
  const main = list[active] || "";

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#F5F5F7]">
        {main ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main} alt={`${title} – bild ${active + 1}`} className="absolute inset-0 h-full w-full object-contain p-8" loading="eager" />
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          {list.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Visa bild ${idx + 1}`}
              className={`relative h-14 w-14 overflow-hidden rounded-[10px] border transition ${
                idx === active ? "border-[#0071E3]" : "border-[#D2D2D7] hover:border-[#86868B]"
              }`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-contain p-1.5" loading="lazy" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
