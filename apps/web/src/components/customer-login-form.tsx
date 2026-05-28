"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function normalizeNextPath(nextPath: string): string {
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) return "/mina-sidor";
  return nextPath;
}

type CustomerLoginFormProps = {
  nextPath: string;
};

export function CustomerLoginForm({ nextPath }: CustomerLoginFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message || "Inloggning misslyckades.");
      return;
    }

    router.replace(normalizeNextPath(nextPath));
    router.refresh();
  }

  function handleSocialClick(providerName: string) {
    setInfoMessage(`${providerName}-inloggning kopplas in i nästa steg.`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="customer-email" className="mb-1 block text-sm font-medium text-slate-700">
          E-postadress
        </label>
        <input
          id="customer-email"
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
        <label htmlFor="customer-password" className="mb-1 block text-sm font-medium text-slate-700">
          Lösenord
        </label>
        <div className="relative">
          <input
            id="customer-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Ange ditt lösenord"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 pr-10 text-sm text-slate-900 outline-none focus:border-slate-400"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
              <circle cx="12" cy="12" r="2.6" />
            </svg>
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <Link
            href={`/konto/glomt-losenord?next=${encodeURIComponent(normalizeNextPath(nextPath))}`}
            className="text-sm text-slate-700 underline-offset-2 hover:underline"
          >
            Glömt ditt lösenord?
          </Link>
        </div>
      </div>

      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
      {infoMessage ? <p className="text-sm text-emerald-700">{infoMessage}</p> : null}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Loggar in..." : "Logga in"}
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#c8a164] focus:ring-[#c8a164]"
            />
            Kom ihåg mig
          </label>
          <Link href="/kundservice" className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
            Hjälp
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="text-sm text-slate-700">
          Har du inget konto?{" "}
          <Link
            href={`/konto/skapa-konto?next=${encodeURIComponent(normalizeNextPath(nextPath))}`}
            className="font-semibold text-slate-900 underline-offset-2 hover:underline"
          >
            Registrera dig
          </Link>
        </div>
      </div>
    </form>
  );
}
