"use client";
import { useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    if (containerWidth === 0) return;
    const displayedHeight = (img.naturalHeight / img.naturalWidth) * containerWidth;
    setIsCut(displayedHeight > containerWidth * 0.65);
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
          ref={containerRef}
          className="relative w-full overflow-hidden bg-transparent"
          style={{ maxHeight: isCut ? "65cqw" : undefined, containerType: "inline-size" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="block h-auto w-full transition duration-500 group-hover:scale-[1.02]"
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
            className="block truncate text-sm font-black decoration-acid decoration-2 underline-offset-2 hover:underline"
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
