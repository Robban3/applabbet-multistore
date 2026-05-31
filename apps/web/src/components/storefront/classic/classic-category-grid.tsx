import Link from "next/link";

export type ClassicCategoryItem = {
  title: string;
  href?: string;
  accent?: string;
  imageUrl?: string;
};

export type ClassicCategoryGridProps = {
  title: string;
  categories: ClassicCategoryItem[];
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClassicCategoryGrid({ title, categories }: ClassicCategoryGridProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="mb-7 text-center">
        <h2 className="text-3xl font-semibold leading-none tracking-[-0.03em] text-[#17120d] sm:text-4xl lg:text-[46px]">
          {title}
        </h2>
        <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-[color:var(--store-accent)]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.slice(0, 6).map((category, index) => (
          <Link
            key={`${category.title}-${index}`}
            href={category.href || "/products"}
            className={`group relative min-h-[240px] overflow-hidden rounded-[18px] shadow-[0_10px_30px_rgba(31,24,18,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,24,18,0.20)]`}
            style={{
              background: category.imageUrl
                ? undefined
                : `linear-gradient(135deg, ${category.accent?.replace("from-", "") || "#2f251b"} 0%, #130f0b 100%)`,
            }}
          >
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,220,170,0.22),transparent_50%)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <p className="text-[15px] font-semibold leading-tight text-white">
                {category.title}
              </p>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition group-hover:bg-[color:var(--store-accent)] group-hover:border-[color:var(--store-accent)] group-hover:text-[#17120d]">
                <ArrowRightIcon />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
