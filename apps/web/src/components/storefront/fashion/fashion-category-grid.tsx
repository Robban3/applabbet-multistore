import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string; accent?: string };

export function FashionCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="bg-[#FAF9F6] px-8 py-20 lg:px-14">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-[28px] font-light tracking-[-0.01em] text-[#1A1A1A] lg:text-[36px]">{title}</h2>
        <Link
          href="/products"
          className="text-[12px] tracking-[0.2em] uppercase text-[#1A1A1A] underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category) => (
          <Link
            key={category.title}
            href={category.href ?? `/products?category=${encodeURIComponent(category.title.toLowerCase())}`}
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-[#F5F1EA]"
          >
            {category.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.imageUrl}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />
            <div className="relative z-10 p-7">
              <p className="text-[22px] font-light tracking-[0.04em] text-[#FAF9F6] lg:text-[26px]">
                {category.title}
              </p>
              <p className="mt-2 text-[11px] tracking-[0.25em] uppercase text-[#FAF9F6]/85">
                Shop now →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
