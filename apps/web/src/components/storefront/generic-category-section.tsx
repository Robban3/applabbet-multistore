import Link from "next/link";

type CategoryCard = {
  title: string;
  accent?: string;
  href?: string;
};

type GenericCategorySectionProps = {
  title: string;
  categories: CategoryCard[];
  isElectronics: boolean;
  isBeauty: boolean;
  isSport: boolean;
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function GenericCategorySection({ title, categories, isElectronics, isBeauty, isSport }: GenericCategorySectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-5">
      <h2 className={`${isElectronics ? "text-left text-2xl lg:text-3xl" : isBeauty ? "text-center text-[46px] sm:text-[52px]" : "text-center text-3xl sm:text-4xl lg:text-[44px]"} font-semibold leading-none`}>
        {title}
      </h2>
      <div className={`${isElectronics ? "mt-3 mb-4" : "mx-auto mt-4 mb-6"} h-[2px] w-24 rounded-full bg-[color:var(--store-accent)]`} />
      <div className={`grid gap-3 sm:grid-cols-2 ${isElectronics ? "lg:grid-cols-8" : isBeauty ? "lg:grid-cols-5" : isSport ? "lg:grid-cols-5" : "lg:grid-cols-6"}`}>
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href || "/products"}
            className={`group relative block overflow-hidden rounded-[14px] border p-4 shadow-sm ${
              isElectronics
                ? "border-[#d6e4fb] bg-white text-slate-900"
                : isBeauty
                  ? "border-[#ecd4dd] bg-[#fff5f8] text-slate-900"
                  : isSport
                    ? "border-[#cad7be] bg-gradient-to-br from-[#28382d] via-[#1a251e] to-[#0e1511] text-white"
                    : `border-[#d8cec2] bg-gradient-to-br ${category.accent} via-[#211912] to-[#130f0b] text-white`
            }`}
          >
            {isElectronics || isBeauty ? (
              <>
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md ${isBeauty ? "bg-[#f8e6ee]" : "bg-[color:var(--store-soft-surface)]"}`}>
                  <span className="h-4 w-4 rounded-full bg-[color:var(--store-accent)]" />
                </div>
                <p className="line-clamp-2 text-sm font-semibold">{category.title.toUpperCase()}</p>
                {isBeauty ? <p className="mt-1 text-xs text-slate-600">Se alla produkter</p> : null}
              </>
            ) : isSport ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(190,255,41,0.16),transparent_45%)] opacity-85" />
                <p className="relative mt-24 text-lg font-semibold">{category.title.toUpperCase()}</p>
                <p className="relative mt-1 text-xs text-white/80">Se hela sortimentet</p>
                <span className="relative mt-2 inline-flex text-sm text-[#d0ff43]"><ArrowRightIcon /></span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,194,123,0.35),transparent_45%)] opacity-70" />
                <p className="relative mt-24 text-lg font-semibold">{category.title}</p>
                <span className="relative mt-2 inline-flex text-sm text-white/90"><ArrowRightIcon /></span>
              </>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
