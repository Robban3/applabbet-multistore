export function toPublicCustomerId(userId: string): string {
  const compact = userId.replace(/-/g, "").toUpperCase();
  return `KUND-${compact.slice(0, 8)}`;
}
