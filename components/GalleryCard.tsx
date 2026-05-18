"use client";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  partsCount?: number;
  singleColumn?: boolean;
};

export default function GalleryCard({ item, onOpen, partsCount, singleColumn }: GalleryCardProps) {
  const isSiteMode = partsCount !== undefined;

  return (
    <motion.article
      className="group overflow-hidden"
      whileHover={{ y: -4 }}
    >
      {/* 画像 → 詳細モーダル or サイト展開 */}
      <button
        className="relative block w-full text-left"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`${item.site_name ?? item.title}の詳細を見る`}
      >
        <div className={`relative overflow-hidden bg-transparent ${singleColumn ? "flex justify-center" : "aspect-[16/10]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`transition duration-500 group-hover:scale-[1.02] ${singleColumn ? "h-auto max-w-full" : "absolute inset-0 h-full w-full object-contain object-top"}`}
            src={item.image_url ?? "/mockups/northstar.svg"}
            alt={item.site_name ?? "Gallery image"}
          />
          {isSiteMode && (
            <div className="absolute inset-0 flex items-start justify-end p-4 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-acid text-white">
                <Layers size={18} />
              </span>
            </div>
          )}
        </div>
      </button>

      {/* タイトル → サイトへ飛ぶ */}
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
