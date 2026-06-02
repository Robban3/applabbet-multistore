/** Menypost som pekar på kontakt ska alltid heta Kundservice och gå till /kundservice. */
export function normalizeNavLink<T extends { label: string; href: string }>(item: T): T {
  const label = item.label.trim();
  const href = item.href.trim();
  const labelLower = label.toLowerCase();
  const hrefLower = href.toLowerCase().replace(/\/$/, "") || href.toLowerCase();

  if (
    labelLower === "kontakt" ||
    hrefLower === "/kontakt" ||
    labelLower === "customer service" ||
    labelLower === "contact"
  ) {
    return { ...item, label: "Kundservice", href: "/kundservice" };
  }

  return { ...item, label: label || item.label, href: href || item.href };
}

export function normalizeNavLinks<T extends { label: string; href: string }>(items: T[]): T[] {
  return items.map(normalizeNavLink);
}
