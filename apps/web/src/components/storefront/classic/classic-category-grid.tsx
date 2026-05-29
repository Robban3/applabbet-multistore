import Link from "next/link";

export type ClassicCategoryItem = {
  title: string;
  href?: string;
  accent?: string;
};

export type ClassicCategoryGridProps = {
  title: string;
  categories: ClassicCategoryItem[];
};

export function ClassicCategoryGrid({ title, categories }: ClassicCategoryGridProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">Shoppa efter kategori</p>
          <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.03em] text-[#17120d] sm:text-4xl lg:text-[46px]">
            {title}
          </h2>
        </div>
        <Link href="/products" className="hidden text-sm font-semibold text-[#17120d] hover:text-[#000000] sm:inline-flex">
          Se alla
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category, index) => (
          <Link
            key={`${category.title}-${index}`}
            href={category.href || "/products"}
            className={`group relative min-h-[230px] overflow-hidden rounded-[22px] border border-black/10 bg-gradient-to-br ${category.accent || "from-[#2f251b]"} via-[#211912] to-[#130f0b] p-6 text-white shadow-[0_14px_40px_rgba(31,24,18,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(31,24,18,0.18)]`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,220,170,0.28),transparent_42%)] opacity-80 transition group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="relative flex h-full flex-col justify-end">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">Kategori</p>
              <p className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.03em]">{category.title}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-white/90">Utforska</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
