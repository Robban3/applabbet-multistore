"use client";

import { useState } from "react";

type ProductImageGalleryProps = {
  title: string;
  images: string[];
};

export function ProductImageGallery({ title, images }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);
  const activeImage = images[activeIndex] || null;
  const thumbImages = showAllThumbnails ? images : images.slice(0, 4);
  const overflowCount = Math.max(0, images.length - 4);

  return (
    <div className="grid gap-3 sm:grid-cols-[5rem_1fr]">
      <div className="flex gap-2 sm:flex-col">
        {thumbImages.length > 0 ? (
          thumbImages.map((imageUrl, idx) => (
            <button
              key={`thumb-${idx + 1}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-20 w-20 overflow-hidden rounded-xl border bg-white ${
                activeIndex === idx ? "border-slate-500" : "border-slate-200"
              }`}
              aria-label={`Visa bild ${idx + 1} för ${title}`}
              aria-pressed={activeIndex === idx}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`${title} miniatyr ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`thumb-${idx + 1}`}
              className="h-20 w-20 rounded-xl border border-slate-200 bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b]"
            />
          ))
        )}
        {overflowCount > 0 ? (
          showAllThumbnails ? (
            <button
              type="button"
              onClick={() => setShowAllThumbnails(false)}
              className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 px-2 text-center text-xs font-semibold text-white transition hover:brightness-110"
              style={{ background: "var(--store-footer-surface)" }}
            >
              Visa färre
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowAllThumbnails(true);
                setActiveIndex(Math.min(4, images.length - 1));
              }}
              className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ background: "var(--store-footer-surface)" }}
              aria-label={`Visa ${overflowCount} fler bilder`}
            >
              +{overflowCount}
            </button>
          )
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[image:var(--store-media-gradient)] p-5 shadow-sm">
        <span className="inline-flex rounded bg-[color:var(--store-accent)] px-3 py-1 text-xs font-semibold text-[color:var(--store-accent-fg)]">
          BÄSTSÄLJARE
        </span>
        <div className="mt-6 h-[26rem] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,202,138,0.30),transparent_42%)]">
          {activeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeImage} alt={title} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <button className="absolute bottom-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20 16.5 16.5" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
