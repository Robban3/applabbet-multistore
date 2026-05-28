import Link from "next/link";

type LegalHeroProps = {
  currentLabel: string;
  currentHref: string;
  title: string;
  subtitle: string;
};

export function LegalHero({ currentLabel, currentHref, title, subtitle }: LegalHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#1f1a14] bg-gradient-to-r from-[#0b0a09] via-[#14110d] to-[#1d1712]">
      <div className="relative grid min-h-[250px] items-center px-8 py-8">
        <div className="max-w-[600px]">
          <p className="text-xs text-white/70">
            <Link href="/" className="hover:text-white">
              Hem
            </Link>
            <span className="mx-1">›</span>
            <Link href={currentHref} className="text-white hover:text-white/80">
              {currentLabel}
            </Link>
          </p>
          <h1 className="mt-2 text-[52px] font-semibold leading-[1.03] text-white">{title}</h1>
          <p className="mt-2 max-w-[520px] text-[17px] leading-relaxed text-white/90">{subtitle}</p>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-[48%]">
          <div className="absolute right-8 top-6 h-40 w-64 -rotate-6 rounded-lg border border-white/15 bg-black/45 shadow-2xl" />
          <div className="absolute right-20 top-16 h-28 w-36 rotate-[18deg] rounded-lg border border-[#c8a164]/45 bg-[#2a2118]/75" />
          <div className="absolute right-5 top-24 h-24 w-24 rounded-full bg-[#c8a164]/25 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
