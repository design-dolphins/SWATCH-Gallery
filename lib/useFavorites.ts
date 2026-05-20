"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "swatch-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // 読み込み失敗時は空のまま
    }
  }, []);

  const toggle = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 保存失敗時は無視
      }
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggle, isFavorite };
}
