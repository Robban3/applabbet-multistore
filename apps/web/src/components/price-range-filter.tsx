"use client";

import { useMemo, useState } from "react";

type PriceRangeFilterProps = {
  minBound?: number;
  maxBound?: number;
  initialMin?: number;
  initialMax?: number;
};

export function PriceRangeFilter({
  minBound = 0,
  maxBound = 10000,
  initialMin,
  initialMax,
}: PriceRangeFilterProps) {
  const safeInitialMin = typeof initialMin === "number" ? Math.max(minBound, Math.min(initialMin, maxBound)) : minBound;
  const safeInitialMax = typeof initialMax === "number" ? Math.max(minBound, Math.min(initialMax, maxBound)) : maxBound;
  const [minValue, setMinValue] = useState(Math.min(safeInitialMin, safeInitialMax));
  const [maxValue, setMaxValue] = useState(Math.max(safeInitialMin, safeInitialMax));

  const leftPercent = useMemo(
    () => ((minValue - minBound) / Math.max(1, maxBound - minBound)) * 100,
    [minValue, minBound, maxBound],
  );
  const rightPercent = useMemo(
    () => ((maxValue - minBound) / Math.max(1, maxBound - minBound)) * 100,
    [maxValue, minBound, maxBound],
  );

  function onMinChange(next: number) {
    if (Number.isNaN(next)) return;
    setMinValue(Math.min(next, maxValue));
  }

  function onMaxChange(next: number) {
    if (Number.isNaN(next)) return;
    setMaxValue(Math.max(next, minValue));
  }

  return (
    <div className="space-y-3">
      <div className="relative h-7">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#d8c8b0]" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#c8a164]"
          style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />

        <input
          type="range"
          min={minBound}
          max={maxBound}
          step={100}
          value={minValue}
          onChange={(event) => onMinChange(Number(event.target.value))}
          className="pointer-events-none absolute left-0 top-1/2 z-20 h-7 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#b88f50] [&::-webkit-slider-thumb]:bg-[#c8a164] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[#b88f50] [&::-moz-range-thumb]:bg-[#c8a164]"
          aria-label="Min pris"
        />
        <input
          type="range"
          min={minBound}
          max={maxBound}
          step={100}
          value={maxValue}
          onChange={(event) => onMaxChange(Number(event.target.value))}
          className="pointer-events-none absolute left-0 top-1/2 z-20 h-7 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#b88f50] [&::-webkit-slider-thumb]:bg-[#c8a164] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[#b88f50] [&::-moz-range-thumb]:bg-[#c8a164]"
          aria-label="Max pris"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{minValue} kr</span>
        <span>{maxValue} kr</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min={minBound}
          max={maxValue}
          name="minPrice"
          value={minValue}
          onChange={(event) => onMinChange(Number(event.target.value))}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
        />
        <input
          type="number"
          min={minValue}
          max={maxBound}
          name="maxPrice"
          value={maxValue}
          onChange={(event) => onMaxChange(Number(event.target.value))}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
        />
      </div>
    </div>
  );
}
