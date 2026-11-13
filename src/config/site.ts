/**
 * 他のアプリの URL。開発時(npm run dev)はローカルのポートを使う。
 * ポート番号はルートの README の「ポート一覧」と揃えること。
 */
const isProduction = process.env.NODE_ENV === "production";

// バックエンド API(apps/api)の URL は next.config.mjs で設定している

/** ポータル(apps/portal) */
export const PORTAL_ORIGIN = isProduction ? "https://portal.dengeki-fox.net" : "http://localhost:3005";
