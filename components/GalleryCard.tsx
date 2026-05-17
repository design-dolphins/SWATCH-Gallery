"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Layers, Star } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  partsCount?: number;
};

export default function GalleryCard({ item, onOpen, partsCount }: GalleryCardProps) {
  const isSiteMode = partsCount !== undefined;
  const badges = [item.industry, item.color].filter(Boolean);

  return (
    <motion.article
      className="group overflow-hidden border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-soft"
      whileHover={{ y: -4 }}
    >
      <button
        className="block w-full text-left"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`${item.site_name ?? item.title}を開く`}
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
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acid text-ink">
              {isSiteMode ? <Layers size={16} /> : <ArrowUpRight size={18} />}
            </span>
          </div>
        </div>

        <div className="p-3">
        <p className="truncate text-sm font-black">
          {item.site_name ?? "Untitled"}
        </p>
      </div>
      </button>
    </motion.article>
  );
}

function formatDate(value: string | null) {
  if (!value) return "New";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
