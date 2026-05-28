export function formatMinorPrice(value: number, currency = "SEK", locale = "sv-SE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value / 100);
}
