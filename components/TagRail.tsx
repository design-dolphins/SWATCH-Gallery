"use client";

import { useState } from "react";

type TagRailProps = {
  label: string;
  options: string[];
  activeOption: string;
  onChange: (option: string) => void;
  defaultVisible?: number;
};

export default function TagRail({
  label,
  options,
  activeOption,
  onChange,
  defaultVisible = 5
}: TagRailProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleOptions = expanded ? options : options.slice(0, defaultVisible);
  const hiddenCount = options.length - defaultVisible;
  const hasMore = !expanded && hiddenCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-1">
      <span className="shrink-0 text-xs font-black uppercase text-black/38">
        {label}
      </span>
      {visibleOptions.map((option) => {
        const isActive = activeOption === option;
        return (
          <button
            className={`min-w-max rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              isActive
                ? "border-ink bg-ink text-bone"
                : "border-black/10 bg-white/50 text-black/50 hover:border-black/25 hover:bg-white hover:text-ink"
            }`}
            key={option}
            type="button"
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        );
      })}
      {hasMore && (
        <button
          className="min-w-max rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-xs font-bold text-black/40 transition hover:border-black/25 hover:bg-white hover:text-ink"
          type="button"
          onClick={() => setExpanded(true)}
        >
          ＋{hiddenCount}
        </button>
      )}
      {expanded && hiddenCount > 0 && (
        <button
          className="min-w-max rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-xs font-bold text-black/40 transition hover:border-black/25 hover:bg-white hover:text-ink"
          type="button"
          onClick={() => setExpanded(false)}
        >
          閉じる
        </button>
      )}
    </div>
  );
}
