"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type AdminTheme = "light" | "dark";

const ADMIN_THEME_STORAGE_KEY = "admin-theme";

const NAV_GROUPS = [
  {
    key: "catalog",
    label: "Katalog & order",
    items: [
      { href: "/admin/products", label: "Produkter och kategorier" },
      { href: "/admin/inventory", label: "Produktlager" },
      { href: "/admin/orders", label: "Ordrar" },
    ],
  },
  {
    key: "content",
    label: "Innehåll",
    items: [
      { href: "/admin/pages", label: "Sidor (CMS)" },
      { href: "/admin/pages/live-chat", label: "Chattinställningar" },
      { href: "/admin/pages/custom", label: "Egna sidor" },
      { href: "/admin/trust-strip", label: "Topbar trygghetsrad" },
    ],
  },
  {
    key: "settings",
    label: "Inställningar",
    items: [
      { href: "/admin/settings/menu", label: "Menyinställningar" },
      { href: "/admin/settings/site", label: "Butiksinställningar" },
      { href: "/admin/settings/company", label: "Företagsinställningar" },
      { href: "/admin/settings/payments", label: "Betalningar" },
      { href: "/admin/logistics", label: "Logistik & lager" },
      { href: "/admin/users", label: "Användare & roller" },
    ],
  },
] as const;

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin/pages") {
    return (
      pathname === "/admin/pages" ||
      (pathname.startsWith("/admin/pages/") &&
        !pathname.startsWith("/admin/pages/custom") &&
        !pathname.startsWith("/admin/pages/live-chat"))
    );
  }

  if (href === "/admin/pages/custom") {
    return pathname === "/admin/pages/custom" || pathname.startsWith("/admin/pages/custom/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitialTheme(): AdminTheme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>(() => getInitialTheme());
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";
  const isEditView =
    pathname.startsWith("/admin/pages/") && !pathname.startsWith("/admin/pages/custom") && searchParams.get("view") === "edit";

  if (isLoginPage) {
    return <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>;
  }

  function renderNavGroups(prefix: string) {
    return NAV_GROUPS.map((group) => (
      <div key={`${prefix}-${group.key}`} className="space-y-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</p>
        <div className="flex flex-col gap-2">
          {group.items.map((item) => (
            <Link
              key={`${prefix}-${item.href}`}
              href={item.href}
              className={`admin-nav-link inline-flex w-full rounded-md border px-3 py-2 text-sm transition-colors ${
                isNavItemActive(pathname, item.href)
                  ? "admin-nav-link-active border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    ));
  }

  return (
    <main
      className={`mx-auto w-full ${isEditView ? "max-w-none px-2 py-4 sm:px-3" : "max-w-7xl px-4 py-8 sm:px-6"} rounded-2xl ${isDark ? "admin-theme-dark bg-slate-950" : "admin-theme-light bg-slate-50"}`}
    >
      <div className={`grid gap-6 ${isEditView ? "grid-cols-1" : "lg:grid-cols-[260px_1fr]"}`}>
        {!isEditView ? (
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <h1 className="text-xl font-semibold text-slate-900">Adminpanel</h1>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              {isDark ? "Byt till ljust läge" : "Byt till mörkt läge"}
            </button>
          </div>

          <details className="mt-3 lg:hidden">
            <summary className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Visa sidomeny
            </summary>
            <nav className="mt-3 flex flex-col gap-4">
              {renderNavGroups("mobile")}
            </nav>
          </details>

          <nav className="mt-3 hidden flex-col gap-4 lg:flex">
            {renderNavGroups("desktop")}
          </nav>
        </aside>
        ) : null}

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
