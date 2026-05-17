# UI Vault

Awwwards風にUI参考を探索できるギャラリーサイトMVPです。

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- Supabase

## Setup

```bash
npm install
npm run dev
```

`.env.local` を作成します。

```env
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

Supabase SQL Editor で [supabase/schema.sql](./supabase/schema.sql) を実行してください。

## Update Flow

1. スクリーンショットを撮影
2. `/admin` で画像を選択
3. サイト名、URL、カテゴリ、業界、カラー、メモを入力
4. `Upload and add` でStorageアップロードとDB登録
5. サイトに自動反映

## galleries columns

| column | type |
| --- | --- |
| id | uuid |
| title | text |
| site_name | text |
| site_url | text |
| image_url | text |
| category | text |
| industry | text |
| color | text |
| memo | text |
| featured | boolean |
| created_at | timestamp |

Supabase未設定時はローカルのサンプルデータを表示します。
