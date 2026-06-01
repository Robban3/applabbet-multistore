"use client";

import { useState } from "react";

const THEMES = [
  {
    key: "classic",
    name: "Classic",
    description: "Tidlös & universell",
    inspiration: "Premium butik",
    accent: "#c8a164",
    bg: "#f6f3ee",
    header: "#100f0d",
  },
  {
    key: "luxury",
    name: "Luxury",
    description: "Exklusivt & franskt",
    inspiration: "Cartier / Hermès",
    accent: "#C41E3A",
    bg: "#FAF8F5",
    header: "#0c0a08",
  },
  {
    key: "sport",
    name: "Sport",
    description: "Energi & kontrast",
    inspiration: "Nike / Gymshark",
    accent: "#b3ff00",
    bg: "#eef5e7",
    header: "#0a0f08",
  },
  {
    key: "fashion",
    name: "Fashion",
    description: "Mode & editorial",
    inspiration: "NA-KD / Arket",
    accent: "#c7a16b",
    bg: "#f5f1e8",
    header: "#0b1516",
  },
  {
    key: "beauty",
    name: "Beauty",
    description: "Ljust & feminint",
    inspiration: "Lyko / Sephora",
    accent: "#f1a9bf",
    bg: "#fff6f8",
    header: "#140f14",
  },
  {
    key: "electronics",
    name: "Electronics",
    description: "Teknik & trust",
    inspiration: "Webhallen / Komplett",
    accent: "#2f7dff",
    bg: "#f3f7ff",
    header: "#060c17",
  },
  {
    key: "minimal",
    name: "Minimal",
    description: "Luftigt & rent",
    inspiration: "Apple / MUJI",
    accent: "#1f2937",
    bg: "#f3f4f6",
    header: "#1f2937",
  },
] as const;

type Props = { currentTheme: string };

export function AdminThemePicker({ currentTheme }: Props) {
  const [selected, setSelected] = useState(currentTheme || "classic");

  return (
    <div>
      <input type="hidden" name="theme_key" value={selected} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {THEMES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSelected(t.key)}
            className={`relative overflow-hidden rounded-xl border-2 text-left transition ${
              selected === t.key
                ? "border-blue-500 shadow-md"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Mini storefront preview */}
            <div className="h-16" style={{ background: t.header }}>
              <div className="flex items-center gap-1 px-2 py-1.5">
                <div className="h-1.5 w-8 rounded-full" style={{ background: t.accent }} />
                <div className="ml-auto flex gap-1">
                  <div className="h-1.5 w-4 rounded-full bg-white/30" />
                  <div className="h-1.5 w-4 rounded-full bg-white/30" />
                  <div className="h-1.5 w-4 rounded-full bg-white/30" />
                </div>
              </div>
              <div className="px-2 pt-1">
                <div className="h-2 w-16 rounded-full bg-white/20" />
                <div className="mt-1 h-1.5 w-10 rounded-full" style={{ background: t.accent, opacity: 0.7 }} />
              </div>
            </div>
            <div className="p-2" style={{ background: t.bg }}>
              <p className="text-[12px] font-bold text-slate-900">{t.name}</p>
              <p className="text-[10px] text-slate-500">{t.description}</p>
              <p className="mt-0.5 text-[9px] font-medium text-slate-400">{t.inspiration}</p>
            </div>
            {selected === t.key && (
              <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m2 6 2.5 2.5 5.5-5" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
