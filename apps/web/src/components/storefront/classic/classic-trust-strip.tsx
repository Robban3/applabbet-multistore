export type ClassicTrustIcon = "truck" | "returns" | "star" | "shield" | "headset";

export type ClassicTrustItem = {
  title: string;
  text: string;
  icon?: ClassicTrustIcon;
};

export type ClassicTrustStripProps = {
  items: ClassicTrustItem[];
};

function TrustIcon({ icon }: { icon: ClassicTrustIcon }) {
  if (icon === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </svg>
    );
  }
  if (icon === "headset" || icon === "returns") {
    return (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12a9 9 0 0 1 18 0" />
        <path d="M21 16a2 2 0 0 1-2 2h-1v-5h3Z" />
        <path d="M3 16a2 2 0 0 0 2 2h1v-5H3Z" />
        <path d="M12 21a3 3 0 0 0 3-3" />
      </svg>
    );
  }
  if (icon === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5 13.5 11H17l-3 2.3 1.2 3.7L12 14.8l-3.2 2.2 1.2-3.7L7 11h3.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function ClassicTrustStrip({ items }: ClassicTrustStripProps) {
  return (
    <div className="px-12 pb-6 sm:px-16">
      <div className="grid overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_12px_32px_rgba(21,17,12,0.18)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <article
            key={item.title}
            className="flex min-h-[130px] items-center gap-4 border-t border-black/8 px-6 py-7 lg:border-l lg:border-t-0 lg:first:border-l-0"
          >
            <div className="shrink-0">
              <TrustIcon icon={item.icon ?? (idx === 0 ? "truck" : idx === 1 ? "headset" : idx === 2 ? "star" : "shield")} />
            </div>
            <div>
              <p className="text-[15px] font-semibold leading-tight text-[#17120d]">{item.title}</p>
              <p className="mt-0.5 text-[13px] leading-tight text-[#5f554a]">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
