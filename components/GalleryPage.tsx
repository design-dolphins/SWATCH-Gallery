"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";
import FilterPill from "@/components/FilterPill";
import GalleryCard from "@/components/GalleryCard";
import PreviewModal from "@/components/PreviewModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { categoryGroups, colors, fontTypes, industries, tastes } from "@/lib/constants";
import type { GalleryItem } from "@/lib/types";

type GalleryPageProps = {
  initialItems: GalleryItem[];
};

export default function GalleryPage({ initialItems }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeColor, setActiveColor] = useState("All");
  const [activeTaste, setActiveTaste] = useState("All");
  const [activeFont, setActiveFont] = useState("All");
  const [activeFontType, setActiveFontType] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  // フォント名の選択肢をデータから動的生成（カンマ区切りを分割）
  const fontOptions = useMemo(() => {
    const set = new Set<string>();
    initialItems.forEach((item) => {
      if (item.font) {
        item.font.split(",").map(f => f.trim()).forEach(f => { if (f) set.add(f); });
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [initialItems]);

  // サイト別カード（Allビュー用・KVを優先）
  const siteCards = useMemo(() => {
    const map = new Map<string, GalleryItem>();
    const counts = new Map<string, number>();
    initialItems.forEach((item) => {
      const key = item.site_name ?? "";
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (!map.has(key)) {
        map.set(key, item);
      } else if (item.category === "KV") {
        map.set(key, item);
      }
    });
    return { cards: Array.from(map.values()), counts };
  }, [initialItems]);

  // フィルター関数（共通）
  const applyFilters = (item: GalleryItem, normalizedQuery: string) => {
    const industryMatch = activeIndustry === "All" || item.industry === activeIndustry;
    const colorMatch = activeColor === "All" || item.color === activeColor;
    const tasteMatch = activeTaste === "All" || item.taste === activeTaste;
    const fontMatch = activeFont === "All" || (item.font?.split(",").map(f => f.trim()).includes(activeFont) ?? false);
    const fontTypeMatch = activeFontType === "All" || (item.font_type?.split(",").map(f => f.trim()).includes(activeFontType) ?? false);
    const searchable = [item.title, item.site_name, item.category, item.industry, item.color, item.taste, item.font, item.memo]
      .filter(Boolean).join(" ").toLowerCase();
    const queryMatch = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
    return industryMatch && colorMatch && tasteMatch && fontMatch && fontTypeMatch && queryMatch;
  };

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      return categoryMatch && applyFilters(item, q);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeColor, activeIndustry, activeTaste, activeFont, activeFontType, initialItems, query]);

  const displayItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (activeCategory === "All") {
      if (selectedSite) {
        return initialItems.filter((item) => item.site_name === selectedSite);
      }
      return siteCards.cards.filter((item) => applyFilters(item, q));
    }
    return filteredItems;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, selectedSite, siteCards, filteredItems, initialItems, query, activeIndustry, activeColor, activeTaste, activeFont, activeFontType]);

  const handleCardOpen = (item: GalleryItem) => {
    if (activeCategory === "All" && !selectedSite) {
      setSelectedSite(item.site_name);
    } else {
      setSelectedItem(item);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedSite(null);
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveIndustry("All");
    setActiveColor("All");
    setActiveTaste("All");
    setActiveFont("All");
    setActiveFontType("All");
    setSelectedSite(null);
    setQuery("");
  };

  const hasActiveFilters =
    activeIndustry !== "All" ||
    activeColor !== "All" ||
    activeTaste !== "All" ||
    activeFont !== "All" ||
    activeFontType !== "All";

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-bone/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1780px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link className="group flex items-center gap-3" href="/">
              <span>
                <span className="block text-xl font-black uppercase">
                  SWATCH Gallery
                </span>
                <span className="block text-xs font-semibold uppercase text-black/45">
                  Visual Reference Gallery
                </span>
              </span>
            </Link>
          </div>

          {/* フィルターバー */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill
              label="業界"
              options={["All", ...industries]}
              activeOption={activeIndustry}
              onChange={setActiveIndustry}
            />
            <FilterPill
              label="カラー"
              options={["All", ...colors]}
              activeOption={activeColor}
              onChange={setActiveColor}
            />
            <FilterPill
              label="テイスト"
              options={["All", ...tastes]}
              activeOption={activeTaste}
              onChange={setActiveTaste}
            />
            <FilterPill
              label="フォント種別"
              options={["All", ...fontTypes]}
              activeOption={activeFontType}
              onChange={setActiveFontType}
            />
            <FilterPill
              label="フォント名"
              options={fontOptions}
              activeOption={activeFont}
              onChange={setActiveFont}
            />
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-bold text-black/50 transition hover:border-black/30 hover:bg-white hover:text-ink"
              >
                <SlidersHorizontal size={13} />
                Reset
              </button>
            )}
            <div className="ml-auto w-60 shrink-0">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1780px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <Sidebar
          categoryGroups={categoryGroups}
          activeCategory={activeCategory}
          items={initialItems}
          onChange={handleCategoryChange}
        />

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase text-bone">
              <Sparkles size={13} />
              {selectedSite
                ? selectedSite
                : activeCategory === "All"
                ? `${displayItems.length} sites`
                : `${displayItems.length} references`}
            </div>
            {selectedSite && (
              <button
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold transition hover:border-black/30"
                type="button"
                onClick={() => setSelectedSite(null)}
              >
                <ArrowLeft size={15} />
                サイト一覧に戻る
              </button>
            )}
          </div>

          {displayItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayItems.map((item) => (
                <div
                  key={
                    activeCategory === "All" && !selectedSite
                      ? (item.site_name ?? item.id)
                      : item.id
                  }
                >
                  <GalleryCard
                    item={item}
                    onOpen={handleCardOpen}
                    partsCount={
                      activeCategory === "All" && !selectedSite
                        ? siteCards.counts.get(item.site_name ?? "") ?? 1
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[380px] place-items-center border border-dashed border-black/20 bg-white/35 p-10 text-center">
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
            </div>
          )}
        </section>
      </div>

      {/* FAB */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-40 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink text-bone shadow-md transition hover:bg-black text-lg leading-none"
        aria-label="追加"
      >
        ＋
      </Link>

      <PreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
}
