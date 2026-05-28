"use client";

import { useMemo, useState } from "react";

type ProductDetailTabsProps = {
  labels: {
    description: string;
    specifications: string;
    shipping: string;
    reviews: string;
  };
  descriptionIntro: string;
  descriptionBullets: string[];
  specifications: string;
  shippingReturns: string;
  reviews: string;
};

type TabKey = "description" | "specifications" | "shipping" | "reviews";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

export function ProductDetailTabs({
  labels,
  descriptionIntro,
  descriptionBullets,
  specifications,
  shippingReturns,
  reviews,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const tabs = useMemo(
    () => [
      { key: "description" as const, label: labels.description },
      { key: "specifications" as const, label: labels.specifications },
      { key: "shipping" as const, label: labels.shipping },
      { key: "reviews" as const, label: labels.reviews },
    ],
    [labels],
  );

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-5 border-b border-slate-200 px-5 py-3 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key ? "border-b-2 border-slate-900 pb-1 font-semibold text-slate-900" : "text-slate-500"}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "description" ? (
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">Tidlös design. Exakt precision.</h2>
            <p className="mt-3 text-sm text-slate-700">{descriptionIntro}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {descriptionBullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-72 rounded-xl border border-slate-200 bg-gradient-to-br from-[#32271d] via-[#1a1510] to-[#0f0d0b]" />
        </div>
      ) : null}

      {activeTab === "specifications" ? (
        <div className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{specifications}</p>
        </div>
      ) : null}

      {activeTab === "shipping" ? (
        <div className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{shippingReturns}</p>
        </div>
      ) : null}

      {activeTab === "reviews" ? (
        <div className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{reviews}</p>
        </div>
      ) : null}
    </section>
  );
}
