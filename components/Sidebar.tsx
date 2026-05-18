"use client";

import { Layers3 } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type SidebarProps = {
  categoryGroups: {
    label: string;
    items: string[];
  }[];
  activeCategory: string;
  items: GalleryItem[];
  onChange: (category: string) => void;
};

export default function Sidebar({
  categoryGroups,
  activeCategory,
  items,
  onChange
}: SidebarProps) {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    if (item.category) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
  });

  return (
    <aside className="lg:sticky lg:top-[154px] lg:h-[calc(100vh-178px)]">
      <div className="flex items-center gap-2 border-b border-black/10 pb-4 lg:mb-4">
        <Layers3 size={18} />
        <p className="text-sm font-black uppercase">Categories</p>
      </div>
      <div className="flex gap-2 overflow-x-auto py-4 lg:block lg:max-h-[calc(100vh-230px)] lg:space-y-5 lg:overflow-auto lg:py-0 lg:pr-1">
        <CategoryButton
          category="All"
          count={items.length}
          isActive={activeCategory === "All"}
          onChange={onChange}
        />
        {categoryGroups.map((group) => (
          <div className="contents lg:block" key={group.label}>
            <p className="hidden px-2 pb-2 text-[11px] font-black uppercase text-acid lg:block">
              {group.label}
            </p>
            <div className="contents lg:grid lg:gap-1">
              {group.items.map((category) => (
                <CategoryButton
                  category={category}
                  count={counts.get(category) ?? 0}
                  isActive={category === activeCategory}
                  key={category}
                  onChange={onChange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function CategoryButton({
  category,
  count,
  isActive,
  onChange
}: {
  category: string;
  count: number;
  isActive: boolean;
  onChange: (category: string) => void;
}) {
  return (
    <button
      className={`flex min-w-max items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm font-bold transition lg:w-full lg:rounded-[6px] lg:px-3 lg:py-2 lg:text-left ${
        isActive
          ? "bg-ink text-bone"
          : "bg-white/44 text-black/56 hover:bg-acid/10 hover:text-ink"
      }`}
      type="button"
      onClick={() => onChange(category)}
    >
      <span className="max-w-[180px] truncate">{category}</span>
      <span
        className={`text-xs ${isActive ? "text-bone/62" : "text-black/32"}`}
      >
        {count}
      </span>
    </button>
  );
}
