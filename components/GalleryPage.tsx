"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Layers3, LayoutGrid, LayoutList, Menu, SlidersHorizontal, Sparkles, X } from "lucide-react";
import FilterPill from "@/components/FilterPill";
import GalleryCard from "@/components/GalleryCard";
import PreviewModal from "@/components/PreviewModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { categoryGroups, colorMap, colors, fontTypes, industries, japaneseFonts, siteTypes, tastes } from "@/lib/constants";
import { useFavorites } from "@/lib/useFavorites";
import type { GalleryItem } from "@/lib/types";

type GalleryPageProps = {
  initialItems: GalleryItem[];
};

export default function GalleryPage({ initialItems }: GalleryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeSiteType, setActiveSiteType] = useState("All");
  const [activeColor, setActiveColor] = useState("All");
  const [activeTaste, setActiveTaste] = useState("All");
  const [activeFont, setActiveFont] = useState("All");
  const [activeFontType, setActiveFontType] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState<GalleryItem[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);
  const filterOpenRef = useRef(false);
  const openFilterCount = useRef(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
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
        if (cooldown || filterOpenRef.current) {
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
    const siteTypeMatch = activeSiteType === "All" || item.site_type === activeSiteType;
    const colorMatch = activeColor === "All" || item.color === activeColor;
    const tasteMatch = activeTaste === "All" || item.taste === activeTaste;
    const fontMatch = activeFont === "All" || (item.font?.split(",").map(f => f.trim()).includes(activeFont) ?? false);
    const fontTypeMatch = activeFontType === "All" || (item.font_type?.split(",").map(f => f.trim()).includes(activeFontType) ?? false);
    const searchable = [item.title, item.site_name, item.category, item.industry, item.color, item.taste, item.font, item.memo]
      .filter(Boolean).join(" ").toLowerCase();
    const queryMatch = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
    return industryMatch && siteTypeMatch && colorMatch && tasteMatch && fontMatch && fontTypeMatch && queryMatch;
  };

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      return categoryMatch && applyFilters(item, q);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeColor, activeIndustry, activeSiteType, activeTaste, activeFont, activeFontType, initialItems, query]);

  const displayItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items: GalleryItem[];
    if (activeCategory === "All") {
      if (selectedSite) {
        items = initialItems.filter((item) => item.site_name === selectedSite);
      } else {
        items = siteCards.cards.filter((item) => applyFilters(item, q));
      }
    } else {
      items = filteredItems;
    }
    if (showFavoritesOnly) {
      items = items.filter((item) => isFavorite(String(item.id)));
    }
    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, selectedSite, siteCards, filteredItems, initialItems, query, activeIndustry, activeSiteType, activeColor, activeTaste, activeFont, activeFontType, showFavoritesOnly, favorites]);

  const handleCardOpen = (item: GalleryItem) => {
    if (activeCategory === "All" && !selectedSite) {
      setSelectedSite(item.site_name);
    } else {
      setSelectedItem(item);
    }
  };

  const handleCompareToggle = (item: GalleryItem) => {
    setCompareItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      if (prev.length >= 2) return prev;
      return [...prev, item];
    });
  };

  const handleFilterOpenChange = (open: boolean) => {
    if (open) {
      openFilterCount.current += 1;
    } else {
      openFilterCount.current = Math.max(0, openFilterCount.current - 1);
    }
    filterOpenRef.current = openFilterCount.current > 0;
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
    setActiveSiteType("All");
    setActiveColor("All");
    setActiveTaste("All");
    setActiveFont("All");
    setActiveFontType("All");
    setQuery("");
    router.push("/");
  };

  const hasActiveFilters =
    activeIndustry !== "All" ||
    activeSiteType !== "All" ||
    activeColor !== "All" ||
    activeTaste !== "All" ||
    activeFont !== "All" ||
    activeFontType !== "All";

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-bone/86 backdrop-blur-xl">
        <div className={`mx-auto flex max-w-[1780px] flex-col px-4 py-4 transition-all duration-300 sm:px-6 lg:px-8 ${showFilters ? "gap-3" : "gap-0"}`}>
          {/* ロゴ＋ハンバーガー：常に表示 */}
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
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-sm font-bold transition hover:bg-white touch-manipulation lg:hidden"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              {mobileFilterOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>

          {/* SP: Categoriesボタン（スクロール連動・ハンバーガー非表示時のみ） */}
          <div className={`lg:hidden transition-all duration-300 ${mobileFilterOpen ? "hidden" : showFilters ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"}`}>
            <button
              type="button"
              onClick={() => setCategorySheetOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-sm font-bold transition hover:bg-white touch-manipulation"
            >
              <Layers3 size={14} />
              <span>{activeCategory === "All" ? "Categories" : activeCategory}</span>
            </button>
          </div>

          {/* フィルターバー：PC=スクロール連動、SP=ハンバーガー */}
          <div className={`flex flex-wrap items-center gap-2 transition-all duration-300 ${mobileFilterOpen ? "flex max-h-screen opacity-100 overflow-visible" : showFilters ? "hidden lg:flex max-h-screen opacity-100 overflow-visible" : "hidden lg:hidden max-h-0 opacity-0 pointer-events-none overflow-hidden"}`}>
            <FilterPill
              label="業界"
              options={["All", ...industries]}
              activeOption={activeIndustry}
              onChange={setActiveIndustry}
              onOpenChange={handleFilterOpenChange}
            />
            <FilterPill
              label="サイトタイプ"
              options={["All", ...siteTypes]}
              activeOption={activeSiteType}
              onChange={setActiveSiteType}
              onOpenChange={handleFilterOpenChange}
            />
            <FilterPill
              label="カラー"
              options={["All", ...colors]}
              activeOption={activeColor}
              onChange={setActiveColor}
              colorMap={colorMap}
              onOpenChange={handleFilterOpenChange}
            />
            <FilterPill
              label="テイスト"
              options={["All", ...tastes]}
              activeOption={activeTaste}
              onChange={setActiveTaste}
              onOpenChange={handleFilterOpenChange}
            />
            <FilterPill
              label="フォント種別"
              options={["All", ...fontTypes]}
              activeOption={activeFontType}
              onChange={setActiveFontType}
              onOpenChange={handleFilterOpenChange}
            />
            <FilterPill
              label="フォント名"
              options={fontOptions}
              optionGroups={fontOptionGroups.length ? fontOptionGroups : undefined}
              activeOption={activeFont}
              onChange={setActiveFont}
              onOpenChange={handleFilterOpenChange}
            />
            <button
              type="button"
              onClick={() => {
                setCompareMode((v) => !v);
                if (compareMode) { setCompareItems([]); setShowCompareView(false); }
              }}
              className={`group flex h-[38px] shrink-0 items-center overflow-hidden rounded-full border pl-[11px] transition-all duration-200 ${compareMode ? "pr-3" : "pr-[11px] hover:pr-3"} ${compareMode ? "border-acid bg-acid text-white" : "border-black/10 bg-white/60 text-black/40 hover:border-acid/40 hover:bg-acid/10 hover:text-acid"}`}
              aria-label="並べて比較"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
                <rect x="1.2" y="1.3" width="6.5" height="13" rx=".5" ry=".5"/>
                <path d="M14.4,1.3h-5.5c-.3,0-.5.2-.5.5v12.1c0,.3.2.5.5.5h5.5c.3,0,.5-.2.5-.5V1.7c0-.3-.2-.5-.5-.5ZM13.8,12.9c0,.2-.1.3-.3.3h-3.7c-.2,0-.3-.1-.3-.3V2.7c0-.2.1-.3.3-.3h3.7c.2,0,.3.1.3.3v10.2Z"/>
              </svg>
              <span className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-200 ${compareMode ? "ml-1.5 max-w-[80px] opacity-100" : "ml-0 max-w-0 opacity-0 group-hover:ml-1.5 group-hover:max-w-[80px] group-hover:opacity-100"}`}>
                並べて比較
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((v) => !v)}
              className={`group flex h-[38px] shrink-0 items-center overflow-hidden rounded-full border pl-[11px] transition-all duration-200 ${showFavoritesOnly ? "pr-3" : "pr-[11px] hover:pr-3"} ${showFavoritesOnly ? "border-acid bg-acid text-white" : "border-black/10 bg-white/60 text-black/40 hover:border-acid/40 hover:bg-acid/10 hover:text-acid"}`}
              aria-label="お気に入り"
            >
              <Heart size={15} className={showFavoritesOnly ? "fill-white shrink-0" : "shrink-0"} />
              <span className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-200 ${showFavoritesOnly ? "ml-1.5 max-w-[72px] opacity-100" : "ml-0 max-w-0 opacity-0 group-hover:ml-1.5 group-hover:max-w-[72px] group-hover:opacity-100"}`}>
                お気に入り
              </span>
            </button>
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
          sheetOpen={categorySheetOpen}
          onSheetOpenChange={setCategorySheetOpen}
        />

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between lg:border-b lg:border-black/10 lg:pb-5">
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
            {/* PC: 列数トグル（Animationカテゴリ時は非表示） */}
            {!["Button", "Big Button", "Text", "Hover", "Scroll UI"].includes(activeCategory) && (
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
            )}
            </div>
          </div>

          {displayItems.length > 0 ? (
            <div className={`grid gap-x-4 gap-y-8 ${["Button", "Big Button", "Text", "Hover", "Scroll UI"].includes(activeCategory) ? "grid-cols-1 sm:grid-cols-3 lg:grid-cols-4" : ["スマホKV", "スマホメニュー"].includes(activeCategory) ? "grid-cols-2 px-8 sm:grid-cols-3 lg:grid-cols-4 lg:px-16" : columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
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
                    onOpen={compareMode ? () => handleCompareToggle(item) : handleCardOpen}
                    partsCount={
                      activeCategory === "All" && !selectedSite
                        ? siteCards.counts.get(item.site_name ?? "") ?? 1
                        : undefined
                    }
                    singleColumn={columns === 1}
                    isFavorite={isFavorite(String(item.id))}
                    onFavoriteToggle={toggleFavorite}
                    compareMode={compareMode}
                    isCompareSelected={compareItems.some((i) => i.id === item.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[380px] place-items-center border border-dashed border-black/20 bg-white/35 p-10 text-center">
              <div>
                <p className="text-2xl font-black">No matches</p>
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

      <PreviewModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isFavorite={selectedItem ? isFavorite(String(selectedItem.id)) : false}
        onFavoriteToggle={toggleFavorite}
      />

      {/* 比較バー */}
      {compareMode && compareItems.length > 0 && !showCompareView && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-bone/95 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
          <div className="flex gap-2 flex-1 overflow-x-auto overflow-y-visible py-2">
            {compareItems.map((item) => (
              <div key={item.id} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url ?? ""} alt={item.site_name ?? ""} className="h-12 w-12 rounded-lg object-cover border border-black/10" />
                <button
                  type="button"
                  onClick={() => handleCompareToggle(item)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-ink text-bone flex items-center justify-center"
                >
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setCompareMode(false); setCompareItems([]); setShowCompareView(false); }}
            className="shrink-0 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-bold text-ink hover:bg-white transition"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => setShowCompareView(true)}
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-bold text-bone hover:bg-black transition"
          >
            並べる（{compareItems.length}）
          </button>
        </div>
      )}

      {/* 比較ビュー */}
      {showCompareView && (
        <div className="fixed inset-0 z-50 bg-bone overflow-y-auto lg:overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 shrink-0">
            <span className="text-sm font-bold">並べて比較</span>
            <button
              type="button"
              onClick={() => setShowCompareView(false)}
              className="rounded-full border border-black/10 p-2 hover:bg-black/5 transition"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 p-4 lg:flex lg:gap-6 lg:overflow-x-auto lg:px-6">
            {compareItems.map((item) => {
              const isSpPhone = ["スマホKV", "スマホメニュー"].includes(item.category ?? "");
              return (
                <div key={item.id} className={`flex flex-col gap-3 shrink-0 ${isSpPhone ? "w-[min(50vw,240px)]" : "w-[calc(50vw-2.5rem)]"}`}>
                  <div className={isSpPhone ? "rounded-[32px] border-4 border-ink overflow-hidden" : "border border-black/10 overflow-hidden"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url ?? ""}
                      alt={item.site_name ?? ""}
                      className="w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate">{item.site_name}</p>
                    <p className="text-xs text-black/45 truncate">{item.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
