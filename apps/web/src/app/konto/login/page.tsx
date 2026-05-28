import { CustomerAuthShell } from "@/components/customer-auth-shell";
import { CustomerLoginForm } from "@/components/customer-login-form";
import { getStoreBrandName } from "@/lib/store-brand";

type CustomerLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function CustomerLoginPage({ searchParams }: CustomerLoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next || "/mina-sidor";
  const brandName = await getStoreBrandName();

  return (
    <CustomerAuthShell
      topPrompt="Har du inget konto?"
      topCtaLabel="Registrera dig"
      topCtaHref={`/konto/skapa-konto?next=${encodeURIComponent(nextPath)}`}
      title="Logga in"
      subtitle="Välkommen tillbaka! Logga in för att fortsätta."
      brandName={brandName}
    >
      <CustomerLoginForm nextPath={nextPath} />
    </CustomerAuthShell>
  );
}
