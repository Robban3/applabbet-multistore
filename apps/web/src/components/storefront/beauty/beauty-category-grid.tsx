import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string };

/**
 * KICKS.se-stil kategorier: runda bild-"bubblor" med etikett under, i en rad.
 */
export function BeautyCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-[1320px]">
        <h2 className="mb-8 text-center text-[26px] font-extrabold uppercase tracking-[-0.01em] text-[#1A1A1A] lg:text-[32px]">
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:gap-6">
          {categories.slice(0, 5).map((category) => {
            const href =
              category.href ?? `/products?category=${encodeURIComponent(category.title.toLowerCase())}`;
            return (
              <Link key={category.title} href={href} className="group flex flex-col items-center gap-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-full border border-[#ECECEC] bg-[#FBE9F2]">
                  {category.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.imageUrl}
                      alt={category.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                    />
                  ) : null}
                </div>
                <span className="text-center text-[14px] font-semibold uppercase tracking-[0.02em] text-[#1A1A1A] group-hover:text-[#EC008C]">
                  {category.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
