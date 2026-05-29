export type HeroUtilityBarProps = {
    variant: "sport" | "beauty" | "electronics";
    items: string[];
    rightItems?: string[];
  };
  
  export function HeroUtilityBar({
    variant,
    items,
    rightItems = [],
  }: HeroUtilityBarProps) {
    if (items.length === 0) {
      return null;
    }
  
    if (variant === "beauty") {
      return (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#efd6e0] bg-[#f7dbe5] px-5 py-2 text-[10px] font-semibold text-slate-700">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
              {item}
              {index < items.length - 1 ? <span className="text-slate-400">|</span> : null}
            </span>
          ))}
        </div>
      );
    }
  
    if (variant === "electronics") {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-2 text-[11px] text-white/75">
          <div className="flex flex-wrap items-center gap-4">
            {items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
  
          {rightItems.length > 0 ? (
            <div className="flex items-center gap-4 text-white/70">
              {rightItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
        </div>
      );
    }
  
    return (
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0b0b0d] px-5 py-2 text-[10px] font-semibold text-white/80">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
            {item}
            {index < items.length - 1 ? <span className="text-white/35">|</span> : null}
          </span>
        ))}
      </div>
    );
  }