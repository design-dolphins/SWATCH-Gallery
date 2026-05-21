import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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

        <h1 className="mb-2 text-3xl font-black">利用規約</h1>
        <p className="mb-10 text-sm text-black/40">最終更新日：2026年5月21日</p>

        <div className="grid gap-8 text-sm leading-7 text-black/70">
          <section>
            <h2 className="mb-3 text-base font-black text-ink">1. サービスについて</h2>
            <p>SWATCH Gallery（以下「本サイト」）は、Webデザインの参考・学習を目的としたUIギャラリーサービスです。掲載しているスクリーンショットは、各Webサイトのデザインを参考目的で紹介するものです。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">2. 著作権について</h2>
            <p>本サイトに掲載しているスクリーンショット・デザインの著作権は、各サイトの運営者に帰属します。本サイトはデザインの参考・学習目的での掲載であり、各デザインの権利を主張するものではありません。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">3. 禁止事項</h2>
            <p>本サイトを利用するにあたり、以下の行為を禁止します。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>掲載コンテンツの商用利用</li>
              <li>掲載デザインの無断複製・転用</li>
              <li>その他法令または公序良俗に違反する利用</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">4. 掲載削除依頼について</h2>
            <p>掲載内容に関するお問い合わせ・削除依頼は、<Link href="/contact" className="underline underline-offset-2">お問い合わせフォーム</Link>よりご連絡ください。内容を確認の上、7営業日以内に対応いたします。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">5. 免責事項</h2>
            <p>本サイトに掲載する情報は参考目的であり、内容の正確性・最新性を保証するものではありません。掲載情報の利用によって生じたいかなる損害についても、本サイトは責任を負いかねます。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-black text-ink">6. 規約の変更</h2>
            <p>本規約は必要に応じて予告なく変更する場合があります。変更後の規約は本ページに掲載した時点で効力を生じるものとします。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
