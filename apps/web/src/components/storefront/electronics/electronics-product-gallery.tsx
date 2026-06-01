"use client";

import { useState } from "react";

export function ElectronicsProductGallery({ title, images }: { title: string; images: string[] }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];
  const main = list[active] || "";

  return (
    <div className="grid gap-3 lg:grid-cols-[72px_1fr]">
      <div className="order-2 hidden lg:order-1 lg:block">
        <div className="flex flex-col gap-2">
          {list.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={`relative aspect-square w-[72px] overflow-hidden rounded-[10px] border transition ${idx === active ? "border-[#2f7dff]" : "border-[#DCE6F5] hover:border-[#9bbef5]"}`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-contain p-1.5" loading="lazy" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <div className="relative aspect-square overflow-hidden rounded-[16px] border border-[#DCE6F5] bg-[#F4F7FC]">
          {main ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={main} alt={`${title} – bild ${active + 1}`} className="absolute inset-0 h-full w-full object-contain p-8" loading="eager" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
