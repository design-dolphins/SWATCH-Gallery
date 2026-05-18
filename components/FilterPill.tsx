"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type FilterPillProps = {
  label: string;
  options: string[];
  activeOption: string;
  onChange: (option: string) => void;
};

export default function FilterPill({
  label,
  options,
  activeOption,
  onChange
}: FilterPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = activeOption !== "All";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition whitespace-nowrap ${
          isActive
            ? "border-acid bg-acid text-white"
            : "border-black/10 bg-white/60 text-ink hover:border-acid/40 hover:bg-acid/10 hover:text-ink"
        }`}
      >
        {isActive ? `${label}: ${activeOption}` : label}
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
      <div className="absolute left-0 top-full z-50 mt-1 max-h-96 w-52 overflow-y-auto border border-black/10 bg-white shadow-sm">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm font-bold transition ${
                activeOption === option
                  ? "bg-ink text-bone"
                  : "text-black/60 hover:bg-acid/10 hover:text-ink"
              }`}
            >
              {option === "All" ? `すべて` : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
