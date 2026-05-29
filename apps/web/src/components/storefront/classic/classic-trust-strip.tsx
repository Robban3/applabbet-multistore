export type ClassicTrustItem = {
  title: string;
  text: string;
};

export type ClassicTrustStripProps = {
  items: ClassicTrustItem[];
};

export function ClassicTrustStrip({
  items,
}: ClassicTrustStripProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
      <div className="grid overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_8px_20px_rgba(21,17,12,0.08)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="flex min-h-[90px] flex-col justify-center border-t border-black/10 px-6 py-4 lg:border-l lg:border-t-0 lg:first:border-l-0"
          >
            <p className="text-base font-semibold text-[#17120d]">
              {item.title}
            </p>

            <p className="mt-1 text-sm text-[#5f554a]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
