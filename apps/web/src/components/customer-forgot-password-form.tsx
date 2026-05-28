"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function CustomerForgotPasswordForm() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const redirectTo =
      typeof window === "undefined" ? undefined : `${window.location.origin}/konto/login`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message || "Kunde inte skicka återställningslänk.");
      return;
    }

    setMessage("Vi har skickat en återställningslänk till din e-postadress.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="forgot-password-email" className="mb-1 block text-sm font-medium text-slate-700">
          E-postadress
        </label>
        <input
          id="forgot-password-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          placeholder="Ange din e-postadress"
          required
        />
      </div>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Skickar..." : "Skicka återställningslänk"}
      </button>
    </form>
  );
}
