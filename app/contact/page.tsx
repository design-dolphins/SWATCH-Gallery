"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    await fetch("https://formspree.io/f/xeedelej", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-black/40 transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          ギャラリーに戻る
        </Link>

        <h1 className="mb-2 text-3xl font-black">お問い合わせ</h1>
        <p className="mb-8 text-sm leading-6 text-black/55">
          掲載内容の削除依頼・ご質問などはこちらからご連絡ください。
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 rounded-[12px] border border-black/10 bg-white p-10 text-center">
            <CheckCircle2 size={36} className="text-acid" />
            <p className="text-lg font-black">送信が完了しました</p>
            <p className="text-sm text-black/55">お問い合わせありがとうございます。内容を確認の上、ご連絡いたします。</p>
            <Link href="/" className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-bone transition hover:bg-black">
              ギャラリーに戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold">お名前</span>
              <input
                name="name"
                required
                className="h-12 rounded-[8px] border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/30"
                placeholder="山田 太郎"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">メールアドレス</span>
              <input
                name="email"
                type="email"
                required
                className="h-12 rounded-[8px] border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/30"
                placeholder="example@email.com"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">お問い合わせ種別</span>
              <select
                name="type"
                className="h-12 rounded-[8px] border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/30"
              >
                <option>掲載内容の削除依頼</option>
                <option>掲載内容の修正依頼</option>
                <option>仕事依頼</option>
                <option>その他のお問い合わせ</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">内容</span>
              <textarea
                name="message"
                required
                rows={5}
                className="rounded-[8px] border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                placeholder="お問い合わせ内容をご記入ください"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-bone transition hover:bg-black disabled:opacity-50"
            >
              {submitting ? "送信中..." : "送信する"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
