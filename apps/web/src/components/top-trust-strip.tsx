import type { TrustBadge } from "@/lib/tenant-settings";

type TopTrustStripProps = {
  items: TrustBadge[];
  size?: "default" | "large";
};

function TrustIcon({ icon }: { icon: TrustBadge["icon"] }) {
  if (icon === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }
  if (icon === "rotate") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 5v5h-5" />
        <path d="M4 19v-5h5" />
        <path d="M19 10a7 7 0 0 0-12-3" />
        <path d="M5 14a7 7 0 0 0 12 3" />
      </svg>
    );
  }
  if (icon === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3.8 14.8 9l5.7.9-4 4.2.9 5.7L12 17.1l-5.4 2.7.9-5.7-4-4.2L9.2 9 12 3.8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
    </svg>
  );
}

export function TopTrustStrip({ items, size = "default" }: TopTrustStripProps) {
  const isLarge = size === "large";
  const visibleItems = items.filter((item) => item.enabled);
  if (visibleItems.length === 0) return null;
  const gridColumnsClass =
    visibleItems.length >= 4
      ? "sm:grid-cols-4"
      : visibleItems.length === 3
        ? "sm:grid-cols-3"
        : visibleItems.length === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-1";

  return (
    <div className={`grid ${gridColumnsClass}`} style={{ background: "var(--store-trust-gradient)" }}>
      {visibleItems.map((item, idx) => (
        <article
          key={`${item.title}-${item.icon}-${idx}`}
          className={`flex items-center border-t border-white/10 text-white/90 sm:border-r sm:last:border-r-0 sm:border-t-0 ${
            isLarge ? "min-h-[82px] gap-4 px-6 py-4" : "min-h-[68px] gap-3 px-5 py-3"
          }`}
        >
          <span className={`inline-flex items-center justify-center ${isLarge ? "h-10 w-10" : "h-8 w-8"}`}>
            <TrustIcon icon={item.icon} />
          </span>
          <div>
            <p className={`${isLarge ? "text-[13px]" : "text-[12px]"} font-semibold uppercase tracking-wide leading-tight`}>
              {item.title}
            </p>
            <p className={`${isLarge ? "text-[13px]" : "text-[12px]"} text-white/70 leading-tight`}>
              {item.text}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
