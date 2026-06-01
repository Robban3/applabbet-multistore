"use client";

import { useEffect, useState } from "react";

/**
 * Dev-navigator för demo-tenants.
 *
 * Tar dig direkt till respektive isolerad demo-tenant — varje subdomän mappar
 * mot en egen tenant i Supabase med egna kategorier och produkter. Det här
 * speglar produktionen: varje kund får sin egen domän + sin egen data.
 *
 * Om en tenant inte finns för en viss tema (t.ex. beauty/fashion) hamnar man
 * tillbaka på applabbet-demo (default) — där dev_theme-cookien kan användas
 * för snabb visuell preview.
 */
const TARGETS = [
  { key: "classic",     label: "Classic",     accent: "#c8a164", host: "classic.localhost",     hasTenant: true,  brand: "Heritage House" },
  { key: "luxury",      label: "Luxury",      accent: "#C41E3A", host: "luxury.localhost",      hasTenant: true,  brand: "Maison Noir" },
  { key: "sport",       label: "Sport",       accent: "#b3ff00", host: "sport.localhost",       hasTenant: true,  brand: "Velocity Sport" },
  { key: "fashion",     label: "Fashion",     accent: "#1A1A1A", host: "fashion.localhost",     hasTenant: true,  brand: "Applabbet Demo" },
  { key: "beauty",      label: "Beauty",      accent: "#f1a9bf", host: "localhost",             hasTenant: false, brand: "(cookie-preview)" },
  { key: "electronics", label: "Electronics", accent: "#2f7dff", host: "electronics.localhost", hasTenant: true,  brand: "Applabbet Demo" },
  { key: "minimal",     label: "Minimal",     accent: "#0071E3", host: "minimal.localhost",     hasTenant: true,  brand: "Applabbet Demo" },
  { key: "dev",         label: "Dev (blandat)", accent: "#888",   host: "localhost",            hasTenant: true,  brand: "Applabbet Demo" },
] as const;

export function DevThemeSwitcher({ currentTheme }: { currentTheme: string }) {
  const [open, setOpen] = useState(false);
  // currentHost sätts först efter mount → undviker SSR-mismatch.
  // Innan dess används currentTheme för att gissa aktiv target.
  const [currentHost, setCurrentHost] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentHost(window.location.hostname);
    setMounted(true);
  }, []);

  function go(target: (typeof TARGETS)[number]) {
    setOpen(false);
    const port = window.location.port ? `:${window.location.port}` : "";
    if (target.hasTenant) {
      document.cookie = "dev_theme=; path=/; max-age=0";
      window.location.href = `http://${target.host}${port}/`;
      return;
    }
    document.cookie = `dev_theme=${target.key}; path=/; max-age=31536000; samesite=lax`;
    if (window.location.hostname !== "localhost") {
      window.location.href = `http://localhost${port}/`;
    } else {
      window.location.reload();
    }
  }

  // Aktiv target:
  //  Före mount → använd currentTheme (server-konsekvent)
  //  Efter mount → match på host (mer exakt)
  const activeByTheme = TARGETS.find((t) => t.key === currentTheme);
  const activeByHost = currentHost ? TARGETS.find((t) => t.hasTenant && t.host === currentHost) : null;
  const active = (mounted ? activeByHost : null) ?? activeByTheme ?? TARGETS.find((t) => t.key === "dev")!;

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-2">
      {open && (
        <div className="mb-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              DEV — Demo-butiker
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">Subdomän = riktig tenant. Cookie = preview.</p>
          </div>
          <div className="grid grid-cols-1 gap-px bg-slate-100 p-px">
            {TARGETS.map((t) => {
              const isActive = t.key === active.key;
              return (
                <button
                  key={t.key}
                  onClick={() => go(t)}
                  className={`flex items-center gap-3 bg-white px-3 py-2 text-left transition hover:bg-slate-50 ${
                    isActive ? "ring-2 ring-inset ring-blue-500" : ""
                  }`}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                    style={{ background: t.accent }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-slate-800">{t.label}</span>
                    <span className="text-[10px] text-slate-500">
                      {t.hasTenant ? t.host : `localhost · cookie=${t.key}`}
                    </span>
                  </div>
                  <span className="ml-auto text-[10px] text-slate-400">{t.brand}</span>
                  {isActive && <span className="ml-1 text-[10px] text-blue-500">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold shadow-lg transition hover:shadow-xl"
        title="Devmode: byt demo-butik / tema"
      >
        <span className="h-3 w-3 rounded-full" style={{ background: active.accent }} />
        <span className="text-slate-700">{active.label}</span>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
    </div>
  );
}
