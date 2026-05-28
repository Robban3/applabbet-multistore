"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function normalizeNextPath(nextPath: string): string {
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) return "/mina-sidor";
  return nextPath;
}

function toBrandGenitive(brandName: string): string {
  const trimmed = brandName.trim();
  if (!trimmed) return "APPLABBETs";
  return /s$/i.test(trimmed) ? trimmed : `${trimmed}s`;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

type CustomerRegisterFormProps = {
  nextPath: string;
  brandName: string;
};

export function CustomerRegisterForm({ nextPath, brandName }: CustomerRegisterFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    if (!acceptTerms) {
      setErrorMessage("Du måste godkänna villkoren för att skapa ett konto.");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Lösenorden matchar inte.");
      setSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Lösenordet måste vara minst 8 tecken.");
      setSubmitting(false);
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || undefined,
        },
      },
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message || "Kunde inte skapa konto.");
      return;
    }

    const signInResult = await supabase.auth.signInWithPassword({ email, password });
    if (signInResult.error) {
      setErrorMessage("Konto skapat. Kontrollera e-postverifiering och logga in igen.");
      return;
    }

    router.replace(normalizeNextPath(nextPath));
    router.refresh();
  }

  function handleSocialClick(providerName: string) {
    setInfoMessage(`${providerName}-registrering kopplas in i nästa steg.`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="register-first-name" className="mb-1 block text-sm font-medium text-slate-700">
          Förnamn
        </label>
        <input
          id="register-first-name"
          placeholder="Ange ditt förnamn"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          required
        />
      </div>

      <div>
        <label htmlFor="register-last-name" className="mb-1 block text-sm font-medium text-slate-700">
          Efternamn
        </label>
        <input
          id="register-last-name"
          placeholder="Ange ditt efternamn"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          required
        />
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-slate-700">
          E-postadress
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="Ange din e-postadress"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          required
        />
      </div>

      <div>
        <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-slate-700">
          Lösenord
        </label>
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Skapa ett lösenord"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 pr-10 text-sm text-slate-900 outline-none focus:border-slate-400"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
            onClick={() => setShowPassword((c) => !c)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            <EyeIcon />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Minst 8 tecken med bokstäver och siffror</p>
      </div>

      <div>
        <label htmlFor="register-confirm-password" className="mb-1 block text-sm font-medium text-slate-700">
          Bekräfta lösenord
        </label>
        <div className="relative">
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Upprepa ditt lösenord"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 pr-10 text-sm text-slate-900 outline-none focus:border-slate-400"
            required
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Dölj lösenord" : "Visa lösenord"}
            onClick={() => setShowConfirmPassword((c) => !c)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(event) => setAcceptTerms(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
          />
          <span>
            Jag godkänner {toBrandGenitive(brandName)}{" "}
            <Link href="/villkor" className="font-medium underline underline-offset-2">villkor</Link>
            {" "}och{" "}
            <Link href="/integritetspolicy" className="font-medium underline underline-offset-2">integritetspolicy</Link>.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(event) => setNewsletter(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#c8a164] accent-[#c8a164]"
          />
          <span>
            Jag vill ta del av nyheter, erbjudanden och inspiration via e-post och SMS. Du kan när som helst avregistrera dig.
          </span>
        </label>
      </div>

      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
      {infoMessage ? <p className="text-sm text-emerald-700">{infoMessage}</p> : null}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4 20c1.8-3.2 4.6-4.8 8-4.8s6.2 1.6 8 4.8" />
          </svg>
          {submitting ? "Skapar konto..." : "Skapa konto"}
        </button>

        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          Eller fortsätt med
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleSocialClick("Google")}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialClick("Apple")}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Apple
          </button>
          <button
            type="button"
            onClick={() => handleSocialClick("Facebook")}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Facebook
          </button>
        </div>

        <p className="text-sm text-slate-700">
          Har du redan ett konto?{" "}
          <Link
            href={`/konto/login?next=${encodeURIComponent(normalizeNextPath(nextPath))}`}
            className="font-semibold text-slate-900 underline-offset-2 hover:underline"
          >
            Logga in
          </Link>
        </p>
      </div>
    </form>
  );
}
