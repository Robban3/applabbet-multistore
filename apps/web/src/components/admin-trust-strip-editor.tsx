"use client";

import { useMemo, useState } from "react";
import { TopTrustStrip } from "@/components/top-trust-strip";
import type { TrustBadge } from "@/lib/tenant-settings-shared";

const ICON_OPTIONS: Array<{ value: TrustBadge["icon"]; label: string }> = [
  { value: "truck", label: "Lastbil / leverans" },
  { value: "rotate", label: "Retur / öppet köp" },
  { value: "shield", label: "Sköld / säkerhet" },
  { value: "star", label: "Stjärna / fördel" },
];

interface AdminTrustStripEditorProps {
  initialBadges: TrustBadge[];
}

export function AdminTrustStripEditor({ initialBadges }: AdminTrustStripEditorProps) {
  const [badges, setBadges] = useState<TrustBadge[]>(
    Array.from({ length: 4 }, (_, index) => {
      const fallback = initialBadges[index] || initialBadges[Math.min(index, initialBadges.length - 1)];
      return {
        title: fallback?.title || "",
        text: fallback?.text || "",
        icon: fallback?.icon || "shield",
        enabled: fallback?.enabled ?? index < 3,
      };
    }),
  );

  function updateBadge(index: number, next: Partial<TrustBadge>) {
    setBadges((prev) =>
      prev.map((badge, badgeIndex) =>
        badgeIndex === index ? { ...badge, ...next } : badge,
      ),
    );
  }

  const payload = useMemo(() => JSON.stringify(badges), [badges]);

  return (
    <div className="space-y-4">
      <input type="hidden" name="trust_badges_payload" value={payload} />

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-800">Preview</legend>
        <div className="overflow-hidden rounded-md border border-slate-200">
          <TopTrustStrip items={badges} />
        </div>
      </fieldset>

      <div className="grid gap-3">
        {badges.map((badge, index) => (
          <fieldset key={`trust-badge-${index}`} className="rounded-lg border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-800">{`Kort ${index + 1}`}</legend>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Rubrik</span>
                <input
                  value={badge.title}
                  onChange={(event) => updateBadge(index, { title: event.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Underrubrik</span>
                <input
                  value={badge.text}
                  onChange={(event) => updateBadge(index, { text: event.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Ikon</span>
                <select
                  value={badge.icon}
                  onChange={(event) =>
                    updateBadge(index, { icon: event.target.value as TrustBadge["icon"] })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  {ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={badge.enabled}
                  onChange={(event) => updateBadge(index, { enabled: event.target.checked })}
                />
                Visa kort {index + 1}
              </label>
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

