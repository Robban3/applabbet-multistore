export type ClassicBrandStripProps = {
  title?: string;
  brands: string[];
};

export function ClassicBrandStrip({
  title = "Våra varumärken",
  brands,
}: ClassicBrandStripProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="rounded-[22px] border border-black/10 bg-white px-6 py-8 shadow-[0_10px_35px_rgba(31,24,18,0.08)]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">
          {title}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 text-center sm:grid-cols-4 lg:grid-cols-7">
          {brands.map((brand) => (
            <div
              key={brand}
              className="rounded-2xl border border-black/5 bg-[#faf8f5] px-4 py-5 text-sm font-semibold tracking-[0.12em] text-[#17120d]"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
