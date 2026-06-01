type TrustItem = { title: string; text: string; icon?: string };

function TrustIcon({ icon }: { icon?: string }) {
  const cls = "h-5 w-5 text-[#111]";
  if (icon === "truck") return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 6h11v9H2z" /><path d="M13 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" />
    </svg>
  );
  if (icon === "shield") return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
    </svg>
  );
  if (icon === "star") return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3.8 14.8 9l5.7.9-4 4.2.9 5.7L12 17.1l-5.4 2.7.9-5.7-4-4.2L9.2 9 12 3.8Z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}

export function SportTrustStrip({ items }: { items: TrustItem[] }) {
  return (
    <div className="border-b border-[#e5e5e5] bg-[#f7f7f7]">
      <div className="flex flex-wrap divide-x divide-[#e5e5e5]">
        {items.map((item) => (
          <div key={item.title} className="flex min-w-[200px] flex-1 items-center gap-3 px-6 py-4">
            <TrustIcon icon={item.icon} />
            <div>
              <p className="text-[12px] font-medium text-[#111]">{item.title}</p>
              <p className="text-[12px] text-[#757575]">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
