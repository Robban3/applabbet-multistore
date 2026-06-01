"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AccountSidebarItem } from "@/components/account-sidebar";

/**
 * Filippa K-stil flik-rad för /mina-sidor/*. Drivs av URL via usePathname.
 */
export function FashionAccountTabs({ items }: { items: AccountSidebarItem[] }) {
  const pathname = usePathname() || "/mina-sidor";
  return (
    <nav className="border-b border-[#E5E1DC] bg-[#FAF9F6]">
      <div className="flex flex-wrap items-center overflow-x-auto px-8 lg:px-14">
        {items.map((item) => {
          const base = item.href.split("?")[0];
          const isActive =
            base === "/mina-sidor" ? pathname === "/mina-sidor" : pathname.startsWith(base);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap px-4 py-3 text-[12px] tracking-[0.15em] uppercase transition ${
                isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
              }`}
            >
              {item.label}
              {isActive ? <span className="absolute inset-x-4 -bottom-px h-px bg-[#1A1A1A]" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
