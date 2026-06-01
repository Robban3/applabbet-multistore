type SportPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SportPageHero({ eyebrow, title, description }: SportPageHeroProps) {
  return (
    <div className="relative overflow-hidden px-6 py-16 lg:px-10 lg:py-20" style={{ background: "var(--store-header-gradient)" }}>
      {/* Decorative lines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#b3ff00]/40" />
        <div className="absolute right-0 top-0 h-1 w-full bg-[#b3ff00]/20" />
      </div>
      <div className="relative z-10">
        {eyebrow && (
          <p className="text-[11px] font-black tracking-[0.4em] uppercase text-[#b3ff00]">{eyebrow}</p>
        )}
        <h1
          className="mt-3 font-black uppercase leading-[0.9] text-white"
          style={{ fontSize: "clamp(40px, 5vw, 80px)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-[540px] text-[15px] font-medium leading-relaxed text-white/50">{description}</p>
        )}
        <div className="mt-5 h-1 w-16 bg-[#b3ff00]" />
      </div>
    </div>
  );
}
