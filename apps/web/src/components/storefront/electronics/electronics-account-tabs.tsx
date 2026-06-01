"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AccountSidebarItem } from "@/components/account-sidebar";

export function ElectronicsAccountTabs({ items }: { items: AccountSidebarItem[] }) {
  const pathname = usePathname() || "/mina-sidor";
  return (
    <nav className="border-b border-[#DCE6F5] bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1 overflow-x-auto px-6">
        {items.map((item) => {
          const base = item.href.split("?")[0];
          const isActive = base === "/mina-sidor" ? pathname === "/mina-sidor" : pathname.startsWith(base);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap px-4 py-3 text-[14px] transition ${
                isActive ? "font-semibold text-[#2f7dff]" : "text-[#0A2540]/70 hover:text-[#0A2540]"
              }`}
            >
              {item.label}
              {isActive ? <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#2f7dff]" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
