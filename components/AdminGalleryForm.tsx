"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronDown, ImagePlus, Loader2, LogOut } from "lucide-react";
import { categoryGroups, colors, englishFonts, fontTypes, industries, japaneseFonts, tastes } from "@/lib/constants";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

async function handleLogout() {
  if (supabase) await supabase.auth.signOut();
}

const bucketName = "gallery-images";
const lastGalleryInputKey = "ui-vault-last-gallery-input";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export default function AdminGalleryForm() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [category, setCategory] = useState("KV");
  const [industry, setIndustry] = useState(industries[0]);
  const [color, setColor] = useState(colors[0]);
  const [taste, setTaste] = useState(tastes[0]);
  const [fontJp, setFontJp] = useState("");
  const [fontEn, setFontEn] = useState("");
  const [fontTypes_, setFontTypes_] = useState<string[]>([]);
  const [registeredFonts, setRegisteredFonts] = useState<{ jp: string[]; en: string[] }>({ jp: [], en: [] });
  const [memo, setMemo] = useState("");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<Status>({
    type: "idle",
    message: ""
  });

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  // DB登録済みフォントを取得
  useEffect(() => {
    if (!supabase) return;
    supabase.from("galleries").select("font").then(({ data }) => {
      const all = new Set<string>();
      data?.forEach(item => {
        item.font?.split(",").map((f: string) => f.trim()).filter(Boolean).forEach((f: string) => all.add(f));
      });
      const jp = Array.from(all).filter(f => japaneseFonts.includes(f)).sort();
      const en = Array.from(all).filter(f => !japaneseFonts.includes(f)).sort();
      setRegisteredFonts({ jp, en });
    });
  }, []);

  useEffect(() => {
    const savedInput = window.localStorage.getItem(lastGalleryInputKey);
    if (!savedInput) return;
    try {
      const parsedInput = JSON.parse(savedInput) as {
        siteName?: string;
        siteUrl?: string;
        industry?: string;
        color?: string;
        taste?: string;
        font?: string;
        fontJp?: string;
        fontEn?: string;
      };
      setSiteName(parsedInput.siteName ?? "");
      setSiteUrl(parsedInput.siteUrl ?? "");
      setIndustry(parsedInput.industry ?? industries[0]);
      setColor(parsedInput.color ?? colors[0]);
      setTaste(parsedInput.taste ?? tastes[0]);
      setFontJp(parsedInput.fontJp ?? "");
      setFontEn(parsedInput.fontEn ?? "");
    } catch {
      window.localStorage.removeItem(lastGalleryInputKey);
    }
  }, []);

  // フォント入力からフォント種別を自動検出
  useEffect(() => {
    const detected: string[] = [];

    if (fontJp) {
      const fonts = fontJp.split(",").map(f => f.trim()).filter(Boolean);
      const hasMingho = fonts.some(f =>
        /明朝|mincho|serif|old|antique|syuku|boku|mai|hina|kaisei|shippori|alegreya|crimson|spectral/i.test(f)
      );
      if (hasMingho) detected.push("日本語明朝");
      const hasGothic = fonts.some(f => japaneseFonts.includes(f) && !/明朝|mincho/i.test(f));
      if (hasGothic || (fonts.length > 0 && !hasMingho)) detected.push("日本語ゴシック");
    }

    if (fontEn) {
      const fonts = fontEn.split(",").map(f => f.trim()).filter(Boolean);
      const serifKeywords = /serif|garamond|baskerville|times|georgia|playfair|merriweather|lora|crimson|cormorant|spectral|alegreya|libre baskerville|pt serif|eb garamond/i;
      const hasSerif = fonts.some(f => serifKeywords.test(f));
      if (hasSerif) detected.push("欧文セリフ");
      const hasSans = fonts.some(f => !serifKeywords.test(f));
      if (hasSans) detected.push("欧文サンセリフ");
    }

    if (detected.length > 0) {
      setFontTypes_(prev => {
        const merged = Array.from(new Set([...prev, ...detected]));
        return merged;
      });
    }
  }, [fontJp, fontEn]);

  const saveGallery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      setStatus({
        type: "error",
        message: ".env.local のSupabase設定がまだ読み込まれていません。"
      });
      return;
    }

    if (!file) {
      setStatus({ type: "error", message: "画像ファイルを選んでください。" });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeBase = slugify(siteName || category || "gallery");
    const storagePath = `${Date.now()}-${safeBase}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setIsSaving(false);
      setStatus({
        type: "error",
        message: `画像アップロードに失敗しました: ${uploadError.message}`
      });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const { error: insertError } = await supabase.from("galleries").insert({
      site_name: siteName,
      site_url: siteUrl,
      image_url: publicUrlData.publicUrl,
      category,
      industry,
      color,
      taste,
      font: [fontJp, fontEn].filter(Boolean).join(","),
      font_type: fontTypes_.join(","),
      memo,
      featured
    });

    setIsSaving(false);

    if (insertError) {
      setStatus({
        type: "error",
        message: `DB登録に失敗しました: ${insertError.message}`
      });
      return;
    }

    window.localStorage.setItem(
      lastGalleryInputKey,
      JSON.stringify({ siteName, siteUrl, industry, color, taste, fontJp, fontEn, fontTypes_: fontTypes_.join(",") })
    );
    setStatus({
      type: "success",
      message: "追加できました。サイト名・URL・業界・カラー・テイスト・フォントは次の登録にも引き継ぎます。"
    });
    setCategory("KV");
    setMemo("");
    setFeatured(false);
    setFile(null);
  };

  return (
    <main className="min-h-screen bg-bone px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold transition hover:border-black/30"
            href="/"
          >
            <ArrowLeft size={16} />
            Gallery
          </Link>
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-black/45">Admin Upload</p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black/50 transition hover:border-black/30 hover:text-ink"
            >
              <LogOut size={13} />
              ログアウト
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <form
            className="border border-black/10 bg-white p-5 shadow-sm sm:p-6"
            onSubmit={saveGallery}
          >
            <div className="mb-6">
              <p className="text-sm font-black uppercase text-black/42">
                New Reference
              </p>
              <h1 className="mt-2 text-4xl font-black leading-none">
                Upload once. No URL copy.
              </h1>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold">画像</span>
                <input
                  className="rounded-[6px] border border-black/10 bg-bone p-3 text-sm"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </label>

              <TextInput label="サイト名" value={siteName} onChange={setSiteName} />
              <TextInput
                label="サイトURL"
                value={siteUrl}
                onChange={setSiteUrl}
                placeholder="https://example.com"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold">カテゴリ</span>
                  <div className="relative">
                    <select
                      className="h-12 w-full appearance-none rounded-[6px] border border-black/10 bg-bone px-3 pr-8 text-sm font-semibold outline-none focus:border-black/30"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    >
                      {categoryGroups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.items.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-black/40" />
                  </div>
                </label>
                <SelectInput
                  label="業界"
                  value={industry}
                  onChange={setIndustry}
                  options={industries}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectInput
                  label="カラー"
                  value={color}
                  onChange={setColor}
                  options={colors}
                />
                <SelectInput
                  label="テイスト"
                  value={taste}
                  onChange={setTaste}
                  options={tastes}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FontInput
                  label="日本語フォント名"
                  value={fontJp}
                  onChange={setFontJp}
                  placeholder="Noto Sans JP"
                  suggestions={registeredFonts.jp.length ? registeredFonts.jp : japaneseFonts}
                />
                <FontInput
                  label="英語フォント名"
                  value={fontEn}
                  onChange={setFontEn}
                  placeholder="Poppins"
                  suggestions={registeredFonts.en.length ? registeredFonts.en : englishFonts}
                />
                <div className="grid gap-2">
                  <span className="text-sm font-bold">フォント種別（複数選択可）</span>
                  <div className="flex flex-wrap gap-2">
                    {fontTypes.map((ft) => (
                      <label key={ft} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fontTypes_.includes(ft)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFontTypes_([...fontTypes_, ft]);
                            } else {
                              setFontTypes_(fontTypes_.filter(f => f !== ft));
                            }
                          }}
                        />
                        <span className="text-sm">{ft}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 self-end rounded-[6px] border border-black/10 bg-bone px-3 py-3">
                  <input
                    checked={featured}
                    type="checkbox"
                    onChange={(event) => setFeatured(event.target.checked)}
                  />
                  <span className="text-sm font-bold">おすすめにする</span>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold">メモ</span>
                <textarea
                  className="min-h-28 rounded-[6px] border border-black/10 bg-bone p-3 text-sm leading-6 outline-none focus:border-black/30"
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  placeholder="どこが参考になるかメモ"
                />
              </label>
            </div>

            {status.message ? (
              <div
                className={`mt-5 rounded-[6px] border p-4 text-sm font-semibold ${
                  status.type === "success"
                    ? "border-green-500/30 bg-green-50 text-green-700"
                    : "border-red-500/30 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <button
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-bone transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={17} /> : null}
              {isSaving ? "Saving..." : "Upload and add"}
            </button>
          </form>

          <aside className="border border-black/10 bg-white p-4 shadow-sm">
            <div className="grid min-h-[360px] place-items-center overflow-hidden bg-bone">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="h-full max-h-[620px] w-full object-contain"
                  src={previewUrl}
                  alt="Preview"
                />
              ) : (
                <div className="text-center text-black/38">
                  <ImagePlus className="mx-auto mb-3" size={38} />
                  <p className="text-sm font-bold">画像プレビュー</p>
                </div>
              )}
            </div>
            <div className="mt-4 rounded-[6px] border border-black/10 bg-bone p-4 text-sm leading-6 text-black/58">
              <CheckCircle2 className="mb-2 text-green-600" size={18} />
              この画面では画像URLをコピーしません。ファイル選択だけで
              StorageアップロードとDB登録をまとめて行います。
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FontInput({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <input
        className="h-12 w-full rounded-[6px] border border-black/10 bg-bone px-3 text-sm font-semibold outline-none focus:border-black/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder = "",
  suggestions = []
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const listId = suggestions.length ? `datalist-${label.replace(/\s/g, "")}` : undefined;
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <input
        className="h-12 rounded-[6px] border border-black/10 bg-bone px-3 text-sm outline-none focus:border-black/30"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        list={listId}
      />
      {listId && (
        <datalist id={listId}>
          {suggestions.map((s) => <option key={s} value={s} />)}
        </datalist>
      )}
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <div className="relative">
        <select
          className="h-12 w-full appearance-none rounded-[6px] border border-black/10 bg-bone px-3 pr-8 text-sm font-semibold outline-none focus:border-black/30"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-black/40" />
      </div>
    </label>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
