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
          <div className="absolute inset-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/76 via-black/12 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="flex flex-wrap gap-2">
              {isSiteMode ? (
                <span className="rounded-full bg-white/88 px-2.5 py-1 text-xs font-bold text-ink">
                  {partsCount} parts
                </span>
              ) : (
                badges.map((badge) => (
                  <span
                    className="rounded-full bg-white/88 px-2.5 py-1 text-xs font-bold text-ink"
                    key={badge}
                  >
                    {badge}
                  </span>
                ))
              )}
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acid text-ink">
              {isSiteMode ? <Layers size={16} /> : <ArrowUpRight size={18} />}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-black leading-tight">
                {item.site_name ?? "Untitled"}
              </p>
              <p className="mt-1 text-sm text-black/52">
                {isSiteMode
                  ? [item.industry, item.color].filter(Boolean).join(" / ") || "UI reference"
                  : [item.taste, item.font].filter(Boolean).join(" · ") ||
                    [item.industry, item.color].filter(Boolean).join(" / ") ||
                    "UI reference"}
              </p>
            </div>
            {item.featured ? (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-acid text-ink">
                <Star size={15} fill="currentColor" />
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-3">
            <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-bold text-black/62">
              {isSiteMode ? `${partsCount} parts →` : (item.category ?? "Other")}
            </span>
            {!isSiteMode && (
              <span className="text-xs font-semibold text-black/38">
                {formatDate(item.created_at)}
              </span>
            )}
          </div>
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
