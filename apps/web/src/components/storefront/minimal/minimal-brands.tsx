export function MinimalBrands({ title, brands }: { title: string; brands: string[] }) {
  return (
    <section className="bg-[#F5F5F7] px-6 py-16 text-center">
      <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[36px]">{title}</h2>
      <div className="mx-auto mt-10 flex max-w-[900px] flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {brands.map((b) => (
          <span key={b} className="text-[17px] font-semibold tracking-[0.08em] text-[#1D1D1F]/30 transition hover:text-[#1D1D1F]/70">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
