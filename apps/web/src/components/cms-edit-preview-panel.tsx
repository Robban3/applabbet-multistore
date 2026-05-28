"use client";

import { useState } from "react";

type CmsEditPreviewPanelProps = {
  previewRoute: string;
  pageKey: string;
};

export function CmsEditPreviewPanel({ previewRoute, pageKey }: CmsEditPreviewPanelProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const hasQuery = previewRoute.includes("?");
  const previewUrl = `${previewRoute}${hasQuery ? "&" : "?"}cms_edit=1&cms_page_key=${encodeURIComponent(pageKey)}`;
  const frameWidth =
    viewport === "mobile" ? 390 : viewport === "tablet" ? 820 : "100%";

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm 2xl:sticky 2xl:top-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Live preview (inline)</h3>
          <p className="text-xs text-slate-500">Klicka text i previewn och skriv direkt.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-slate-300 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`rounded px-2 py-1 text-xs font-semibold ${
                viewport === "desktop" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`rounded px-2 py-1 text-xs font-semibold ${
                viewport === "tablet" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Padda
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`rounded px-2 py-1 text-xs font-semibold ${
                viewport === "mobile" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Mobil
            </button>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="inline-flex rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Uppdatera preview
          </button>
        </div>
      </div>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-3">
        <div className="mx-auto overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm" style={{ width: frameWidth, maxWidth: "100%" }}>
          <iframe
            key={reloadKey}
            src={previewUrl}
            className="h-[82vh] w-full bg-white"
            title="CMS preview"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Tips: klicka Preview efter större ändringar för att uppdatera utkast-cookien.
      </p>
    </aside>
  );
}
