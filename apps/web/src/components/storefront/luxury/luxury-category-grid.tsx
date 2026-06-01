import Link from "next/link";

type CategoryItem = { title: string; href?: string; imageUrl?: string; accent?: string };

export function LuxuryCategoryGrid({ title, categories }: { title: string; categories: CategoryItem[] }) {
  return (
    <section className="w-full px-8 py-16 sm:px-12 lg:px-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">Collections</p>
          <h2 className="mt-3 text-3xl font-light tracking-[-0.02em] text-[#17120d] lg:text-4xl">{title}</h2>
        </div>
        <Link href="/products" className="text-[10px] font-light tracking-[0.3em] uppercase text-[#5f4a3a] transition hover:text-[#C41E3A]">
          Visa alla →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category, index) => (
          <Link
            key={`${category.title}-${index}`}
            href={category.href || "/products"}
            className="group relative overflow-hidden"
            style={{ aspectRatio: index < 2 ? "3/2" : "4/3" }}
          >
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#1a1208] to-[#0c0906]"
                style={{ background: `linear-gradient(135deg, ${category.accent?.replace("from-[","").replace("]","") || "#1a1208"} 0%, #0c0906 100%)` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(184,150,62,0.10),transparent_50%)]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-[10px] font-light tracking-[0.4em] uppercase text-white/50">Collection</p>
              <p className="mt-1 text-lg font-light tracking-[0.05em] text-white">{category.title}</p>
              <div className="mt-3 h-px w-0 bg-[#C41E3A] transition-all duration-500 group-hover:w-8" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
