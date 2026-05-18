import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "SWATCH Gallery",
  description: "パーツ別・業界別・カラー別で絞れるUIギャラリーサイト",
  icons: {
    icon: "/favicon.svg",
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className="border-t border-black/08 px-6 py-5 text-center text-xs text-black/35">
          本サイトは参考目的のUIギャラリーです。掲載している画像・デザインの著作権は各サイトの運営者に帰属します。
        </footer>
      </body>
    </html>
  );
}
