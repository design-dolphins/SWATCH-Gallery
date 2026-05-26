"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Layers, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  partsCount?: number;
  singleColumn?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  compareMode?: boolean;
  isCompareSelected?: boolean;
};

export default function GalleryCard({ item, onOpen, partsCount, singleColumn, isFavorite, onFavoriteToggle, compareMode, isCompareSelected }: GalleryCardProps) {
  const isSiteMode = partsCount !== undefined;
  const [isCut, setIsCut] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const isSmartphone = ["スマホメニュー", "スマホKV"].includes(item.category ?? "");
  const alwaysFrame = ["スマホメニュー", "スマホKV"].includes(item.category ?? "");
  const isAnimation = ["Button", "Big Button", "Text", "Hover", "Scroll UI"].includes(item.category ?? "");

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalHeight / img.naturalWidth;
    setIsPortrait(ratio > 1);
    // スマホカテゴリはカットしない・それ以外は65%超えたらカット
    setIsCut(!isSmartphone && !isAnimation && ratio > 0.65);
  };

  const showFrame = isSmartphone && (alwaysFrame || isPortrait);

  return (
    <motion.article
      className={`group relative ${showFrame ? "mx-auto w-full max-w-[260px]" : ""} ${isCompareSelected ? "ring-2 ring-acid" : ""}`}
      whileHover={singleColumn ? {} : { y: -4 }}
    >
      <button
        className="relative block w-full text-left touch-manipulation"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`${item.site_name ?? item.title}の詳細を見る`}
      >
        {/* スマホモック用の外枠 */}
        <div className={showFrame ? "p-2 bg-transparent" : ""}>
          <div
            className={`relative w-full overflow-hidden bg-transparent ${showFrame ? "rounded-[32px] border-4 border-ink" : ""} ${isAnimation ? "flex items-center justify-center" : ""}`}
            style={isAnimation ? { aspectRatio: "4 / 3" } : isCut ? { aspectRatio: "1 / 0.65", overflow: "hidden" } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`transition duration-500 ${isAnimation ? "max-w-full max-h-full w-auto h-auto object-contain" : `block w-full ${singleColumn ? "" : "group-hover:scale-[1.02]"} ${isCut ? "absolute inset-0 h-auto" : "h-auto"}`}`}
              src={item.image_url ?? "/mockups/northstar.svg"}
              alt={item.site_name ?? "Gallery image"}
              onLoad={handleImageLoad}
            />

            {/* 切れてるときのグラデーション */}
            {isCut && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bone to-transparent" />
            )}

            {/* サイトモードのホバーアイコン */}
            {isSiteMode && (
              <div className="absolute inset-0 flex items-start justify-end p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-acid text-white">
                  <Layers size={18} />
                </span>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* 比較モード: チェックアイコン */}
      {compareMode && (
        <button
          type="button"
          onClick={() => onOpen(item)}
          className={`absolute top-2 right-2 z-10 h-6 w-6 rounded-full flex items-center justify-center transition touch-manipulation ${isCompareSelected ? "bg-acid" : "bg-white/80 border border-black/10"}`}
        >
          {isCompareSelected && <X size={12} className="text-white" />}
        </button>
      )}

      {/* ハートボタン（比較モード時は非表示） */}
      {!compareMode && onFavoriteToggle && (
        <button
          type="button"
          onClick={() => onFavoriteToggle(String(item.id))}
          className="absolute bottom-10 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white touch-manipulation"
          aria-label="お気に入り"
        >
          <Heart
            size={15}
            className={isFavorite ? "fill-acid text-acid" : "text-black/30"}
          />
        </button>
      )}

      <div className="px-0 py-2">
        {item.site_url ? (
          <a
            href={item.site_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 truncate text-sm font-semibold hover:underline"
          >
            <span className="truncate">{item.site_name ?? "Untitled"}</span>
            <ArrowUpRight size={16} className="shrink-0 text-black/40" />
          </a>
        ) : (
          <p className="truncate text-sm font-semibold">
            {item.site_name ?? "Untitled"}
          </p>
        )}
      </div>
    </motion.article>
  );
}
