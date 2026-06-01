import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string; accent?: string };

/**
 * Apple-stil "Utforska sortimentet": stora ljusgrå kort med centrerad text
 * överst + blå länkar, produktbild under. Rundade hörn.
 */
export function MinimalCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="bg-white px-6 py-16">
      <h2 className="mb-8 text-center text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[40px]">
        {title}
      </h2>
      <div className="mx-auto grid max-w-[1100px] gap-5 sm:grid-cols-2">
        {categories.slice(0, 4).map((category) => (
          <Link
            key={category.title}
            href={category.href ?? `/products?category=${encodeURIComponent(category.title.toLowerCase())}`}
            className="group relative flex flex-col items-center overflow-hidden rounded-[22px] bg-[#F5F5F7] pt-12 text-center transition hover:shadow-lg"
          >
            <h3 className="text-[26px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">{category.title}</h3>
            <p className="mt-2 text-[15px] text-[#0066CC] group-hover:underline">Handla nu ›</p>
            <div className="relative mt-6 aspect-[16/10] w-full">
              {category.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
