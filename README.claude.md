# でんげき会計管理システム (account-system)

> 2026-11 更新: 人向けの説明は [README.md](README.md)、変更の記録と要確認事項は [docs/MAINTENANCE.md](docs/MAINTENANCE.md)。主な違い:
> - Prisma は使わなくなった(DB へのアクセスは全て api 経由)。`prisma/`・`src/lib/prisma.ts`・`DATABASE_URL` は不要
> - ログイン確認は `src/components/session/LoginGate.tsx` を使う(各ページにコピーしない)
> - `next.config.mjs` の中継ルールはパターン(`:path*`)でまとめた。`npm run lint` は ESLint 10(`eslint.config.mjs`)

## 📋 プロジェクト概要

でんげきの会計を一元管理するシステム。収支の記録、決算書生成、Discord 連携による申請管理などを担う。

- **リポジトリ**: https://github.com/DENGEKI-TDU/dengeki-accounting-management-system
- **ポート**: 3001
- **フレームワーク**: Next.js 16.2.4（Pages Router）
- **言語**: TypeScript 5.x
- **React**: 18
- **UI**: Chakra UI 2.10.9
- **DB ORM**: Prisma 5.22.0（PostgreSQL）
- **認証**: Supabase（`@supabase/ssr`）
- **状態管理**: Jotai 2.15.0
- **ホスティング**: Vercel

## 🚀 セットアップ

```bash
npm install

touch .env
# Discord 劇部鯖 > シス管 > env-backup > account-system スレッドから内容をコピー
```

### 環境変数（`.env`）

Prisma 接続先、Supabase キー、その他認証情報が必要。  
詳細は Discord の env-backup を参照。

## 🔧 コマンド

```bash
npm run dev      # 開発サーバー起動（ポート 3001）
npm run build    # ビルド
npm start        # 本番起動
npm run lint     # ESLint 実行
```

## 📁 ディレクトリ構造

```
account-system/
├── src/
│   ├── components/
│   │   ├── income.tsx        # 収入フォームコンポーネント
│   │   ├── outcome.tsx       # 支出フォームコンポーネント
│   │   ├── update.tsx        # 更新コンポーネント
│   │   └── knapsack.tsx      # 仮払い（KnapSack）コンポーネント
│   ├── hooks/
│   │   └── UseLoginState.ts  # ログイン状態フック
│   ├── lib/
│   │   ├── Dev.ts
│   │   ├── jotai/            # グローバル状態 Atom
│   │   │   ├── isAdminAtom.ts
│   │   │   ├── isDevAtom.ts
│   │   │   ├── isLoginAtom.ts
│   │   │   ├── isTreasurerAtom.ts（相当）
│   │   │   ├── knapSackAtom.ts
│   │   │   ├── knapSackSelectDateAtom.ts
│   │   │   └── loginNameAtom.ts
│   │   ├── jwt.ts
│   │   └── prisma.ts
│   ├── pages/
│   │   ├── index.tsx          # ホーム（ダッシュボード）
│   │   ├── login/             # ログイン
│   │   ├── income/            # 収入報告（汎用）
│   │   ├── outcome/           # 支出報告（汎用）
│   │   ├── hatosai/           # 鳩山祭会計
│   │   │   ├── index.tsx
│   │   │   ├── income.tsx
│   │   │   └── outcome.tsx
│   │   ├── alumni/            # 同窓会会計
│   │   │   ├── index.tsx
│   │   │   ├── income.tsx
│   │   │   └── outcome.tsx
│   │   ├── clubsupport/       # クラブサポート会計
│   │   │   ├── index.tsx
│   │   │   ├── income.tsx
│   │   │   └── outcome.tsx
│   │   ├── admin/             # 管理者用ページ
│   │   │   ├── index.tsx
│   │   │   ├── edit.tsx       # データ編集
│   │   │   ├── generate.tsx   # 決算書生成
│   │   │   ├── KnapSack.tsx   # 仮払い管理
│   │   │   └── discord.tsx    # Discord 連携管理
│   │   └── other.tsx
│   └── styles/
│       └── globals.css
├── utils/
│   └── supabase/
│       └── supabase.ts        # Supabase クライアント
├── prisma/
│   └── schema.prisma
├── next.config.mjs            # API rewrites（→ api サーバー:3006）
└── tsconfig.json
```

## 🗄️ データベース（Prisma スキーマ）

会計種別ごとにテーブルが分かれている。api サーバーの `account.prisma` と同一スキーマ。

### 会計テーブル（共通フィールド）

