import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string; accent?: string };

/**
 * Apple.com-stil tiles: stora rutor med rubrik överst, två blå länkar
 * (Läs mer › / Köp ›) och en centrerad produkt-/kategori-ikon under.
 */
export function MinimalCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="mb-8 text-center text-[32px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[40px]">
        {title}
      </h2>
      <div className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-2">
        {categories.slice(0, 4).map((category) => {
          const href =
            category.href ?? `/products?category=${encodeURIComponent(category.title.toLowerCase())}`;
          return (
            <article
              key={category.title}
              className="group flex flex-col items-center overflow-hidden rounded-[18px] bg-[#F5F5F7] px-6 pt-12 pb-2 text-center"
            >
              <h3 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[32px]">
                {category.title}
              </h3>
              <div className="mt-2 flex items-center justify-center gap-5 text-[15px] text-[#0066CC]">
                <Link href={href} className="hover:underline">
                  Läs mer ›
                </Link>
                <Link href={href} className="hover:underline">
                  Köp ›
                </Link>
              </div>
              <Link href={href} className="relative mt-6 block aspect-[16/10] w-full">
                {category.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.imageUrl}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
