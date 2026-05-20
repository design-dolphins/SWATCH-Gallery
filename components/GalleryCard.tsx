"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Heart, Layers } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  partsCount?: number;
  singleColumn?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
};

export default function GalleryCard({ item, onOpen, partsCount, singleColumn, isFavorite, onFavoriteToggle }: GalleryCardProps) {
  const isSiteMode = partsCount !== undefined;
  const [isCut, setIsCut] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const isSmartphone = ["モバイルファースト", "スマホメニュー", "スマホKV"].includes(item.category ?? "");

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalHeight / img.naturalWidth;
    setIsPortrait(ratio > 1);
    // スマホカテゴリはカットしない・それ以外は65%超えたらカット
    setIsCut(!isSmartphone && ratio > 0.65);
  };

  const showFrame = isSmartphone && isPortrait;

  return (
    <motion.article
      className={`group ${showFrame ? "mx-auto w-full max-w-[260px]" : ""}`}
      whileHover={singleColumn ? {} : { y: -4 }}
    >
      <button
        className="relative block w-full text-left"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`${item.site_name ?? item.title}の詳細を見る`}
      >
        {/* スマホモック用の外枠 */}
        <div className={showFrame ? "p-2 bg-transparent" : ""}>
          <div
            className={`relative w-full overflow-hidden bg-transparent ${showFrame ? "rounded-[32px] border-4 border-ink" : ""}`}
            style={isCut ? { aspectRatio: "1 / 0.65", overflow: "hidden" } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`block w-full transition duration-500 ${singleColumn ? "" : "group-hover:scale-[1.02]"} ${isCut ? "absolute inset-0 h-auto" : "h-auto"}`}
              src={item.image_url ?? "/mockups/northstar.svg"}
              alt={item.site_name ?? "Gallery image"}
              onLoad={handleImageLoad}
            />

            {/* 切れてるときのグラデーション */}
            {isCut && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bone to-transparent" />
            )}

            {/* ハートボタン */}
            {onFavoriteToggle && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onFavoriteToggle(String(item.id)); }}
                className="absolute bottom-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white touch-manipulation"
                aria-label="お気に入り"
              >
                <Heart
                  size={15}
                  className={isFavorite ? "fill-acid text-acid" : "text-black/30"}
                />
              </button>
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

      <div className="px-0 py-2">
        {item.site_url ? (
          <a
            href={item.site_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 truncate text-sm font-semibold hover:underline"
          >
            <span className="truncate">{item.site_name ?? "Untitled"}</span>
            <ExternalLink size={12} className="shrink-0 text-black/40" />
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