```prisma
model mainAccount {        // 運営費
  id           Int      @id @default(autoincrement())
  year         String   // 会計年度 例: "2024"
  date         DateTime
  type         String   // 収支タイプ
  typeAlphabet String   // タイプの略称
  subtype      String   // サブタイプ
  fixture      String   // 摘要
  income       Int      // 収入額
  outcome      Int      // 支出額
}
// 同構造: hatosaiAccount / clubsupportAccount / alumniAccount / aid
```

### その他テーブル

```prisma
model tokens {           // 認証トークン管理
  tokens    String
  isUser    Boolean
  isAdmin   Boolean
  loginDate DateTime
  limit     DateTime
}

model users {            // ユーザー情報
  user    String
  pass    String
  isAdmin Boolean
  isUser  Boolean
}

model oneTimeToken {     // ワンタイムトークン
  token String
  limit DateTime
}

model accounting_queue { // 申請キュー（Discord 連携）
  created_at    DateTime
  income        Int
  outcome       Int
  hasApproved   Boolean  // Discord 👍 で更新
  hasPayment    Boolean  // Discord 💴 で更新
  hasGetReceipt Boolean  // Discord ✅ で更新
  name          String
  type          String
  link          String   // Discord メッセージリンク
  from          String   // 申請者
}

model threadID {         // Discord スレッド管理
  hookurl  String
  threadID String
  mode     String
}

model accessHistory {    // アクセス履歴（Watchdog 用）
  accessDate DateTime
}
```

## 🌐 API 連携（next.config.mjs の rewrites）

フロントエンドの `/api/*` リクエストは api サーバーへプロキシされる。

| フロントエンドパス | 転送先（api サーバー） |
|---|---|
| `/api/session/login` | `/v1/session/login` |
| `/api/session/logout` | `/v1/session/logout` |
| `/api/session/getSession` | `/v1/session/getSession` |
| `/api/database/earnings` | `/v1/account/database/earnings` |
| `/api/database/generate/{type}` | `/v1/account/database/generate/{type}` |
| `/api/database/get/{type}` | `/v1/account/database/get/{type}` |
| `/api/database/post-earnings/{type}/income` | `/v1/account/database/post-earnings/{type}/income` |
| `/api/database/post-earnings/{type}/outcome` | `/v1/account/database/post-earnings/{type}/outcome` |
| `/api/database/post-earnings/{type}/update` | `/v1/account/database/post-earnings/{type}/update` |
| `/api/database/post-earnings/{type}/move/{dest}` | `/v1/account/database/post-earnings/{type}/move/{dest}` |
| `/api/discord/getThreadID` | `/v1/account/discord/getThreadID` |
| `/api/discord/send` | `/v1/account/discord/send` |
| `/api/discord/updateThread` | `/v1/account/discord/updateThread` |
| `/api/redirect/getToken` | `/redirect/getToken` |

- 本番環境: `https://api.dengeki-fox.net`
- 開発環境: `http://localhost:3006`

## 💰 会計種別

| 種別 | URL パス | テーブル |
|---|---|---|
| 運営費 | `/` `/income` `/outcome` | `mainAccount` |
| 鳩山祭 | `/hatosai` | `hatosaiAccount` |
| 同窓会 | `/alumni` | `alumniAccount` |
| クラブサポート | `/clubsupport` | `clubsupportAccount` |
| 援助 | （管理者画面経由） | `aid` |

## 🤝 Discord 申請フロー

1. メンバーが会計システムから申請（Discord のスレッドにメッセージ投稿）
2. 申請データが `accounting_queue` テーブルに記録される
3. Discord 上でリアクションをつけると api サーバーの Bot がステータスを更新：
   - 👍 → `hasApproved = true`（承認済み）
   - 💴 → `hasPayment = true`（支払い済み）
   - ✅ → `hasGetReceipt = true`（領収書取得済み）
4. 3つ揃うと `accounting_queue` から自動削除

## 📦 主要パッケージ

| パッケージ | バージョン | 用途 |
|---|---|---|
| next | 16.2.4 | フレームワーク |
| @chakra-ui/react | 2.10.9 | UI コンポーネント |
| @prisma/client | 5.22.0 | ORM |
| @supabase/ssr | latest | Supabase 認証 |
| @supabase/supabase-js | latest | Supabase クライアント |
| exceljs | 4.4.0 | Excel 決算書生成 |
| jotai | 2.15.0 | 状態管理 |
| swiper | 12.1.3 | スライダー |
| uuid | 14.0.0 | ID 生成 |
| axios | 1.15.2 | HTTP クライアント |

## 🚢 デプロイ

Vercel に `main` ブランチへのマージをトリガーとして自動デプロイ。  
PR は必ずでんげきの git アカウントで承認すること。

## 📞 サポート

Discord 劇部鯖 > #シス管
