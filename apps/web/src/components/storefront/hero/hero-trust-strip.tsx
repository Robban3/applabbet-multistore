export type HeroTrustItem = {
    title: string;
    text: string;
  };
  
  export type HeroTrustStripProps = {
    items: HeroTrustItem[];
    isElectronics?: boolean;
    isBeauty?: boolean;
    isSport?: boolean;
  };
  
  export function HeroTrustStrip({
    items,
    isElectronics = false,
    isBeauty = false,
    isSport = false,
  }: HeroTrustStripProps) {
    return (
      <div
        className={`grid overflow-hidden rounded-xl border shadow-[0_8px_20px_rgba(21,17,12,0.14)] sm:grid-cols-2 ${
          isElectronics ? "lg:grid-cols-5" : "lg:grid-cols-4"
        }`}
        style={{
          borderColor: isBeauty ? "#efd9e2" : isSport ? "#d7decd" : "var(--store-card-border)",
          background: isBeauty ? "#ffffff" : isSport ? "#ffffff" : "var(--store-soft-surface)",
        }}
      >
        {items.map((card) => (
          <article
            key={card.title}
            className="flex min-h-[88px] items-center gap-3 border-t px-5 py-3 lg:min-h-[96px] lg:border-l lg:border-t-0 lg:first:border-l-0"
            style={{
              borderColor: isBeauty
                ? "#f1e3ea"
                : isSport
                  ? "#e3e8dc"
                  : "var(--store-footer-border)",
            }}
          >
            <div>
              <p className="text-[15px] font-semibold">{card.title}</p>
              <p className="text-[13px] text-slate-600">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }