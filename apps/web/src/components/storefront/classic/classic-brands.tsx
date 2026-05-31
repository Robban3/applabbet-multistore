export type ClassicBrandsProps = {
  title: string;
  brands: string[];
};

export function ClassicBrands({ title, brands }: ClassicBrandsProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-2 pb-8 sm:px-5">
      <div className="overflow-hidden rounded-[22px] bg-[#0f0d0a] px-8 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.22)]">
        <p className="text-center text-[13px] text-white/55">{title}</p>

        <div className="mt-7 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center justify-center">
              <span className="text-xl font-bold tracking-[0.06em] text-white/80 transition hover:text-white">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
