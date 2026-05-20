"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, LayoutList, Menu, SlidersHorizontal, Sparkles, X } from "lucide-react";
import FilterPill from "@/components/FilterPill";
import GalleryCard from "@/components/GalleryCard";
import PreviewModal from "@/components/PreviewModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { categoryGroups, colors, fontTypes, industries, japaneseFonts, tastes } from "@/lib/constants";
import type { GalleryItem } from "@/lib/types";

type GalleryPageProps = {
  initialItems: GalleryItem[];
};

export default function GalleryPage({ initialItems }: GalleryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeColor, setActiveColor] = useState("All");
  const [activeTaste, setActiveTaste] = useState("All");
  const [activeFont, setActiveFont] = useState("All");
  const [activeFontType, setActiveFontType] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [columns, setColumns] = useState<1 | 3>(3);
  const [showFilters, setShowFilters] = useState(true);

  // スクロール方向でフィルターバーの表示を切り替え
  useEffect(() => {
    let lastY = window.scrollY;
    let rafId: number | null = null;
    let cooldown = false;

    const handler = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (cooldown) {
          lastY = window.scrollY;
          return;
        }
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        lastY = currentY;
        if (currentY < 10) {
          setShowFilters(true);
        } else if (delta > 4) {
          setShowFilters(false);
          cooldown = true;
          setTimeout(() => { cooldown = false; lastY = window.scrollY; }, 350);
        } else if (delta < -4) {
          setShowFilters(true);
          cooldown = true;
          setTimeout(() => { cooldown = false; lastY = window.scrollY; }, 350);
        }
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // URLパラメータからstate取得
  const selectedSite = searchParams.get("site");
  const activeCategory = searchParams.get("category") ?? "All";

  const setSelectedSite = (site: string | null) => {
    if (site) {
      router.push(`?site=${encodeURIComponent(site)}`);
    } else {
      router.back();
    }
  };

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

  // フォントをJP/ENに分類
  const fontOptionGroups = useMemo(() => {
    const all = fontOptions.filter(f => f !== "All");
    const jp = all.filter(f => japaneseFonts.includes(f));
    const en = all.filter(f => !japaneseFonts.includes(f));
    const groups = [];
    if (jp.length) groups.push({ label: "日本語フォント", options: jp });
    if (en.length) groups.push({ label: "英語フォント", options: en });
    return groups;
  }, [fontOptions]);

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
    if (cat === "All") {
      router.push("/");
    } else {
      router.push(`?category=${encodeURIComponent(cat)}`);
    }
  };

  const clearFilters = () => {
    setActiveIndustry("All");
    setActiveColor("All");
    setActiveTaste("All");
    setActiveFont("All");
    setActiveFontType("All");
    setQuery("");
    router.push("/");
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
        <div className={`mx-auto flex max-w-[1780px] flex-col px-4 py-4 transition-all duration-300 sm:px-6 lg:px-8 ${showFilters ? "gap-3" : "gap-0"}`}>
          <div className="flex items-center">
            <button
              type="button"
              className="group flex items-center gap-3 text-left"
              onClick={() => { clearFilters(); handleCategoryChange("All"); }}
            >
              <span>
                <span className="block text-xl font-extrabold uppercase lg:font-black">
                  SWATCH Gallery
                </span>
                <span className="block text-xs font-medium uppercase text-black/45 lg:font-semibold">
                  パーツで探すUIギャラリーサイト
                </span>
              </span>
            </button>
            {/* モバイル: ハンバーガーボタン */}
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-sm font-bold transition hover:bg-white lg:hidden"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              {mobileFilterOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>

          {/* フィルターバー：PCは常時表示、SPはトグル */}
          <div className={`flex flex-wrap items-center gap-2 transition-all duration-300 ${showFilters ? "max-h-40 opacity-100 overflow-visible" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"} ${mobileFilterOpen ? "flex" : "hidden lg:flex"}`}>
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
              optionGroups={fontOptionGroups.length ? fontOptionGroups : undefined}
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
            <div className="w-full sm:ml-auto sm:w-60 sm:shrink-0">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1780px] grid-cols-1 gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:py-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <Sidebar
          categoryGroups={categoryGroups}
          activeCategory={activeCategory}
          items={initialItems}
          onChange={handleCategoryChange}
        />

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-5">
            <div className="flex w-full items-center gap-2">
            {(selectedSite || activeCategory !== "All") && (
              <>
              {activeCategory !== "All" && !selectedSite && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("All")}
                  className="flex items-center lg:hidden"
                  aria-label="Allに戻る"
                >
                  <ArrowLeft size={16} className="text-black/40" />
                </button>
              )}
              {selectedSite && (
                <>
                  {/* SP: 矢印（戻る）は独立・サイト名バッジは外部リンク */}
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex shrink-0 items-center lg:hidden"
                    aria-label="戻る"
                  >
                    <ArrowLeft size={16} className="text-black/40" />
                  </button>
                  <a
                    href={initialItems.find(i => i.site_name === selectedSite)?.site_url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase text-bone transition hover:bg-black lg:hidden"
                  >
                    <Sparkles size={13} className="shrink-0" />
                    <span className="truncate">{selectedSite}</span>
                  </a>
                  {/* PC: コンパクトバッジ（リンク） */}
                  <a
                    href={initialItems.find(i => i.site_name === selectedSite)?.site_url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden items-center gap-2 rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase text-bone transition hover:bg-black lg:inline-flex"
                  >
                    <Sparkles size={13} />
                    <span className="truncate">{selectedSite}</span>
                  </a>
                </>
              )}
              </>
            )}
            </div>
            <div className="flex items-center gap-2">
            {selectedSite && (
              <button
                className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold transition hover:border-black/30 lg:inline-flex"
                type="button"
                onClick={() => router.back()}
              >
                <ArrowLeft size={15} />
                サイト一覧に戻る
              </button>
            )}
            {/* PC: 列数トグル */}
            <div className="hidden overflow-hidden rounded-full border border-black/10 sm:flex">
              <button
                type="button"
                onClick={() => setColumns(3)}
                className={`flex items-center px-3 py-2 transition ${columns === 3 ? "bg-ink text-bone" : "bg-white/60 text-black/40 hover:bg-white hover:text-ink"}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setColumns(1)}
                className={`flex items-center px-3 py-2 transition ${columns === 1 ? "bg-ink text-bone" : "bg-white/60 text-black/40 hover:bg-white hover:text-ink"}`}
              >
                <LayoutList size={14} />
              </button>
            </div>
            </div>
          </div>

          {displayItems.length > 0 ? (
            <div className={`grid gap-x-4 gap-y-8 ${["モバイルファースト", "スマホKV", "スマホメニュー"].includes(activeCategory) ? "grid-cols-2 px-8 sm:grid-cols-3 lg:grid-cols-4 lg:px-16" : columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
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
        className="fixed bottom-6 right-6 z-40 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-ink text-bone shadow-md transition hover:bg-black text-xl leading-none"
        aria-label="追加"
      >
        ＋
      </Link>

      <PreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
}
