"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type PreviewModalProps = {
  item: GalleryItem | null;
  onClose: () => void;
};

export default function PreviewModal({ item, onClose }: PreviewModalProps) {
  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden bg-bone shadow-soft lg:grid-cols-[1fr_360px]"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-h-0 overflow-y-auto bg-bone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="block h-auto w-full"
                src={item.image_url ?? "/mockups/northstar.svg"}
                alt={item.site_name ?? "Preview image"}
              />
            </div>

            <aside className="flex max-h-[92vh] flex-col overflow-auto border-l border-black/10 p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-black/42">
                    {item.category ?? "Reference"}
                  </p>
                  <h2 className="text-3xl font-black leading-none">
                    {item.site_name ?? "Untitled"}
                  </h2>
                </div>
                <button
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 bg-white/70 transition hover:bg-white"
                  type="button"
                  onClick={onClose}
                  aria-label="閉じる"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ...[item.industry, item.color, item.taste].filter(Boolean) as string[],
                  ...(item.font_type ? item.font_type.split(",").map(f => f.trim()).filter(Boolean) : []),
                  ...(item.font ? item.font.split(",").map(f => f.trim()).filter(Boolean) : [])
                ].map((badge) => (
                  <span
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink"
                    key={badge}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {item.memo ? (
                <p className="mt-6 border-y border-black/10 py-5 text-sm leading-7 text-black/68">
                  {item.memo}
                </p>
              ) : null}

              <div className="mt-6 grid gap-3">
                {item.site_url ? (
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-bone transition hover:bg-black"
                    href={item.site_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit site
                    <ExternalLink size={16} />
                  </a>
                ) : null}
                <div className="rounded-[6px] border border-black/10 bg-white/55 p-4">
                  <p className="text-xs font-black uppercase text-black/38">
                    Related UI
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/62">
                    同じカテゴリ・業界・カラーで絞り込むと、関連UIをすぐ比較できます。
                  </p>
                </div>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
