"use client";

import { useMemo, useState } from "react";
import {
  CUSTOM_BLOCK_TYPES,
  createBlockId,
  getCustomBlockLabel,
  getCustomBlockTemplate,
  type CustomPageBlock,
  type CustomBlockType,
} from "@/lib/cms/custom-page-blocks";

interface CustomPageBlockEditorProps {
  initialBlocks: CustomPageBlock[];
}

export function CustomPageBlockEditor({ initialBlocks }: CustomPageBlockEditorProps) {
  const [blocks, setBlocks] = useState<CustomPageBlock[]>(initialBlocks);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const serializedBlocks = useMemo(() => JSON.stringify(blocks), [blocks]);

  function addBlock(type: CustomBlockType) {
    const template = getCustomBlockTemplate(type);
    setBlocks((prev) => [...prev, { ...template, id: createBlockId() }]);
  }

  function removeBlock(blockId: string) {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  }

  function updateField(blockId: string, key: string, value: string) {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, data: { ...block.data, [key]: value } } : block,
      ),
    );
  }

  function reorder(dragId: string, targetId: string) {
    if (dragId === targetId) return;
    setBlocks((prev) => {
      const sourceIndex = prev.findIndex((block) => block.id === dragId);
      const targetIndex = prev.findIndex((block) => block.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  const fieldLabels: Record<string, string> = {
    eyebrow: "Overrubrik",
    title: "Rubrik",
    subtitle: "Underrubrik",
    body: "Text",
    src: "Bild-URL",
    alt: "Alt-text",
    caption: "Bildtext",
    text: "Beskrivning",
    label: "Knapptext",
    href: "Lank",
    q1: "Fraga 1",
    a1: "Svar 1",
    q2: "Fraga 2",
    a2: "Svar 2",
    leftTitle: "Vanster rubrik",
    leftBody: "Vanster text",
    rightTitle: "Hoger rubrik",
    rightBody: "Hoger text",
    item1Title: "Kort 1 rubrik",
    item1Text: "Kort 1 text",
    item2Title: "Kort 2 rubrik",
    item2Text: "Kort 2 text",
    item3Title: "Kort 3 rubrik",
    item3Text: "Kort 3 text",
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="blocksPayload" value={serializedBlocks} />

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-800">Lagg till block</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CUSTOM_BLOCK_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              + {getCustomBlockLabel(type)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <article
            key={block.id}
            draggable
            onDragStart={() => setDraggedId(block.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (draggedId) reorder(draggedId, block.id);
              setDraggedId(null);
            }}
            className="rounded-lg border border-slate-200 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-slate-900">{getCustomBlockLabel(block.type)}</p>
                <span className="rounded border border-slate-300 px-2 py-0.5 text-[11px] text-slate-600">
                  Dra & slapp for ordning
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="inline-flex rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
              >
                Ta bort
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(block.data).map(([key, value]) => {
                const isLarge = key.includes("body") || key.includes("subtitle") || key.includes("text");
                return (
                  <label key={key} className={`block ${isLarge ? "md:col-span-2" : ""}`}>
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      {fieldLabels[key] ?? key}
                    </span>
                    {isLarge ? (
                      <textarea
                        value={value}
                        onChange={(event) => updateField(block.id, key, event.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-slate-300 p-3 text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(event) => updateField(block.id, key, event.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
          Inga block tillagda an. Valj en komponent ovan for att bygga sidan.
        </p>
      ) : null}
    </div>
  );
}

