"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
    setLoading(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-bone px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/favicon.svg" alt="SWATCH Gallery" className="mx-auto mb-4 h-14 w-14" />
          <h1 className="text-2xl font-black">Admin Login</h1>
          <p className="mt-1 text-sm text-black/45">SWATCH Gallery</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="border border-black/10 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold">メールアドレス</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-[6px] border border-black/10 bg-bone px-3 text-sm outline-none focus:border-black/30"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">パスワード</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-[6px] border border-black/10 bg-bone px-3 text-sm outline-none focus:border-black/30"
                placeholder="••••••••"
                required
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-[6px] border border-red-500/30 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-bold text-bone transition hover:bg-black disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={17} /> : null}
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </main>
  );
}
