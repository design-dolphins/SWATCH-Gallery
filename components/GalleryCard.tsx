"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  partsCount?: number;
  singleColumn?: boolean;
};

export default function GalleryCard({ item, onOpen, partsCount }: GalleryCardProps) {
  const isSiteMode = partsCount !== undefined;
  const [isCut, setIsCut] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // 縦横比が0.65を超える場合は切る
    setIsCut(img.naturalHeight / img.naturalWidth > 0.65);
  };

  return (
    <motion.article
      className="group overflow-hidden"
      whileHover={{ y: -4 }}
    >
      <button
        className="relative block w-full text-left"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`${item.site_name ?? item.title}の詳細を見る`}
      >
        <div
          className="relative w-full overflow-hidden bg-transparent"
          style={isCut ? { aspectRatio: "1 / 0.65", overflow: "hidden" } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`block w-full transition duration-500 group-hover:scale-[1.02] ${isCut ? "absolute inset-0 h-auto" : "h-auto"}`}
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
      </button>

      <div className="px-0 py-2">
        {item.site_url ? (
          <a
            href={item.site_url}
            target="_blank"
            rel="noreferrer"
            className="relative block truncate text-sm font-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-acid after:transition-all after:duration-300 hover:after:w-full"
          >
            {item.site_name ?? "Untitled"}
          </a>
        ) : (
          <p className="truncate text-sm font-black">
            {item.site_name ?? "Untitled"}
          </p>
        )}
      </div>
    </motion.article>
  );
}
