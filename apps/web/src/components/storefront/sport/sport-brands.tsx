export function SportBrands({ title, brands }: { title: string; brands: string[] }) {
  return (
    <section className="w-full border-t border-[#e5e5e5] bg-white px-6 py-12 lg:px-10">
      <p className="mb-8 text-center text-[12px] font-medium tracking-[0.1em] uppercase text-[#757575]">{title}</p>
      <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
        {brands.map((brand) => (
          <span
            key={brand}
            className="text-[15px] font-black uppercase tracking-[0.12em] text-[#111]/30 transition hover:text-[#111]/70"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
