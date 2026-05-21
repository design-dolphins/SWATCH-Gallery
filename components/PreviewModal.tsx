"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Heart, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { colorMap } from "@/lib/constants";

type PreviewModalProps = {
  item: GalleryItem | null;
  onClose: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
};

export default function PreviewModal({ item, onClose, isFavorite, onFavoriteToggle }: PreviewModalProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const isSmartphone = ["スマホメニュー", "スマホKV"].includes(item?.category ?? "");
  const isAnimation = ["Button", "Big Button", "Title", "Hover", "Scroll UI"].includes(item?.category ?? "");
  const showFrame = isSmartphone && isPortrait;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setIsPortrait(img.naturalHeight / img.naturalWidth > 1);
  };

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
            className="grid max-h-[92vh] w-full max-w-6xl overflow-y-auto bg-bone shadow-soft lg:overflow-hidden lg:grid-cols-[1fr_360px]"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`overflow-y-auto bg-bone ${showFrame || isAnimation ? "flex items-center justify-center py-10" : ""}`} style={{ maxHeight: "92vh" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={showFrame ? "h-full w-auto max-h-[calc(92vh-80px)] rounded-[32px] border-4 border-ink" : isAnimation ? "block h-auto max-w-full mx-auto" : "block h-auto w-full"}
                src={item.image_url ?? "/mockups/northstar.svg"}
                alt={item.site_name ?? "Preview image"}
                onLoad={handleImageLoad}
              />
            </div>

            <aside className="flex max-h-[92vh] flex-col overflow-auto border-l border-black/10 p-5 sm:p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-black/42">
                    {item.category ?? "Reference"}
                  </p>
                  <h2 className="text-[24px] font-black leading-[1.25]">
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

              {item.industry && (
                <p className="mb-6 text-xs font-bold text-black/50">{item.industry}</p>
              )}
              <div>
                <p className="mb-2 text-[10px] font-black uppercase text-black/35">Taste</p>
                <div className="flex flex-wrap gap-2">
                {item.color && (
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink" key={item.color}>
                    {colorMap[item.color] && (
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded-full"
                        style={item.color === "カラフル"
                          ? { background: colorMap[item.color] }
                          : { backgroundColor: colorMap[item.color] }
                        }
                      />
                    )}
                    {item.color}
                  </span>
                )}
                {(item.taste ? item.taste.split(",").map(t => t.trim()).filter(Boolean) : []).map((badge) => (
                  <span
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink"
                    key={badge}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              </div>
              {item.font ? (
                <div className="mt-3">
                  <p className="mb-2 text-[10px] font-black uppercase text-black/35">Fonts</p>
                  <div className="flex flex-wrap gap-2">
                    {item.font.split(",").map(f => f.trim()).filter(Boolean).map((f) => (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink" key={f}>{f}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {item.memo ? (
                <p className="mt-6 border-y border-black/10 py-5 text-sm leading-7 text-black/68">
                  {item.memo}
                </p>
              ) : null}

              <div className="mt-6 flex items-center gap-2">
                {onFavoriteToggle && item && (
                  <button
                    type="button"
                    onClick={() => onFavoriteToggle(String(item.id))}
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 transition touch-manipulation ${isFavorite ? "border-acid bg-acid text-white" : "border-black/15 bg-white text-black/40 hover:border-acid hover:text-acid"}`}
                    aria-label="お気に入り"
                  >
                    <Heart size={18} className={isFavorite ? "fill-white" : ""} />
                  </button>
                )}
                {item.site_url ? (
                  <a
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-bone transition hover:bg-black"
                    href={item.site_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit site
                    <ExternalLink size={16} />
                  </a>
                ) : null}
              </div>
            </aside>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
