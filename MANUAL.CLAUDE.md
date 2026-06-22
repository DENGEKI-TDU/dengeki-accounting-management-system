# dengeki-accounting-management-system ドキュメント

> **リポジトリ**: [DENGEKI-TDU/dengeki-accounting-management-system](https://github.com/DENGEKI-TDU/dengeki-accounting-management-system)  
> **デプロイ先**: https://account.dengeki-fox.net  
> **バージョン**: 1.2.0

---

## 目次

1. [システム概要](#1-システム概要)
2. [技術スタック](#2-技術スタック)
3. [リポジトリ構成](#3-リポジトリ構成)
4. [データベース設計](#4-データベース設計)
5. [API設計 (rewrites)](#5-api設計-rewrites)
6. [開発環境のセットアップ](#6-開発環境のセットアップ)
7. [環境変数](#7-環境変数)
8. [デプロイ方法](#8-デプロイ方法)
9. [サイトの使い方](#9-サイトの使い方)
10. [GitHub Actions](#10-github-actions)

---

## 1. システム概要

東京電機大学の学生団体「電気系サークル (DENGEKI)」向けの**会計管理システム**。収入・支出の報告、帳簿データの管理、Excelへの出力、Discord通知連携などを担う。

管理する予算の種類は以下の5種類：

| 識別子 | 名称 |
|---|---|
| `main` | 本予算 |
| `hatosai` | 鳩山祭援助金 |
| `clubsupport` | 後援会費 |
| `alumni` | 校友会費 |
| `aid` | 共済金 |

---

## 2. 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (Pages Router) |
| 言語 | TypeScript 5 |
| UIライブラリ | Chakra UI v2 + Framer Motion |
| 状態管理 | Jotai |
| ORM | Prisma 5 (PostgreSQL) |
| ファイルストレージ | Supabase Storage (領収書画像) |
| 認証 | 独自JWT (HMAC-SHA256、有効期限3時間) |
| HTTPクライアント | Axios |
| Excel出力 | ExcelJS |
| 画像カルーセル | Swiper |
| バックエンドAPI | 外部サービス `api.dengeki-fox.net` (このリポジトリには含まれない) |

---

## 3. リポジトリ構成

```
dengeki-accounting-management-system/
├── .github/workflows/
│   └── main.yml              # フォーク元から毎日自動同期するCI
│
├── prisma/
│   └── schema.prisma         # DBスキーマ定義 (PostgreSQL)
│
├── public/
│   ├── header.png            # サイトヘッダー画像
│   └── favicon.ico
│
├── src/
│   ├── components/           # 共通UIコンポーネント
│   │   ├── income.tsx        # 収入報告フォーム（全予算共通）
│   │   ├── outcome.tsx       # 支出報告フォーム（領収書画像アップロード含む）
│   │   ├── update.tsx        # 帳簿データ編集コンポーネント（管理者用）
│   │   └── knapsack.tsx      # ナップサック計算表示コンポーネント
│   │
│   ├── hooks/
│   │   └── UseLoginState.ts  # DengekiSSO フック (session/login/logout)
│   │
│   ├── lib/
│   │   ├── Dev.ts            # デバッグログユーティリティ
│   │   ├── jwt.ts            # JWT検証ロジック
│   │   ├── prisma.ts         # Prismaクライアントシングルトン
│   │   └── jotai/            # グローバルステート定義
│   │       ├── isLoginAtom.ts
│   │       ├── isAdminAtom.ts
│   │       ├── isDevAtom.ts
│   │       ├── loginNameAtom.ts
│   │       ├── knapSackAtom.ts
│   │       └── knapSackSelectDateAtom.ts
│   │
│   ├── pages/
│   │   ├── _app.tsx          # アプリルート（ヘッダー・ChakraProvider）
│   │   ├── _document.tsx
│   │   ├── index.tsx         # ホームページ（メニュー一覧）
│   │   ├── other.tsx         # 本予算以外の予算選択ページ
│   │   │
│   │   ├── login/
│   │   │   └── index.tsx     # ログインフォーム
│   │   │
│   │   ├── income/
│   │   │   └── index.tsx     # 本予算 収入報告
│   │   ├── outcome/
│   │   │   └── index.tsx     # 本予算 支出報告
│   │   │
│   │   ├── hatosai/
│   │   │   ├── index.tsx     # 鳩山祭 メニュー
│   │   │   ├── income.tsx
│   │   │   └── outcome.tsx
│   │   ├── clubsupport/
│   │   │   ├── index.tsx     # 後援会費 メニュー
│   │   │   ├── income.tsx
│   │   │   └── outcome.tsx
│   │   ├── alumni/
│   │   │   ├── index.tsx     # 校友会費 メニュー
│   │   │   ├── income.tsx
│   │   │   └── outcome.tsx
│   │   │
│   │   └── admin/
│   │       ├── index.tsx     # 管理者ダッシュボード（全予算の収支サマリー）
│   │       ├── generate.tsx  # Excel出力ページ
│   │       ├── edit.tsx      # 帳簿データ編集ページ
│   │       ├── discord.tsx   # DiscordスレッドID設定
│   │       └── KnapSack.tsx  # ナップサック計算ページ
│   │
│   └── styles/
│       └── globals.css
│
├── utils/supabase/
│   └── supabase.ts           # Supabaseクライアント初期化
│
├── next.config.mjs           # APIプロキシ (rewrites) 設定
├── package.json
└── tsconfig.json
```

### ページとルートの対応

| URL | 内容 | 権限 |
|---|---|---|
| `/` | ホーム（メニュー） | ログイン必須 |
| `/login` | ログインフォーム | 全員 |
| `/income` | 本予算 収入報告 | ログイン |
| `/outcome` | 本予算 支出報告 | ログイン |
| `/other` | 本予算以外の予算選択 | ログイン |
| `/hatosai` | 鳩山祭 収支メニュー | ログイン |
| `/hatosai/income` | 鳩山祭 収入報告 | ログイン |
| `/hatosai/outcome` | 鳩山祭 支出報告 | ログイン |
| `/clubsupport` | 後援会費 収支メニュー | ログイン |
| `/clubsupport/income` | 後援会費 収入報告 | ログイン |
| `/clubsupport/outcome` | 後援会費 支出報告 | ログイン |
| `/alumni` | 校友会費 収支メニュー | ログイン |
| `/alumni/income` | 校友会費 収入報告 | ログイン |
| `/alumni/outcome` | 校友会費 支出報告 | ログイン |
| `/admin` | 管理者ダッシュボード | 管理者 |
| `/admin/generate` | Excel出力 | 管理者 |
| `/admin/edit` | 帳簿データ編集 | 管理者 |
| `/admin/discord` | Discord設定 | 管理者 |
| `/admin/KnapSack` | ナップサック計算 | 管理者 |

---

## 4. データベース設計

`prisma/schema.prisma` で定義。接続先はPostgreSQL（環境変数 `DATABASE_URL`）。

### 会計テーブル（5種類）

各テーブルは同じカラム構成：

```
id           Int      (PK, autoincrement)
year         String   会計年度 (例: "2024")
date         DateTime 取引日
type         String   費目 (例: "大道具", "小道具", ...)
typeAlphabet String   費目の英字略称
subtype      String   サブ費目
fixture      String   摘要（取引内容）
income       Int      収入額
outcome      Int      支出額
```

テーブル名: `mainAccount` / `hatosaiAccount` / `clubsupportAccount` / `alumniAccount` / `aid`

### その他のテーブル

| テーブル名 | 用途 |
|---|---|
| `tokens` | JWTトークン管理（ユーザー・管理者フラグ、有効期限） |
| `users` | ユーザーアカウント（user/pass/isAdmin/isUser） |
| `oneTimeToken` | ワンタイムトークン |
| `accessHistory` | アクセス履歴 |
| `threadID` | Discord通知先スレッドIDの管理 |
| `accounting_queue` | 会計申請キュー（承認・支払・領収書取得ステータス付き） |

---

## 5. API設計 (rewrites)

このアプリはAPIを持たず、`next.config.mjs` の `rewrites` によって全てのAPIリクエストを外部バックエンド `api.dengeki-fox.net`（開発時は `localhost:3006`）にプロキシしている。

| フロントエンド側パス | バックエンド側パス | 機能 |
|---|---|---|
| `/api/session/login` | `/v1/session/login` | ログイン |
| `/api/session/logout` | `/v1/session/logout` | ログアウト |
| `/api/session/getSession` | `/v1/session/getSession` | セッション確認 |
| `/api/session/withPast` | `/v1/portal/account/getMembers` | メンバー一覧取得 |
| `/api/database/earnings` | `/v1/account/database/earnings` | 全予算収支サマリー取得 |
| `/api/database/get/{type}` | `/v1/account/database/get/{type}` | 帳簿一覧取得 |
| `/api/database/post-earnings/{type}/income` | 同左 | 収入データ登録 |
| `/api/database/post-earnings/{type}/outcome` | 同左 | 支出データ登録 |
| `/api/database/post-earnings/{type}/update` | 同左 | 帳簿データ更新 |
| `/api/database/post-earnings/{type}` | 同左 | 帳簿データ削除 |
| `/api/database/post-earnings/{from}/move/{to}` | 同左 | 予算間の資金移動 |
| `/api/database/generate/{type}` | 同左 | Excel生成用データ取得 |
| `/api/discord/send` | `/v1/account/discord/send` | Discord通知送信 |
| `/api/discord/getThreadID` | `/v1/account/discord/getThreadID` | スレッドID取得 |
| `/api/discord/updateThread` | `/v1/account/discord/updateThread` | スレッドID更新 |
| `/api/redirect/getToken` | `/redirect/getToken` | ポータルリダイレクトトークン取得 |

---

## 6. 開発環境のセットアップ

### 前提条件

- Node.js 20以上
- PostgreSQL（もしくはSupabase等）
- バックエンドAPI (`localhost:3006` で動作するサービスが別途必要)

### 手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/DENGEKI-TDU/dengeki-accounting-management-system.git
cd dengeki-accounting-management-system

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数を設定（次のセクション参照）
cp .env.example .env.local
# .env.local を編集

# 4. DBマイグレーション（初回）
npx prisma migrate dev
# または既存DBにスキーマを反映するだけの場合
npx prisma db push

# 5. 開発サーバー起動（ポート3001）
npm run dev
```

ブラウザで `http://localhost:3001` を開く。

### その他のコマンド

```bash
npm run build   # プロダクションビルド
npm run start   # プロダクションサーバー起動
npm run lint    # ESLintチェック
npx prisma studio  # DBのGUI管理ツール
```

---

## 7. 環境変数

`.env.local`（または `.env`）に以下を設定する：

| 変数名 | 説明 | 例 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL接続文字列 | `postgresql://user:pass@localhost:5432/dengeki` |
| `JWT_KEY` | JWT署名用秘密鍵 | `your-secret-key` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー | `eyJhbGci...` |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_URL` | Supabase ストレージの公開URL | `https://xxxx.supabase.co/storage/v1/object/public` |

> `NODE_ENV` が `production` の場合、APIは自動的に `https://api.dengeki-fox.net` に向く。

---

## 8. デプロイ方法

README ではVercelへのデプロイを推奨している。

### Vercelへのデプロイ（推奨）

1. [vercel.com](https://vercel.com) でプロジェクトをインポート
2. 上記の環境変数をVercelのダッシュボードで設定
3. `main` ブランチへのpushで自動デプロイされる

### その他のホスティング

```bash
npm run build
npm run start   # ポート3000で起動
```

---

## 9. サイトの使い方

### 共通：ログイン

1. `https://account.dengeki-fox.net/login` にアクセス
2. ID・パスワードを入力して「login」ボタンを押す
3. ログイン成功するとホームに遷移。ヘッダーに `Login as: [名前] (一般ユーザー または 管理者)` と表示される

---

### 一般ユーザー向け機能

#### 収入を報告する

ホーム → 「本予算収入報告」（または各予算の収入報告）

| 入力項目 | 説明 |
|---|---|
| 会計年度 | 4月始まり。3月以前は前年度扱いで自動設定される |
| 取得日 | 収入を得た日付 |
| 金額 | 収入金額（1円以上） |
| 受領者 | メンバーリストから選択（取得失敗時は手入力） |
| 収入事由 | 収入の理由・内容 |
| メモ | 備考 |

全項目入力後、「提出」ボタンが表示される。提出するとDBに保存され、Discordの対応スレッドに通知が飛ぶ。

#### 支出を報告する

ホーム → 「本予算支出報告」（または各予算の支出報告）

| 入力項目 | 説明 |
|---|---|
| 会計年度 | 上記同様 |
| 取得日 | 支出日 |
| 費目（type） | 大道具・小道具・衣装・照明・音響・庶務・その他 |
| サブ費目（subtype） | 詳細区分 |
| 金額 | 支出金額 |
| 購入者 | メンバーリストから選択 |
| 摘要 | 購入内容 |
| メモ | 備考 |
| 領収書画像 | Supabaseにアップロード。カルーセルで確認可能 |

#### 本予算以外の収支を報告する

ホーム → 「本予算以外の収支報告ページ」 → 該当する予算を選択

以下の3種類から選択：
- 鳩山祭関連（`/hatosai`）
- 後援会費関連（`/clubsupport`）
- 校友会費関連（`/alumni`）

各ページで収入・支出の報告ができる。

#### 会計の申請状況確認

ホームの「会計の申請状況確認ページ」リンクから、外部ポータル（`portal.dengeki-fox.net`）の申請確認ページにワンタイムトークン認証付きでリダイレクトされる。

---

### 管理者向け機能

管理者（isAdmin / isDev / isTreasurer）でログインすると、ホームに「管理者用ページ」リンクが表示される。

#### ① 管理者ダッシュボード (`/admin`)

全5種類の予算の現在の収支（収入・支出・残高）をリアルタイムで確認できる。残高がマイナスの場合は赤文字で強調表示される。

#### ② Excel出力 (`/admin/generate`)

指定した年度・予算種別の決算Excelファイルをブラウザ上で生成してダウンロードできる。ExcelJSを使用してクライアントサイドで生成する。

#### ③ 帳簿データ編集 (`/admin/edit?from=[type]`)

DBに登録された収支データの一覧を表形式で表示し、以下の操作が可能：
- **編集**: 費目・サブ費目・摘要を変更
- **移動**: 別の予算区分に帳簿エントリを移動（例：本予算→鳩山祭）
- **削除**: エントリの削除（確認ダイアログあり）

#### ④ Discord設定 (`/admin/discord`)

各予算区分のDiscord通知先スレッドIDを設定・更新できる。スレッドIDは19桁の数字で、入力値の長さを即時バリデーションして不正な場合は赤文字で警告する。

#### ⑤ ナップサック計算 (`/admin/KnapSack`)

予算の最適配分を計算するツール。ナップサック問題のアルゴリズムを用いて、申請された支出を予算内で最適に割り振るシミュレーションができる。

---

## 10. GitHub Actions

`.github/workflows/main.yml` で定義されたワークフロー。

**目的**: DENGEKI-TDUのフォークをフォーク元（`kimshun0213kr/dengeki-accounting-management-system`）と毎日同期し、上流の変更を自動的に取り込む。

```yaml
name: sync from beleth
on:
  schedule:
    - cron: '0 0 * * *'   # 毎日00:00 UTC に実行
  workflow_dispatch:        # 手動実行も可能

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: tgymnich/fork-sync@v1.9
        with:
          owner: kimshun0213kr
          repo: dengeki-accounting-management-system
          base: main
          head: main
```

手動でも実行可能（GitHubの「Actions」タブ → 「sync from beleth」→ 「Run workflow」）。