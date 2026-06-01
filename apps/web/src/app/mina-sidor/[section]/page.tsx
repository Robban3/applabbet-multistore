import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorTabShellContent, usesMinaSidorTabShell } from "@/lib/mina-sidor-shell";

type MinaSidorSectionPageProps = {
  params: Promise<{ section: string }>;
};

const sectionTitles: Record<string, string> = {
  ordrar: "Mina ordrar",
  returer: "Returer & reklamationer",
  favoriter: "Mina favoriter",
  adresser: "Mina adresser",
  betalningsmetoder: "Betalningsmetoder",
  profil: "Profiluppgifter",
  poang: "Mina poäng",
  notiser: "Notiser",
  "logga-ut": "Logga ut",
  leveranser: "Leveransöversikt",
};

const sectionRedirects: Record<string, string> = {
  ordrar: "/mina-sidor/ordrar",
  favoriter: "/mina-sidor/favoriter",
  adresser: "/mina-sidor/adresser",
  betalningsmetoder: "/mina-sidor/betalningsmetoder",
  profil: "/mina-sidor/profil",
  poang: "/mina-sidor/poang",
};

export default async function MinaSidorSectionPage({ params }: MinaSidorSectionPageProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/konto/login?next=/mina-sidor");

  const { section } = await params;
  if (section === "returer") {
    redirect("/returer-aterbetalningar?account=1");
  }

  const dedicatedRoute = sectionRedirects[section];
  if (dedicatedRoute) {
    redirect(dedicatedRoute);
  }

  const title = sectionTitles[section];
  if (!title) notFound();

  const accountCtx = await loadAccountContext();
  const placeholder = (
    <p className="text-sm text-slate-600">
      Placeholder-sida. Design och full funktionalitet läggs in när du skickar underlaget.
    </p>
  );

  if (usesMinaSidorTabShell(accountCtx)) {
    return (
      <MinaSidorTabShellContent ctx={accountCtx} title={title} subtitle={undefined}>
        {placeholder}
        <div className="mt-5">
          <Link
            href="/mina-sidor"
            className="inline-flex rounded-full border border-[#DCE6F5] bg-white px-4 py-2 text-sm font-semibold text-[#0A2540] hover:border-[#2f7dff]"
          >
            Tillbaka till översikt
          </Link>
        </div>
      </MinaSidorTabShellContent>
    );
  }

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <div className="px-6 py-8">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {placeholder}
            <div className="mt-5">
              <Link
                href="/mina-sidor"
                className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Tillbaka till översikt
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
