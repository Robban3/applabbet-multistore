import Link from "next/link";

export type ClassicBrandsProps = {
  title: string;
  brands: string[];
};

export function ClassicBrands({
  title,
  brands,
}: ClassicBrandsProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="rounded-[22px] border border-black/10 bg-white p-8 shadow-[0_10px_30px_rgba(31,24,18,0.08)]">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">
            Varumärken
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17120d] sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand}
              href="/products"
              className="flex h-20 items-center justify-center rounded-xl border border-black/10 bg-[#faf7f2] text-sm font-semibold text-[#17120d] transition hover:bg-white hover:shadow-md"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}