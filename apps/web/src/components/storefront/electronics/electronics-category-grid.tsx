import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string; accent?: string };

export function ElectronicsCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="bg-[#F4F7FC] px-6 py-14">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-8 text-[28px] font-bold tracking-[-0.02em] text-[#0A2540] lg:text-[34px]">{title}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.title}
              href={category.href ?? `/products?category=${encodeURIComponent(category.title.toLowerCase())}`}
              className="group flex flex-col items-center rounded-[12px] border border-[#DCE6F5] bg-white p-5 text-center transition hover:border-[#2f7dff] hover:shadow-md"
            >
              <div className="relative aspect-square w-full">
                {category.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={category.imageUrl} alt={category.title} className="absolute inset-0 h-full w-full object-contain transition group-hover:scale-105" />
                ) : null}
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[#0A2540]">{category.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
