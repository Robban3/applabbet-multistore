import Link from "next/link";

export type ClassicProductGridItem = {
  id: string;
  name: string;
  href: string;
  imageUrl?: string;
  price?: string;
  badge?: string;
};

export type ClassicProductGridProps = {
  title: string;
  products: ClassicProductGridItem[];
};

export function ClassicProductGrid({ title, products }: ClassicProductGridProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">Utvalda produkter</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17120d] sm:text-4xl lg:text-[46px]">
            {title}
          </h2>
        </div>
        <Link href="/products" className="hidden text-sm font-semibold text-[#17120d] sm:inline-flex">
          Se alla produkter
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            href={product.href}
            className="group overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_10px_35px_rgba(31,24,18,0.08)] transition hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] bg-[#f3ede6]">
              {product.imageUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${product.imageUrl}')` }}
                />
              ) : null}
              {product.badge ? (
                <span className="absolute left-4 top-4 rounded-full bg-[#17120d] px-3 py-1 text-xs font-semibold text-white">
                  {product.badge}
                </span>
              ) : null}
            </div>

            <div className="p-5">
              <h3 className="line-clamp-2 text-base font-semibold text-[#17120d]">{product.name}</h3>
              {product.price ? (
                <p className="mt-3 text-lg font-semibold text-[#17120d]">{product.price}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
