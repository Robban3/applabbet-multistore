export function FashionBrands({ title, brands }: { title: string; brands: string[] }) {
  return (
    <section className="bg-[#FAF9F6] px-8 py-16 lg:px-14">
      <div className="border-t border-[#E5E1DC] pt-12">
        <p className="text-center text-[11px] tracking-[0.3em] uppercase text-[#1A1A1A]/55">{title}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-12">
          {brands.map((b) => (
            <span key={b} className="text-[16px] tracking-[0.3em] uppercase text-[#1A1A1A]/35 transition hover:text-[#1A1A1A]">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
