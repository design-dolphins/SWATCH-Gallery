"use client";

import { Search, X } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/38"
        size={18}
      />
      <input
        className="h-12 w-full rounded-full border border-black/10 bg-white/72 pl-11 pr-12 text-sm font-semibold text-ink outline-none transition placeholder:text-black/35 focus:border-black/30 focus:bg-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search category, industry, color, memo..."
      />
      {value ? (
        <button
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-black/44 transition hover:bg-black/5 hover:text-black"
          type="button"
          onClick={() => onChange("")}
          aria-label="検索を消去"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}
