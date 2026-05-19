import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-black/40 transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          ギャラリーに戻る
        </Link>

        <h1 className="mb-2 text-3xl font-black">プライバシーポリシー</h1>
        <p className="mb-10 text-sm text-black/40">最終更新日：2026年5月20日</p>

        <div className="grid gap-8 text-sm leading-7 text-black/70">
          <section>
            <h2 className="mb-3 text-base font-black text-ink">1. 収集する情報</h2>
            <p>本サイト（SWATCH Gallery）では、お問い合わせフォームをご利用いただく際に、以下の情報を収集します。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>お名前</li>
              <li>メールアドレス</li>
              <li>お問い合わせ内容</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">2. 利用目的</h2>
            <p>収集した情報は、お問い合わせへの回答・対応のみに使用します。第三者への提供や販売は行いません。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">3. 第三者サービス</h2>
            <p>本サイトでは以下の外部サービスを利用しています。各サービスのプライバシーポリシーもご確認ください。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li><a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noreferrer" className="underline underline-offset-2">Formspree</a>（お問い合わせフォーム）</li>
              <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="underline underline-offset-2">Vercel</a>（ホスティング）</li>
              <li><a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-2">Supabase</a>（データベース）</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">4. 掲載コンテンツについて</h2>
            <p>本サイトに掲載されているWebサイトのスクリーンショットおよびデザインの著作権は、各サイトの運営者に帰属します。掲載内容の削除・修正をご希望の場合は、お問い合わせフォームよりご連絡ください。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">5. お問い合わせ</h2>
            <p>プライバシーポリシーに関するご質問は、<Link href="/contact" className="underline underline-offset-2">お問い合わせフォーム</Link>よりご連絡ください。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
