"use client";

import { useMemo, useState } from "react";

type ProductGalleryOrderEditorProps = {
  name: string;
  initialUrls?: string[] | null;
  labelClassName?: string;
};

function normalizeUrls(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function ProductGalleryOrderEditor({
  name,
  initialUrls,
  labelClassName = "mb-1 block text-sm font-medium text-slate-700",
}: ProductGalleryOrderEditorProps) {
  const normalizedInitialUrls = useMemo(
    () => normalizeUrls(initialUrls || []),
    [initialUrls],
  );
  const [urls, setUrls] = useState<string[]>(normalizedInitialUrls);
  const [pendingUrl, setPendingUrl] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const serialized = useMemo(() => urls.join("\n"), [urls]);

  function addUrl() {
    const normalized = pendingUrl.trim();
    if (!normalized) return;
    setUrls((prev) => normalizeUrls([...prev, normalized]));
    setPendingUrl("");
  }

  function removeUrl(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    setUrls((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  return (
    <div className="space-y-2 rounded-md border border-slate-200 p-3">
      <label className={labelClassName}>Bildgalleri (dra och släpp för ordning)</label>
      <input type="hidden" name={name} value={serialized} />

      <div className="flex gap-2">
        <input
          value={pendingUrl}
          onChange={(event) => setPendingUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
          placeholder="https://.../bild.jpg"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addUrl}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Lägg till
        </button>
      </div>

      {urls.length > 0 ? (
        <div className="space-y-2">
          {urls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => setDraggingIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggingIndex === null) return;
                moveItem(draggingIndex, index);
                setDraggingIndex(null);
              }}
              onDragEnd={() => setDraggingIndex(null)}
              className="grid cursor-grab items-center gap-2 rounded-md border border-slate-200 bg-white p-2 md:grid-cols-[auto_64px_1fr_auto]"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-xs text-slate-600">
                {index + 1}
              </span>
              <div
                className="h-12 w-16 rounded border border-slate-200 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${url}')` }}
              />
              <p className="truncate text-xs text-slate-600" title={url}>
                {url}
              </p>
              <button
                type="button"
                onClick={() => removeUrl(index)}
                className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Inga bilder tillagda ännu. Lägg till URL eller ladda upp bilder nedan.
        </p>
      )}
    </div>
  );
}
