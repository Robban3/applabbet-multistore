"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

type CmsInlineTextProps = {
  value: string;
  blockKey: string;
  fieldKey: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
};

function getIsInlineEditMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("cms_edit") === "1";
}

export function CmsInlineText({
  value,
  blockKey,
  fieldKey,
  as = "span",
  className,
}: CmsInlineTextProps) {
  const searchParams = useSearchParams();
  const isInlineEditMode = searchParams.get("cms_edit") === "1" || getIsInlineEditMode();

  const baseClasses = useMemo(() => {
    if (!isInlineEditMode) return className || "";
    return `${className || ""} rounded-md outline-none ring-offset-2 transition hover:ring-2 hover:ring-sky-300 focus:ring-2 focus:ring-sky-500`;
  }, [className, isInlineEditMode]);

  if (!isInlineEditMode) {
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }

  const Tag = as;
  return (
    <Tag
      className={baseClasses}
      contentEditable
      suppressContentEditableWarning
      onInput={(event) => {
        const nextValue = event.currentTarget.textContent || "";
        window.parent.postMessage(
          {
            type: "cms-inline-update",
            payload: {
              blockKey,
              fieldKey,
              value: nextValue,
            },
          },
          window.location.origin,
        );
      }}
      data-cms-block={blockKey}
      data-cms-field={fieldKey}
      title={`Inline edit: ${blockKey}.${fieldKey}`}
    >
      {value}
    </Tag>
  );
}
