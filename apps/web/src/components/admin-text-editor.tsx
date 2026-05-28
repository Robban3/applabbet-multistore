"use client";

import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AdminTextEditorProps = {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
};

export function AdminTextEditor({
  name,
  label,
  defaultValue = "",
  rows = 4,
  placeholder,
  className,
  showPreview = true,
}: AdminTextEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const preview = useMemo(() => value.trim(), [value]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function replaceSelection(
    transform: (
      selectedText: string,
      context: { selectionStart: number; selectionEnd: number; fullText: string },
    ) => { nextText: string; caretStart?: number; caretEnd?: number },
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: fullText } = textarea;
    const selectedText = fullText.slice(selectionStart, selectionEnd);
    const { nextText, caretStart, caretEnd } = transform(selectedText, {
      selectionStart,
      selectionEnd,
      fullText,
    });

    setValue(nextText);

    const nextCaretStart = caretStart ?? selectionStart;
    const nextCaretEnd = caretEnd ?? nextCaretStart;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCaretStart, nextCaretEnd);
    });
  }

  function wrapSelection(prefix: string, suffix = prefix, fallbackText = "text") {
    replaceSelection((selectedText, { selectionStart, selectionEnd, fullText }) => {
      const hasSelection = selectedText.length > 0;
      const content = hasSelection ? selectedText : fallbackText;
      const replacement = `${prefix}${content}${suffix}`;
      const nextText = fullText.slice(0, selectionStart) + replacement + fullText.slice(selectionEnd);
      const selectedContentStart = selectionStart + prefix.length;
      const selectedContentEnd = selectedContentStart + content.length;
      return {
        nextText,
        caretStart: selectedContentStart,
        caretEnd: selectedContentEnd,
      };
    });
  }

  function prefixLines(prefix: string, useNumbering = false) {
    replaceSelection((selectedText, { selectionStart, selectionEnd, fullText }) => {
      const lineStart = fullText.lastIndexOf("\n", selectionStart - 1) + 1;
      const lineEndIndex = fullText.indexOf("\n", selectionEnd);
      const lineEnd = lineEndIndex === -1 ? fullText.length : lineEndIndex;
      const block = fullText.slice(lineStart, lineEnd);
      const lines = block.split("\n");
      const nextLines = lines.map((line, index) => {
        if (!line.trim()) return line;
        if (useNumbering) return `${index + 1}. ${line.replace(/^\d+\.\s+/, "")}`;
        return `${prefix}${line.replace(/^[-*]\s+/, "")}`;
      });
      const replacement = nextLines.join("\n");
      const nextText = fullText.slice(0, lineStart) + replacement + fullText.slice(lineEnd);
      const nextSelectionStart = lineStart;
      const nextSelectionEnd = lineStart + replacement.length;
      return {
        nextText,
        caretStart: nextSelectionStart,
        caretEnd: nextSelectionEnd,
      };
    });
  }

  return (
    <label className={className || "block"}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => wrapSelection("**", "**", "fet text")}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Fet
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("*", "*", "kursiv text")}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Kursiv
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("## ", "", "Rubrik")}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Rubrik
        </button>
        <button
          type="button"
          onClick={() => prefixLines("- ")}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Punktlista
        </button>
        <button
          type="button"
          onClick={() => prefixLines("", true)}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Numrerad lista
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[", "](https://)", "länktext")}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Länk
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <input type="hidden" name={name} value={value} />
      {showPreview ? (
        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
          {preview ? (
            <div className="prose prose-sm max-w-none text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm text-slate-700">Ingen text ar angiven an.</p>
          )}
        </div>
      ) : null}
    </label>
  );
}

