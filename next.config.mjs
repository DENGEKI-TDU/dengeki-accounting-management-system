/**
 * 会計システムの Next.js 設定。
 *
 * ブラウザからの `/api/...` へのリクエストを、バックエンド API サーバー(apps/api)へ中継する。
 * 以前は URL ごとに約55個の中継ルールを並べていたが、API 側の URL 構成と1対1で
 * 対応しているため、パターン(:path*)でまとめた。中継先の URL の対応は下の表のとおり。
 *
 *   /api/redirect/getToken      → /redirect/getToken
 *   /api/database/...           → /v1/account/database/...
 *   /api/discord/...            → /v1/account/discord/...
 *   /api/session/withPast       → /v1/portal/account/getMembers
 *   /api/session/...            → /v1/session/...
 *
 * ルールは上から順に評価されるため、個別のルールはパターンより前に書くこと。
 */

/** 中継先の API サーバー。環境変数 API_ORIGIN で上書きできる(未設定なら本番/開発で切り替え) */
const API_ORIGIN =
  process.env.API_ORIGIN ??
  (process.env.NODE_ENV === "production"
    ? "https://api.dengeki-fox.net"
    : "http://localhost:3006");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // 画面側の旧名「hatoyama」を API 側の「hatosai」に読み替える(互換性のため残している)
      {
        source: "/api/database/post-earnings/main/move/hatoyama",
        destination: `${API_ORIGIN}/v1/account/database/post-earnings/main/move/hatosai`,
      },
      {
        source: "/api/redirect/getToken",
        destination: `${API_ORIGIN}/redirect/getToken`,
      },
      {
        source: "/api/database/:path*",
        destination: `${API_ORIGIN}/v1/account/database/:path*`,
      },
      {
        source: "/api/discord/:path*",
        destination: `${API_ORIGIN}/v1/account/discord/:path*`,
      },
      {
        source: "/api/session/withPast",
        destination: `${API_ORIGIN}/v1/portal/account/getMembers`,
      },
      {
        source: "/api/session/:path*",
        destination: `${API_ORIGIN}/v1/session/:path*`,
      },
    ];
  },
};

export default nextConfig;
