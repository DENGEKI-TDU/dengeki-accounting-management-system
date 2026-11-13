# でんげき会計システム (account-system)

部の会計(本予算・鳩山祭援助金・校友会費・後援会費)の収入・支出を申請・管理する Web アプリです。
Next.js 16(Pages Router)+ Chakra UI v2。データの読み書きはすべてバックエンド API(apps/api)経由で行います。

- リポジトリ: https://github.com/DENGEKI-TDU/dengeki-accounting-management-system
- 開発時の URL: http://localhost:3001
- 変更の記録・要確認事項: [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md)
- AI コーディング支援向けの補足: [`README.claude.md`](README.claude.md)

## セットアップ

```bash
npm install
cp .env.example .env   # 値は Discord「劇部鯖 > シス管 > env-backup > account-system」
npm run dev            # http://localhost:3001
```

ログイン・会計データの表示など、ほとんどの機能は **API サーバー(apps/api, http://localhost:3006)が起動していないと動きません**。
モノレポ(dengeki-apps)のルートで `npm run start-all -- api account-system` を実行すると両方まとめて起動できます。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` / `npm start` | 本番ビルド / 起動 |
| `npm run lint` | ESLint(警告は少しずつ減らしていく) |
| `npm run typecheck` | 型チェックのみ |

## 仕組み

- ブラウザからの `/api/...` は、`next.config.mjs` の rewrites で API サーバーへ中継されます(対応表はファイル冒頭のコメント)。
- ログインしているかの確認は `src/components/session/LoginGate.tsx` で行います。新しいページは次のように書きます。
  ```tsx
  export default function Page() {
    return <LoginGate requireAdmin>{(userName) => <MyForm userName={userName} />}</LoginGate>;
  }
  ```
- レシート画像は Supabase Storage(`NEXT_PUBLIC_SUPABASE_*`)に直接アップロードします。

## ディレクトリ構成(主なもの)

```
src/
├─ pages/            URL に対応するページ(/income, /hatosai/outcome, /admin/... など)
├─ components/
│  ├─ income.tsx / outcome.tsx   収入・支出の申請フォーム(全予算で共通)
│  ├─ update.tsx                 管理画面の編集行
│  └─ session/                   LoginGate・各予算のホーム・メニュー項目
├─ config/           色・他アプリの URL・予算のキー
├─ hooks/            ログイン・ログアウト(UseLoginState.ts)
└─ lib/              Jotai の状態・ログ出力
utils/supabase/      Supabase クライアント
```

## デプロイ

Vercel。`main` ブランチへのマージで本番に反映されます。PR の承認は必ず「でんげき」のアカウントから行ってください
(ルートの README の Git rules を参照)。
