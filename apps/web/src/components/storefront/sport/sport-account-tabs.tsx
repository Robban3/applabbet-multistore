"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AccountSidebarItem } from "@/components/account-sidebar";

/**
 * Nike-stil flik-rad för /mina-sidor/*. Drivs av URL via usePathname.
 */
export function SportAccountTabs({ items }: { items: AccountSidebarItem[] }) {
  const pathname = usePathname() || "/mina-sidor";
  return (
    <nav className="border-b border-[#e5e5e5] bg-white">
      <div className="flex flex-wrap items-center overflow-x-auto px-6 lg:px-10">
        {items.map((item) => {
          const base = item.href.split("?")[0];
          const isActive =
            base === "/mina-sidor" ? pathname === "/mina-sidor" : pathname.startsWith(base);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap px-4 py-3 text-[13px] font-medium uppercase tracking-[0.04em] transition ${
                isActive ? "text-[#111]" : "text-[#757575] hover:text-[#111]"
              }`}
            >
              {item.label}
              {isActive ? <span className="absolute inset-x-4 -bottom-px h-[3px] bg-[#111]" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
