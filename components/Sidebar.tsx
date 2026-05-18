"use client";

import { useState } from "react";
import { Layers3, X } from "lucide-react";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const counts = new Map<string, number>();

  items.forEach((item) => {
    if (item.category) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
  });

  const handleSelect = (category: string) => {
    onChange(category);
    setSheetOpen(false);
  };

  return (
    <>
      {/* SP: ボトムシートトリガー */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-bold transition hover:bg-white"
        >
          <Layers3 size={14} />
          {activeCategory === "All" ? "Categories" : activeCategory}
        </button>
      </div>

      {/* SP: オーバーレイ */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* SP: ボトムシート */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-white transition-transform duration-300 lg:hidden ${
          sheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "85vh" }}
      >
        <div className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-black/15" />
        <div className="flex shrink-0 items-center justify-between border-b border-black/08 px-5 py-3">
          <p className="text-sm font-black uppercase">Categories</p>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="grid h-7 w-7 place-items-center rounded-full bg-black/06"
          >
            <X size={14} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-8 pt-3">
          {/* All */}
          <button
            type="button"
            onClick={() => handleSelect("All")}
            className={`mb-3 flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-sm font-bold transition ${
              activeCategory === "All"
                ? "bg-ink text-bone"
                : "border border-black/08 bg-bone text-black/60 hover:text-ink"
            }`}
          >
            <span>All</span>
            <span className={`text-xs ${activeCategory === "All" ? "text-bone/60" : "text-black/30"}`}>{items.length}</span>
          </button>

          {categoryGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase text-black/50">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-acid" />
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map((category) => {
                  const isActive = category === activeCategory;
                  const count = counts.get(category) ?? 0;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleSelect(category)}
                      className={`flex items-center justify-between rounded-[8px] px-3 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? "bg-ink text-bone"
                          : "border border-black/08 bg-bone text-black/60 hover:text-ink"
                      }`}
                    >
                      <span className="truncate">{category}</span>
                      <span className={`ml-1 shrink-0 text-xs ${isActive ? "text-bone/60" : "text-black/30"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PC: 通常サイドバー */}
      <aside className="hidden lg:sticky lg:top-[154px] lg:block lg:h-[calc(100vh-178px)]">
        <div className="flex items-center gap-2 border-b border-black/10 pb-4 lg:mb-4">
          <Layers3 size={18} />
          <p className="text-sm font-black uppercase">Categories</p>
        </div>
        <div className="lg:max-h-[calc(100vh-230px)] lg:space-y-5 lg:overflow-auto lg:pr-1">
          <CategoryButton
            category="All"
            count={items.length}
            isActive={activeCategory === "All"}
            onChange={onChange}
          />
          {categoryGroups.map((group) => (
            <div key={group.label}>
              <p className="flex items-center gap-1.5 px-2 pb-2 text-[11px] font-black uppercase text-black/60">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-acid" />
                {group.label}
              </p>
              <div className="grid gap-1">
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
    </>
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
      className={`flex w-full items-center justify-between gap-3 rounded-[6px] px-3 py-2 text-left text-sm font-bold transition ${
        isActive
          ? "bg-ink text-bone"
          : "text-black/56 hover:bg-acid/10 hover:text-ink"
      }`}
      type="button"
      onClick={() => onChange(category)}
    >
      <span className="max-w-[180px] truncate">{category}</span>
      <span className={`text-xs ${isActive ? "text-bone/62" : "text-black/32"}`}>
        {count}
      </span>
    </button>
  );
}
