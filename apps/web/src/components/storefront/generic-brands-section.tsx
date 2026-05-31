type GenericBrandsSectionProps = {
  title: string;
  brands: string[];
  isBeauty: boolean;
  isSport: boolean;
};

export function GenericBrandsSection({ title, brands, isBeauty, isSport }: GenericBrandsSectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
      <div
        className="rounded-[14px] border px-6 py-6 shadow-lg"
        style={{
          background: isBeauty ? "#fff5f8" : isSport ? "#0b0d0b" : "var(--store-footer-surface)",
          borderColor: isBeauty ? "#ecd4dd" : isSport ? "#1c251d" : "transparent",
          color: isBeauty ? "#0f172a" : "white",
        }}
      >
        <p className={`mb-4 text-center text-sm ${isBeauty ? "text-slate-700" : "text-white/70"}`}>{title}</p>
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 lg:grid-cols-7">
          {brands.map((brand) => (
            <p key={brand} className={`text-2xl tracking-[0.12em] ${isBeauty ? "text-slate-800" : "text-white/85"}`}>
              {brand}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
