type TrustItem = { title: string; text: string; icon?: string };

function TrustIcon({ icon }: { icon?: string }) {
  if (icon === "truck") return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M2 6h11v9H2z" /><path d="M13 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" />
    </svg>
  );
  if (icon === "shield") return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
    </svg>
  );
  if (icon === "star") return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5 13.5 11H17l-3 2.3 1.2 3.7L12 14.8l-3.2 2.2 1.2-3.7L7 11h3.5Z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function LuxuryTrustStrip({ items }: { items: TrustItem[] }) {
  return (
    <div className="border-t border-white/8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <div
            key={item.title}
            className="flex items-center gap-4 border-b border-white/8 px-8 py-6 lg:border-b-0 lg:border-l lg:border-white/8 lg:first:border-l-0"
          >
            <TrustIcon icon={item.icon ?? (idx === 0 ? "truck" : idx === 1 ? "shield" : idx === 2 ? "star" : "headset")} />
            <div>
              <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white">{item.title}</p>
              <p className="mt-0.5 text-[11px] font-light text-white/45">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
