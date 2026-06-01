"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CmsBlockDefinition,
  CmsBlocksContent,
} from "@/lib/cms/registry";

type CmsBlockComposerProps = {
  blocks: CmsBlockDefinition[];
  initialValues: CmsBlocksContent;
  pageKey?: string;
};

function inputTypeForField(_field?: unknown): "text" {
  // We store both absolute and relative paths (e.g. "/products").
  // Browser URL validation blocks form submit/preview for many valid CMS links,
  // so URL fields are treated as plain text inputs.
  return "text";
}

export function CmsBlockComposer({ blocks, initialValues, pageKey }: CmsBlockComposerProps) {
  const [blockOrder, setBlockOrder] = useState<string[]>(blocks.map((block) => block.key));
  const [draggedBlockKey, setDraggedBlockKey] = useState<string | null>(null);
  const [values, setValues] = useState<CmsBlocksContent>(() => {
    const seeded: CmsBlocksContent = {};
    for (const block of blocks) {
      seeded[block.key] = {};
      for (const field of block.fields) {
        seeded[block.key][field.key] =
          initialValues[block.key]?.[field.key] ?? field.defaultValue;
      }
    }
    return seeded;
  });
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const blocksByKey = useMemo(
    () => new Map(blocks.map((block) => [block.key, block])),
    [blocks],
  );

  const orderedBlocks = useMemo(
    () =>
      blockOrder
        .map((blockKey) => blocksByKey.get(blockKey))
        .filter((block): block is CmsBlockDefinition => Boolean(block)),
    [blockOrder, blocksByKey],
  );

  function updateField(blockKey: string, fieldKey: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [blockKey]: {
        ...(prev[blockKey] || {}),
        [fieldKey]: value,
      },
    }));
  }

  function reorderBlocks(sourceKey: string, targetKey: string) {
    if (sourceKey === targetKey) return;
    setBlockOrder((prev) => {
      const sourceIndex = prev.indexOf(sourceKey);
      const targetIndex = prev.indexOf(targetKey);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  useEffect(() => {
    function onInlineUpdate(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (typeof event.data !== "object" || !event.data) return;
      if ((event.data as { type?: string }).type !== "cms-inline-update") return;
      const payload = (event.data as { payload?: unknown }).payload;
      if (typeof payload !== "object" || !payload) return;
      const maybePayload = payload as {
        blockKey?: unknown;
        fieldKey?: unknown;
        value?: unknown;
      };
      if (
        typeof maybePayload.blockKey !== "string" ||
        typeof maybePayload.fieldKey !== "string" ||
        typeof maybePayload.value !== "string"
      ) {
        return;
      }
      if (!blocks.some((block) => block.key === maybePayload.blockKey)) return;
      const blockKey = maybePayload.blockKey as string;
      const fieldKey = maybePayload.fieldKey as string;
      const value = maybePayload.value as string;
      setValues((prev) => ({
        ...prev,
        [blockKey]: {
          ...(prev[blockKey] || {}),
          [fieldKey]: value,
        },
      }));
    }

    window.addEventListener("message", onInlineUpdate);
    return () => window.removeEventListener("message", onInlineUpdate);
  }, [blocks]);

  return (
    <div className="space-y-4">
      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-800">
          Sidans block/komponenter
        </legend>
        {pageKey ? (
          <p className="mb-2 text-xs text-slate-500">
            Sida: <span className="font-mono">{pageKey}</span>
          </p>
        ) : null}
          {uploadError ? (
            <p className="mb-2 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700">
              {uploadError}
            </p>
          ) : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {orderedBlocks.map((block, index) => (
            <span
              key={block.key}
              className="inline-flex rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-700"
            >
              {index + 1}. {block.title}
            </span>
          ))}
        </div>
      </fieldset>

      {orderedBlocks.map((block, index) => (
        <fieldset
          key={block.key}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (draggedBlockKey) reorderBlocks(draggedBlockKey, block.key);
            setDraggedBlockKey(null);
          }}
          className="rounded-lg border border-slate-200 p-4"
        >
          <legend className="px-2 text-sm font-semibold text-slate-800">
            {index + 1}. {block.title}
          </legend>
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Dra handtaget för att ändra ordning i editorn.</p>
            <span
              draggable
              onDragStart={() => setDraggedBlockKey(block.key)}
              className="inline-flex cursor-grab select-none rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-600 active:cursor-grabbing"
              title="Dra för att flytta block"
            >
              Flytta block
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {block.fields.map((field) => {
              const inputName = `block__${block.key}__${field.key}`;
              const currentValue = values[block.key]?.[field.key] ?? field.defaultValue;
              const isTextarea = field.type === "textarea";
              return (
                <label key={field.key} className={`block ${isTextarea ? "md:col-span-2" : ""}`}>
                  <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
                  {isTextarea ? (
                    <textarea
                      value={currentValue}
                      onChange={(event) => updateField(block.key, field.key, event.target.value)}
                      rows={4}
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-slate-300 p-3 text-sm"
                    />
                  ) : field.type === "image" ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={currentValue}
                        onChange={(event) => updateField(block.key, field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                      {currentValue ? (
                        <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentValue}
                            alt={`${field.label} preview`}
                            className="h-28 w-full rounded object-cover"
                          />
                        </div>
                      ) : null}
                      <label className="block">
                        <span className="mb-1 block text-xs text-slate-500">Ladda upp bild</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm"
                          onChange={async (event) => {
                            if (!pageKey) return;
                            const selectedFile = event.currentTarget.files?.[0];
                            if (!selectedFile) return;
                            const uploadId = `${block.key}:${field.key}`;
                            setUploadingKey(uploadId);
                            setUploadError(null);
                            try {
                              const payload = new FormData();
                              payload.set("pageKey", pageKey);
                              payload.set("blockKey", block.key);
                              payload.set("fieldKey", field.key);
                              payload.set("file", selectedFile);
                              const response = await fetch("/api/admin/cms/upload-image", {
                                method: "POST",
                                body: payload,
                              });
                              const json = (await response.json()) as { url?: string; error?: string };
                              if (!response.ok || !json.url) {
                                throw new Error(json.error || "Upload misslyckades.");
                              }
                              updateField(block.key, field.key, json.url);
                            } catch (error) {
                              setUploadError(
                                error instanceof Error
                                  ? error.message
                                  : "Något gick fel vid uppladdning.",
                              );
                            } finally {
                              setUploadingKey(null);
                              event.currentTarget.value = "";
                            }
                          }}
                        />
                      </label>
                      {uploadingKey === `${block.key}:${field.key}` ? (
                        <p className="text-xs text-sky-700">Laddar upp bild...</p>
                      ) : null}
                    </div>
                  ) : (
                    <input
                      type={inputTypeForField(field)}
                      value={currentValue}
                      onChange={(event) => updateField(block.key, field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  )}
                  <input type="hidden" name={inputName} value={currentValue} />
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

