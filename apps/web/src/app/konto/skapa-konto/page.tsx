import Link from "next/link";
import { CustomerAuthShell } from "@/components/customer-auth-shell";
import { CustomerRegisterForm } from "@/components/customer-register-form";
import { getStoreBrandName } from "@/lib/store-brand";

type CustomerRegisterPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function UserCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#c8a164]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c1.8-3.2 4.6-4.8 8-4.8s6.2 1.6 8 4.8" />
    </svg>
  );
}

function FeatureIcon({ kind }: { kind: "lock" | "heart" | "box" | "tag" }) {
  const cls = "h-6 w-6 text-[#c8a164]";
  if (kind === "lock") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      </svg>
    );
  }
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 20.7 4.7 13.9a4.6 4.6 0 0 1 6.5-6.5L12 8.2l.8-.8a4.6 4.6 0 0 1 6.5 6.5L12 20.7Z" />
      </svg>
    );
  }
  if (kind === "box") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M21 8V21H3V8" />
        <path d="M1 3h22v5H1z" />
        <path d="M10 12h4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}

function RegisterRightPanel({ brandName }: { brandName: string }) {
  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute inset-[-2.5rem] bg-[url('/images/register-right-panel.png')] bg-cover bg-center" />
      <div className="pointer-events-none absolute inset-[-2.5rem] bg-[#efe1c6]/62" />

      <div className="relative z-10">
        <div className="flex justify-center">
          <span className="inline-flex rounded-full border border-[#d8c28f] bg-white/40 p-3">
            <UserCircleIcon />
          </span>
        </div>
        <h2 className="mt-5 text-center text-5xl font-semibold leading-[1.08] tracking-tight text-slate-950">
          Bli en del av {brandName.toUpperCase()}
        </h2>
        <p className="mt-2 text-center text-lg text-slate-700">
          Skapa ett konto och få en bättre shoppingupplevelse.
        </p>

        <div className="mt-8 space-y-5">
          <div className="flex items-start gap-4">
            <span className="inline-flex shrink-0 rounded-xl bg-white/50 p-2.5">
              <FeatureIcon kind="lock" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Snabb och säker checkout</p>
              <p className="text-sm text-slate-700">Spara dina uppgifter och handla snabbare nästa gång.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="inline-flex shrink-0 rounded-xl bg-white/50 p-2.5">
              <FeatureIcon kind="heart" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Spara favoriter</p>
              <p className="text-sm text-slate-700">Spara dina favoritprodukter och hitta dem enkelt igen.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="inline-flex shrink-0 rounded-xl bg-white/50 p-2.5">
              <FeatureIcon kind="box" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Håll koll på dina ordrar</p>
              <p className="text-sm text-slate-700">Följ dina beställningar och leveranser i realtid.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="inline-flex shrink-0 rounded-xl bg-white/50 p-2.5">
              <FeatureIcon kind="tag" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Exklusiva erbjudanden</p>
              <p className="text-sm text-slate-700">Få tillgång till unika erbjudanden, kampanjer och nyheter.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#2f7d4f]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
                <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900">Dina uppgifter är trygga med oss</p>
                <p className="text-sm text-slate-600">Vi behandlar dina uppgifter i enlighet med vår integritetspolicy.</p>
              </div>
            </div>
            <Link href="/integritetspolicy" aria-label="Läs integritetspolicy" className="shrink-0 text-slate-600 hover:text-slate-900">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CustomerRegisterPage({ searchParams }: CustomerRegisterPageProps) {
  const { next } = await searchParams;
  const nextPath = next || "/mina-sidor";
  const brandName = await getStoreBrandName();

  return (
    <CustomerAuthShell
      topPrompt="Har du redan konto?"
      topCtaLabel="Logga in"
      topCtaHref={`/konto/login?next=${encodeURIComponent(nextPath)}`}
      title="Registrera dig"
      subtitle="Skapa ett konto och få tillgång till en enklare, snabbare och mer personlig shoppingupplevelse."
      rightPanel={<RegisterRightPanel brandName={brandName} />}
      brandName={brandName}
    >
      <CustomerRegisterForm nextPath={nextPath} brandName={brandName} />
    </CustomerAuthShell>
  );
}
