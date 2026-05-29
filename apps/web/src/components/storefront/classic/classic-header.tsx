import Link from "next/link";

export type ClassicHeaderLink = {
  label: string;
  href: string;
};

export type ClassicHeaderProps = {
  brandName: string;
  links: ClassicHeaderLink[];
};

export function ClassicHeader({
  brandName,
  links,
}: ClassicHeaderProps) {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between px-4 sm:px-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[-0.03em] text-[#17120d]"
        >
          {brandName}
        </Link>

        <nav className="hidden gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
