export const categoryGroups = [
  {
    label: "メイン",
    items: ["KV", "第二階層KV", "フッター"]
  },
  {
    label: "会社情報",
    items: [
      "concept/About",
      "3つの特徴・強み",
      "ネガティブ訴求・課題",
      "代表メッセージ",
      "スタッフ紹介",
      "沿革",
      "グループ/パートナー",
      "採用関連",
      "店舗情報",
      "アクセス/MAP",
      "MVV",
      "会社概要",
      "IR関連",
      "事業内容"
    ]
  },
  {
    label: "事業・提供価値",
    items: [
      "サービス",
      "商品",
      "料金",
      "おすすめシーン",
      "NEWS/ブログ",
      "STEP/FLOW",
      "導入事例・お客様の声",
      "スケジュール",
      "専門家・データ",
      "FAQ",
      "お問い合わせ",
      "実績"
    ]
  },
  {
    label: "パーツ",
    items: [
      "カード・リスト",
      "スライダー",
      "インフォグラフィック/図解",
      "CTA",
      "数字で見る",
      "資料・PDF"
    ]
  },
  {
    label: "共通・導線",
    items: [
      "タグメニュー",
      "ドロワー・メガメニュー",
      "モーダル",
      "パンくず",
      "下層ページナビ",
      "検索",
      "フロアマップ"
    ]
  },
  {
    label: "スマホ",
    items: ["スマホKV", "モバイルファースト", "スマホメニュー"]
  },
  {
    label: "ポートフォリオ",
    items: ["About", "Footer", "Work", "FV", "Contact"]
  },
  {
    label: "UI",
    items: [
      "新規登録",
      "ログイン",
      "ホーム",
      "検索",
      "マイページ/プロフィール",
      "メッセージ/お知らせ",
      "お気に入り/ブックマーク"
    ]
  }
];

export const categories = [
  "All",
  ...categoryGroups.flatMap((group) => group.items)
];

export const industries = [
  "飲食・フード",
  "ファッション・コスメ・雑貨",
  "宿泊・観光・レジャー",
  "美容室・フィットネス",
  "医療・ヘルスケア",
  "企業・ブランド（コーポレート）",
  "採用・インナーブランディング",
  "IT・テクノロジー",
  "人材・教育・金融",
  "クリエイティブ・制作",
  "建築・不動産・ものづくり",
  "その他"
];

export const colorMap: Record<string, string> = {
  "黒": "#111111",
  "青": "#2563EB",
  "緑": "#16A34A",
  "赤": "#DC2626",
  "オレンジ": "#EA580C",
  "ピンク": "#DB2777",
  "黄色": "#EAB308",
  "ベージュ": "#C4A882",
  "ブラウン": "#7C3B1E",
  "パープル": "#7C3AED",
  "グレー": "#6B7280",
  "白": "#F0F0F0",
  "カラフル": "linear-gradient(135deg, #DC2626, #EA580C, #EAB308, #16A34A, #2563EB, #7C3AED)",
};

export const colors = [
  "黒",
  "青",
  "緑",
  "赤",
  "オレンジ",
  "ピンク",
  "黄色",
  "ベージュ",
  "ブラウン",
  "パープル",
  "グレー",
  "白",
  "カラフル"
];

export const tastes = [
  "simple",
  "monotone",
  "pop",
  "cute",
  "stylish",
  "young",
  "rétro",
  "future",
  "luxury",
  "natural",
  "bold",
  "elegant",
  "traditional",
];

export const tasteLabels: Record<string, string> = {
  simple: "シンプル",
  monotone: "モノトーン",
  pop: "ポップ",
  cute: "かわいい",
  stylish: "スタイリッシュ",
  young: "若い",
  "rétro": "レトロ",
  future: "未来的",
  luxury: "高級感",
  natural: "ナチュラル",
  bold: "力強い",
  elegant: "上品",
  traditional: "和・伝統",
};

export const fontTypes = [
  "日本語ゴシック",
  "日本語明朝",
  "欧文セリフ",
  "欧文サンセリフ",
  "手書き"
];

export const englishFonts = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Source Sans Pro',
  'Raleway', 'Nunito', 'Ubuntu', 'Playfair Display', 'Merriweather', 'PT Serif',
  'Lora', 'Crimson Text', 'EB Garamond', 'Cormorant Garamond', 'DM Serif Display',
  'Bebas Neue', 'Oswald', 'Barlow', 'Barlow Condensed', 'Space Grotesk', 'Space Mono',
  'DM Sans', 'DM Mono', 'Manrope', 'Outfit', 'Plus Jakarta Sans', 'Figtree',
  'Geist', 'Geist Mono', 'IBM Plex Sans', 'IBM Plex Mono', 'IBM Plex Serif',
  'Fira Code', 'JetBrains Mono', 'Source Code Pro',
  'Archivo', 'Archivo Black', 'Cabin', 'Karla', 'Rubik', 'Work Sans',
  'Mulish', 'Quicksand', 'Josefin Sans', 'Josefin Slab',
  'Libre Baskerville', 'Libre Franklin', 'Spectral', 'Alegreya',
  'Anton', 'Teko', 'Exo', 'Exo 2', 'Rajdhani', 'Oxanium',
  'Montserrat Alternates', 'Albert Sans', 'Syne', 'Unbounded',
  'sans-serif', 'serif', 'monospace',
];

export const japaneseFonts = [
  'Noto Sans JP', 'Noto Serif JP', 'Zen Kaku Gothic Antique', 'Zen Old Mincho',
  'Zen Maru Gothic', 'Zen Kurenaido', 'M PLUS Rounded 1c', 'M PLUS 1p', 'M PLUS 1',
  'Sawarabi Gothic', 'Sawarabi Mincho', 'Kosugi Maru', 'Kosugi', 'Shippori Mincho',
  'BIZ UDPGothic', 'BIZ UDGothic', 'BIZ UDMincho', 'Klee One', 'Dela Gothic One',
  'Hachi Maru Pop', 'Rampart One', 'Stick', 'Train One', 'DotGothic16', 'Reggae One',
  'Rocknroll One', 'Yomogi', 'Yuji Syuku', 'Yuji Boku', 'Yuji Mai', 'Hina Mincho',
  'Kaisei Decol', 'Kaisei HarunoUmi', 'Kaisei Opti', 'Kaisei Tokumin', 'Murecho',
  'Albert Sans', 'Zen Antique', 'Shippori Antique', 'Palette Mosaic',
  'Mochiy Pop One', 'Mochiy Pop P One', 'Potta One', '游ゴシック', '游ゴシック体', '游明朝',
];
