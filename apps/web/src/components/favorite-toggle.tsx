"use client";

import { useState } from "react";

type FavoriteToggleProps = {
  productId: string;
  initialFavorited?: boolean;
  label?: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export function FavoriteToggle({
  productId,
  initialFavorited = false,
  label,
  className = "",
  activeClassName = "text-rose-500",
  inactiveClassName = "text-white/90",
}: FavoriteToggleProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function onToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (loading) return;

    setLoading(true);
    const previous = favorited;
    setFavorited(!previous);
    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        setFavorited(previous);
        return;
      }
      const data = (await response.json()) as { favorited?: boolean };
      setFavorited(Boolean(data.favorited));
    } catch {
      setFavorited(previous);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={favorited ? "Ta bort favorit" : "Lägg till favorit"}
      className={`${className} ${favorited ? activeClassName : inactiveClassName}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
      </svg>
      {label ? <span>{label}</span> : null}
    </button>
  );
}
