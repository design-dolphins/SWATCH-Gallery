"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  partsCount?: number;
};

export default function GalleryCard({ item, onOpen, partsCount }: GalleryCardProps) {
  const isSiteMode = partsCount !== undefined;

  return (
    <motion.article
      className="group overflow-hidden border border-black/10 shadow-sm transition-shadow hover:shadow-soft"
      whileHover={{ y: -4 }}
    >
      {/* 画像 → 詳細モーダル or サイト展開 */}
      <button
        className="relative block w-full text-left"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`${item.site_name ?? item.title}の詳細を見る`}
      >
        <div className="relative overflow-hidden bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            src={item.image_url ?? "/mockups/northstar.svg"}
            alt={item.site_name ?? "Gallery image"}
          />
          <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acid text-ink">
              {isSiteMode ? <Layers size={16} /> : <ArrowUpRight size={18} />}
            </span>
          </div>
        </div>
      </button>

      {/* タイトル → サイトへ飛ぶ（背景なし） */}
      <div className="px-3 py-2">
        {item.site_url ? (
          <a
            href={item.site_url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm font-black hover:underline"
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
