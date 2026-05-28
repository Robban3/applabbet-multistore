"use client";

import { useEffect, useMemo, useState } from "react";

type CookieSettingsPanelProps = {
  openButtonLabel: string;
};

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "applabbet-cookie-preferences";
const COOKIE_NAME = "cookie_preferences";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: true,
  functional: true,
  marketing: false,
  updatedAt: "",
};

function readPreferences(): CookiePreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      functional: Boolean(parsed.functional),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return defaultPreferences;
  }
}

function persistPreferences(next: CookiePreferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(next),
  )}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
  window.dispatchEvent(new CustomEvent("cookie-preferences-updated", { detail: next }));
}

export function CookieSettingsPanel({ openButtonLabel }: CookieSettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(defaultPreferences.analytics);
  const [functional, setFunctional] = useState(defaultPreferences.functional);
  const [marketing, setMarketing] = useState(defaultPreferences.marketing);
  const [lastSavedAt, setLastSavedAt] = useState("");

  useEffect(() => {
    const current = readPreferences();
    setAnalytics(current.analytics);
    setFunctional(current.functional);
    setMarketing(current.marketing);
    setLastSavedAt(current.updatedAt);
  }, []);

  const savedLabel = useMemo(() => {
    if (!lastSavedAt) return "";
    const date = new Date(lastSavedAt);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, [lastSavedAt]);

  function saveSelection() {
    const next: CookiePreferences = {
      necessary: true,
      analytics,
      functional,
      marketing,
      updatedAt: new Date().toISOString(),
    };
    persistPreferences(next);
    setLastSavedAt(next.updatedAt);
    setIsOpen(false);
  }

  function allowAll() {
    setAnalytics(true);
    setFunctional(true);
    setMarketing(true);
    const next: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    };
    persistPreferences(next);
    setLastSavedAt(next.updatedAt);
    setIsOpen(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center rounded-full bg-[#e6a23b] px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-[#d69435]"
      >
        {openButtonLabel}
      </button>

      {isOpen ? (
        <div className="mt-3 rounded-xl border border-[#e8dfd2] bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Cookieinställningar</p>
          <p className="mt-1 text-xs text-slate-600">
            Nödvändiga cookies är alltid aktiva. Du kan välja övriga kategorier nedan.
          </p>

          <div className="mt-3 space-y-2">
            <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
              <span>Nödvändiga cookies</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">Alltid aktiv</span>
            </label>
            <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
              <span>Prestanda och analys</span>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
              <span>Funktionella cookies</span>
              <input type="checkbox" checked={functional} onChange={(event) => setFunctional(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
              <span>Marknadsföringscookies</span>
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveSelection}
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Spara val
            </button>
            <button
              type="button"
              onClick={allowAll}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Tillåt alla
            </button>
          </div>

          {savedLabel ? <p className="mt-2 text-xs text-slate-500">Senast sparad: {savedLabel}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
