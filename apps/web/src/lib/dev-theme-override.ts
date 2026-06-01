// Server-only: läser "dev_theme"-cookien så DevThemeSwitcher kan byta
// hela det server-renderade temat på utvecklingstenanten.
// Filen ska INTE importeras från klient-komponenter — den drar in next/headers.
import { cookies } from "next/headers";
import type { StorefrontThemeKey } from "@/lib/themes/types";

const VALID_THEME_KEYS = new Set([
  "classic",
  "luxury",
  "minimal",
  "fashion",
  "sport",
  "beauty",
  "electronics",
]);

export async function readDevThemeOverride(): Promise<StorefrontThemeKey | null> {
  try {
    const store = await cookies();
    const value = store.get("dev_theme")?.value?.trim().toLowerCase();
    if (value && VALID_THEME_KEYS.has(value)) {
      return value as StorefrontThemeKey;
    }
  } catch {
    // cookies() ej tillgänglig i denna kontext — ignorera
  }
  return null;
}
