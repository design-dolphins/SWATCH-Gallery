"use client";

type TagRailProps = {
  label: string;
  options: string[];
  activeOption: string;
  onChange: (option: string) => void;
};

export default function TagRail({
  label,
  options,
  activeOption,
  onChange
}: TagRailProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs font-black uppercase text-black/38">
        {label}
      </span>
      {options.map((option) => {
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
    </div>
  );
}
