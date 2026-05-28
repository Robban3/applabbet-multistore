import Link from "next/link";
import { CustomerForgotPasswordForm } from "@/components/customer-forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Återställ lösenord</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.
        </p>
        <div className="mt-5">
          <CustomerForgotPasswordForm />
        </div>
        <div className="mt-4">
          <Link href="/konto/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Tillbaka till inloggning
          </Link>
        </div>
      </section>
    </main>
  );
}
