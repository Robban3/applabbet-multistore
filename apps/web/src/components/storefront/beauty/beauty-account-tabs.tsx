"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AccountSidebarItem } from "@/components/account-sidebar";

export function BeautyAccountTabs({ items }: { items: AccountSidebarItem[] }) {
  const pathname = usePathname() || "/mina-sidor";
  return (
    <nav className="border-b border-[#ECECEC] bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-1 px-4 sm:px-6">
        {items.map((item) => {
          const base = item.href.split("?")[0];
          const isActive = base === "/mina-sidor" ? pathname === "/mina-sidor" : pathname.startsWith(base);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.02em] transition ${
                isActive
                  ? "border-[#EC008C] text-[#1A1A1A]"
                  : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
