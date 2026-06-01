export function LuxuryBrands({ title, brands }: { title: string; brands: string[] }) {
  return (
    <section className="w-full px-8 pb-16 sm:px-12 lg:px-14">
      <div className="border border-[#EDE5DC] px-10 py-12">
        <p className="text-center text-[10px] font-light tracking-[0.5em] uppercase text-[#5f4a3a]">
          {title}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
          {brands.map((brand) => (
            <span key={brand} className="text-[13px] font-light tracking-[0.3em] uppercase text-[#17120d]/50 transition hover:text-[#17120d]">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
