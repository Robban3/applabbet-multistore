"use client";

import { useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AutoSubmitFilterFormProps = {
  action: string;
  className?: string;
  children: React.ReactNode;
  debounceMs?: number;
};

export function AutoSubmitFilterForm({
  action,
  className,
  children,
  debounceMs = 240,
}: AutoSubmitFilterFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  function navigateFromForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, rawValue] of formData.entries()) {
      const value = String(rawValue ?? "").trim();
      if (!value) continue;
      params.append(key, value);
    }

    const query = params.toString();
    const nextUrl = query ? `${action}?${query}` : action;
    const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (nextUrl === currentUrl || nextUrl === lastUrlRef.current) return;
    lastUrlRef.current = nextUrl;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  function submitDebounced(form: HTMLFormElement, delay = debounceMs) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      navigateFromForm(form);
    }, delay);
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const form = event.currentTarget;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    if (target instanceof HTMLInputElement) {
      if (target.type === "hidden" || target.type === "submit" || target.type === "button") return;
      if (target.type === "text" || target.type === "search") return;
      if (target.type === "range") {
        // Slightly longer debounce on sliders avoids jittery list refreshes while dragging.
        submitDebounced(form, 620);
        return;
      }
    }

    submitDebounced(form);
  }

  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const form = event.currentTarget;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    if (target instanceof HTMLInputElement) {
      if (target.type === "hidden" || target.type === "submit" || target.type === "button") return;
      if (target.type === "text" || target.type === "search") return;
    }

    submitDebounced(form);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateFromForm(event.currentTarget);
  }

  return (
    <form method="GET" action={action} className={className} onChange={handleChange} onInput={handleInput} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
