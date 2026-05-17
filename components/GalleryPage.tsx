"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import GalleryCard from "@/components/GalleryCard";
import PreviewModal from "@/components/PreviewModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import TagRail from "@/components/TagRail";
import { categoryGroups, colors, industries } from "@/lib/constants";
import type { GalleryItem } from "@/lib/types";

type GalleryPageProps = {
  initialItems: GalleryItem[];
};

export default function GalleryPage({ initialItems }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeColor, setActiveColor] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return initialItems.filter((item) => {
      const categoryMatch =
        activeCategory === "All" || item.category === activeCategory;
      const industryMatch =
        activeIndustry === "All" || item.industry === activeIndustry;
      const colorMatch = activeColor === "All" || item.color === activeColor;
      const searchable = [
        item.title,
        item.site_name,
        item.category,
        item.industry,
        item.color,
        item.memo
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const queryMatch =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);

      return categoryMatch && industryMatch && colorMatch && queryMatch;
    });
  }, [activeCategory, activeColor, activeIndustry, initialItems, query]);

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveIndustry("All");
    setActiveColor("All");
    setQuery("");
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-bone/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1780px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <a className="group flex items-center gap-3" href="/">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-black text-bone transition-transform group-hover:rotate-6">
                SG
              </span>
              <span>
                <span className="block text-xl font-black uppercase">
                  SWATCH Gallery
                </span>
                <span className="block text-xs font-semibold uppercase text-black/45">
                  Visual Reference Gallery
                </span>
              </span>
            </a>
            <a
              className="ml-auto hidden shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:border-black/30 hover:bg-white md:flex"
              href="/admin"
            >
              ＋ 追加
            </a>
            <div className="flex flex-1 items-center gap-3 lg:max-w-3xl">
              <SearchBar value={query} onChange={setQuery} />
              <button
                className="hidden h-12 shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 text-sm font-bold text-ink shadow-sm transition hover:border-black/30 hover:bg-white md:flex"
                type="button"
                onClick={clearFilters}
              >
                <SlidersHorizontal size={17} />
                Reset
              </button>
            </div>
          </div>
          <div className="grid gap-2 xl:grid-cols-[1fr_1fr]">
            <TagRail
              label="業界"
              options={["All", ...industries]}
              activeOption={activeIndustry}
              onChange={setActiveIndustry}
            />
            <TagRail
              label="カラー"
              options={["All", ...colors]}
              activeOption={activeColor}
              onChange={setActiveColor}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1780px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <Sidebar
          categoryGroups={categoryGroups}
          activeCategory={activeCategory}
          items={initialItems}
          onChange={setActiveCategory}
        />

        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase text-bone">
                <Sparkles size={13} />
                {filteredItems.length} references
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.96] text-ink sm:text-5xl lg:text-7xl">
                Find UI patterns by mood, part, and intent.
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-black/58 md:text-right">
              パーツ別・業界別・カラー別で絞れるUIギャラリーサイト。
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              <motion.div layout className="masonry-grid">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    className="masonry-item"
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.26, ease: "easeOut" }}
                  >
                    <GalleryCard item={item} onOpen={setSelectedItem} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="grid min-h-[380px] place-items-center border border-dashed border-black/20 bg-white/35 p-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>
                  <p className="text-2xl font-black">No matches</p>
                  <p className="mt-2 text-sm text-black/55">
                    検索語・カテゴリ・業界・カラーを少しゆるめると見つかります。
                  </p>
                  <button
                    className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-bone transition hover:bg-black"
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <PreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
}
