import Link from "next/link";
import { ElectronicsDealCard, type ElectronicsDealProduct } from "./electronics-deal-card";

export function ElectronicsBestSellers({
  title,
  viewAllLabel,
  products,
}: {
  title: string;
  viewAllLabel: string;
  products: ElectronicsDealProduct[];
}) {
  return (
    <section className="bg-white px-6 py-14">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[#0A2540] lg:text-[34px]">{title}</h2>
          <Link href="/bastsaljare" className="text-[14px] font-semibold text-[#2f7dff] hover:underline">{viewAllLabel} ›</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, idx) => (
            <ElectronicsDealCard key={p.id ?? `${p.title}-${idx}`} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
