import Link from "next/link";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { PriceRangeFilter } from "@/components/price-range-filter";

type CategoryOption = { id: string; slug: string; name: string };

export type CatalogFilterSidebarProps = {
  themeKey: string;
  actionPath: string;
  query: {
    q?: string;
    sort: string;
    categories: string[];
    brands: string[];
    features?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  categories: CategoryOption[];
  brands: string[];
  features?: string[];
  /** Skicka categories+slug eller categories+name. Sport/luxury använder slug, classic name. */
  categoryValueKey?: "slug" | "name";
  maxPriceBound?: number;
};

/**
 * Filter-sidebar i en tema-specifik look. Samma form/funktion överallt,
 * men presentationen följer referenssidan för temat:
 *  - sport:   Nike — vit/tunna avdelare, expand-rader, svart underrad-fokus
 *  - luxury:  Cartier/Net-a-Porter — minimal, serif, expanderbara sektioner
 *  - default: ren rounded box (tema-färger via CSS-variabler)
 */
export function CatalogFilterSidebar(props: CatalogFilterSidebarProps) {
  const { themeKey, actionPath, query, categories, brands, features = [], categoryValueKey = "slug", maxPriceBound = 10000 } = props;
  const hidden = (
    <>
      {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
      {query.sort !== "relevance" ? <input type="hidden" name="sort" value={query.sort} /> : null}
    </>
  );

  // ─── SPORT (Nike-stil) ───────────────────────────────────
  if (themeKey === "sport") {
    return (
      <aside className="lg:pr-2">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
          <p className="text-[15px] font-medium text-[#111]">Filter</p>
          <Link href={actionPath} className="text-[13px] text-[#757575] hover:text-[#111]">Rensa</Link>
        </div>
        <AutoSubmitFilterForm action={actionPath} className="divide-y divide-[#e5e5e5]">
          <FilterSection title="Kategori">
            {categories.map((cat) => (
              <NikeCheck key={cat.id} name="category" value={cat[categoryValueKey]} checked={query.categories.includes(cat[categoryValueKey])} label={cat.name} />
            ))}
            {categories.length === 0 ? <Empty /> : null}
          </FilterSection>
          {brands.length > 0 ? (
            <FilterSection title="Varumärke">
              {brands.map((b) => (
                <NikeCheck key={b} name="brand" value={b} checked={query.brands.includes(b)} label={b} />
              ))}
            </FilterSection>
          ) : null}
          <FilterSection title="Pris">
            <PriceRangeFilter minBound={0} maxBound={maxPriceBound} initialMin={query.minPrice} initialMax={query.maxPrice} />
          </FilterSection>
          {features.length > 0 ? (
            <FilterSection title="Egenskaper">
              {features.map((f) => (
                <NikeCheck key={f} name="feature" value={f} checked={(query.features || []).includes(f)} label={f} />
              ))}
            </FilterSection>
          ) : null}
          {hidden}
        </AutoSubmitFilterForm>
      </aside>
    );
  }

  // ─── LUXURY (Cartier/Net-a-Porter-stil) ──────────────────
  if (themeKey === "luxury") {
    return (
      <aside className="lg:pr-4">
        <p className="border-b border-[#EDE5DC] pb-3 text-[10px] font-light uppercase tracking-[0.4em] text-[#17120d]">Filtrera</p>
        <AutoSubmitFilterForm action={actionPath} className="divide-y divide-[#EDE5DC]">
          <LuxurySection title="Kategori">
            {categories.map((cat) => (
              <LuxuryCheck key={cat.id} name="category" value={cat[categoryValueKey]} checked={query.categories.includes(cat[categoryValueKey])} label={cat.name} />
            ))}
            {categories.length === 0 ? <Empty /> : null}
          </LuxurySection>
          {brands.length > 0 ? (
            <LuxurySection title="Maison">
              {brands.map((b) => (
                <LuxuryCheck key={b} name="brand" value={b} checked={query.brands.includes(b)} label={b} />
              ))}
            </LuxurySection>
          ) : null}
          <LuxurySection title="Pris">
            <PriceRangeFilter minBound={0} maxBound={maxPriceBound} initialMin={query.minPrice} initialMax={query.maxPrice} />
          </LuxurySection>
          {features.length > 0 ? (
            <LuxurySection title="Egenskaper">
              {features.map((f) => (
                <LuxuryCheck key={f} name="feature" value={f} checked={(query.features || []).includes(f)} label={f} />
              ))}
            </LuxurySection>
          ) : null}
          <div className="pt-5">
            <Link href={actionPath} className="text-[10px] tracking-[0.3em] uppercase text-[#C41E3A] hover:underline">Återställ alla</Link>
          </div>
          {hidden}
        </AutoSubmitFilterForm>
      </aside>
    );
  }

  // ─── DEFAULT (classic/fashion/beauty/electronics/minimal) ─
  // Kort med accent-färg från CSS-variabel — följer respektive tema automatiskt.
  return (
    <aside className="rounded-xl border bg-[color:var(--store-soft-surface)] p-5" style={{ borderColor: "var(--store-card-border)" }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filter</h2>
        <Link href={actionPath} className="text-xs text-slate-500 hover:text-slate-700">Rensa alla</Link>
      </div>
      <AutoSubmitFilterForm action={actionPath} className="space-y-6 text-sm">
        <DefaultSection title="Kategori">
          {categories.map((cat) => (
            <DefaultCheck key={cat.id} name="category" value={cat[categoryValueKey]} checked={query.categories.includes(cat[categoryValueKey])} label={cat.name} />
          ))}
          {categories.length === 0 ? <Empty /> : null}
        </DefaultSection>
        {brands.length > 0 ? (
          <DefaultSection title="Varumärke">
            {brands.map((b) => (
              <DefaultCheck key={b} name="brand" value={b} checked={query.brands.includes(b)} label={b} />
            ))}
          </DefaultSection>
        ) : null}
        <DefaultSection title="Pris">
          <PriceRangeFilter minBound={0} maxBound={maxPriceBound} initialMin={query.minPrice} initialMax={query.maxPrice} />
        </DefaultSection>
        {features.length > 0 ? (
          <DefaultSection title="Egenskaper">
            {features.map((f) => (
              <DefaultCheck key={f} name="feature" value={f} checked={(query.features || []).includes(f)} label={f} />
            ))}
          </DefaultSection>
        ) : null}
        {hidden}
      </AutoSubmitFilterForm>
    </aside>
  );
}

// ── Sport (Nike) primitives ──────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-[#111]">
        {title}
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="mt-3 space-y-2">{children}</div>
    </details>
  );
}
function NikeCheck({ name, value, checked, label }: { name: string; value: string; checked: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-[14px] text-[#111]">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} className="h-4 w-4 cursor-pointer accent-[#111]" />
      <span className="select-none">{label}</span>
    </label>
  );
}

// ── Luxury (Cartier) primitives ──────────────────────────
function LuxurySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-light uppercase tracking-[0.3em] text-[#17120d]">
        {title}
        <span className="text-[#C41E3A] transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4 space-y-2.5">{children}</div>
    </details>
  );
}
function LuxuryCheck({ name, value, checked, label }: { name: string; value: string; checked: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[12px] font-light tracking-[0.04em] text-[#5f4a3a] hover:text-[#17120d]">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} className="h-3 w-3 cursor-pointer rounded-none accent-[#C41E3A]" />
      <span className="select-none">{label}</span>
    </label>
  );
}

// ── Default primitives ───────────────────────────────────
function DefaultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function DefaultCheck({ name, value, checked, label }: { name: string; value: string; checked: boolean; label: string }) {
  return (
    <label className="flex items-center gap-2 text-slate-700">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} className="accent-[color:var(--store-accent)]" />
      <span>{label}</span>
    </label>
  );
}

function Empty() {
  return <p className="text-xs text-slate-500">Inga val tillgängliga ännu.</p>;
}
