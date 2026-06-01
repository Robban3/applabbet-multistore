"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AccountSidebarItem } from "@/components/account-sidebar";

export function MinimalAccountTabs({ items }: { items: AccountSidebarItem[] }) {
  const pathname = usePathname() || "/mina-sidor";
  return (
    <nav className="border-b border-[#D2D2D7] bg-white">
      <div className="mx-auto flex max-w-[980px] flex-wrap items-center justify-center gap-1 px-6">
        {items.map((item) => {
          const base = item.href.split("?")[0];
          const isActive = base === "/mina-sidor" ? pathname === "/mina-sidor" : pathname.startsWith(base);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap px-4 py-3 text-[13px] tracking-[-0.01em] transition ${
                isActive ? "text-[#1D1D1F]" : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              {item.label}
              {isActive ? <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#0071E3]" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
