import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string; accent?: string };

export function SportCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="w-full bg-white px-6 py-14 lg:px-10">
      <h2 className="mb-6 text-[22px] font-medium text-[#111] lg:text-[26px]">{title}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category, index) => (
          <Link
            key={category.title}
            href={category.href ?? `/products?category=${encodeURIComponent(category.title.toLowerCase())}`}
            className="group relative flex aspect-[4/5] items-end overflow-hidden bg-[#111]"
          >
            {category.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.imageUrl}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: index % 3 === 0 ? "linear-gradient(135deg,#1a2113,#0a0f08)" : index % 3 === 1 ? "linear-gradient(135deg,#222,#0a0a0a)" : "linear-gradient(135deg,#15301a,#0a0f08)" }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <div className="relative z-10 p-6">
              <p className="text-[24px] font-black uppercase leading-none tracking-[-0.02em] text-white drop-shadow lg:text-[28px]">
                {category.title}
              </p>
              <span className="mt-3 inline-flex h-10 items-center rounded-full bg-white px-5 text-[13px] font-medium text-black">
                Shoppa
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
