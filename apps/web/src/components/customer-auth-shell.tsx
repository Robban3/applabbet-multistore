import Link from "next/link";
import type { ReactNode } from "react";

type CustomerAuthShellProps = {
  topPrompt: string;
  topCtaLabel: string;
  topCtaHref: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  rightPanel?: ReactNode;
  brandName?: string;
};

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 text-[#c8a164]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M16 3 28 9v14L16 29 4 23V9l12-6Z" />
      <path d="m11 16 3 3 7-8" />
    </svg>
  );
}

function PillIcon({ kind }: { kind: "lock" | "bag" | "heart" | "truck" }) {
  if (kind === "lock") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      </svg>
    );
  }
  if (kind === "bag") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20.7 4.7 13.9a4.6 4.6 0 0 1 6.5-6.5L12 8.2l.8-.8a4.6 4.6 0 0 1 6.5 6.5L12 20.7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 8h13v8H2z" />
      <path d="M15 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.4" />
      <circle cx="18" cy="18" r="1.4" />
    </svg>
  );
}

export function CustomerAuthShell({
  topPrompt,
  topCtaLabel,
  topCtaHref,
  title,
  subtitle,
  children,
  rightPanel,
  brandName = "APPLABBET",
}: CustomerAuthShellProps) {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#f5f1ea] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1280px] overflow-hidden rounded-[24px] border border-[#e3ddd3] bg-white shadow-[0_14px_40px_rgba(31,24,16,0.08)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e3d9] px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandMark />
            <span className="text-[34px] font-semibold tracking-[0.34em] text-slate-900">{brandName.toUpperCase()}</span>
          </Link>
          <p className="text-sm text-slate-700">
            {topPrompt}{" "}
            <Link href={topCtaHref} className="font-semibold text-slate-900 underline-offset-2 hover:underline">
              {topCtaLabel}
            </Link>
          </p>
        </header>

        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          <div className="bg-[#faf9f7] px-6 py-8 sm:px-10">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950">{title}</h1>
            <p className="mt-2 text-lg text-slate-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>

          {rightPanel ? (
            <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#f7eed9] via-[#f3e8d2] to-[#ead9b6] p-10 lg:block">
              <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-white/30 blur-2xl" />
              <div className="pointer-events-none absolute bottom-[-120px] left-[-80px] h-72 w-72 rounded-full bg-white/35 blur-2xl" />
              {rightPanel}
            </aside>
          ) : (
            <aside className="relative hidden overflow-hidden bg-[url('/images/login-right-panel.png')] bg-cover bg-center p-10 lg:block">
              <div className="pointer-events-none absolute inset-0 bg-[#efe1c6]/72" />
              <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-white/30 blur-2xl" />
              <div className="pointer-events-none absolute bottom-[-120px] left-[-80px] h-72 w-72 rounded-full bg-white/35 blur-2xl" />
              <div className="relative z-10">
                <p className="inline-flex rounded-full border border-[#d8c28f] bg-white/40 p-2 text-[#a8842f]">
                  <PillIcon kind="lock" />
                </p>
                <h2 className="mt-4 text-6xl font-semibold leading-[1.05] tracking-tight text-slate-950">
                  Din shopping.
                  <br />
                  Enkelt och säkert.
                </h2>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-800">
                  <article className="rounded-xl bg-white/55 p-3 text-center">
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd0bd] bg-white/65">
                      <PillIcon kind="lock" />
                    </span>
                    <p className="mt-2 font-semibold">Säker inloggning</p>
                  </article>
                  <article className="rounded-xl bg-white/55 p-3 text-center">
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd0bd] bg-white/65">
                      <PillIcon kind="bag" />
                    </span>
                    <p className="mt-2 font-semibold">Snabb checkout</p>
                  </article>
                  <article className="rounded-xl bg-white/55 p-3 text-center">
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd0bd] bg-white/65">
                      <PillIcon kind="heart" />
                    </span>
                    <p className="mt-2 font-semibold">Favoriter & ordrar</p>
                  </article>
                  <article className="rounded-xl bg-white/55 p-3 text-center">
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd0bd] bg-white/65">
                      <PillIcon kind="truck" />
                    </span>
                    <p className="mt-2 font-semibold">Personliga erbjudanden</p>
                  </article>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
