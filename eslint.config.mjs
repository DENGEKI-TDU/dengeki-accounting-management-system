/**
 * ESLint の設定(ESLint 9 の flat config 形式)。`npm run lint` で実行する。
 *
 * Next.js 公式の推奨ルール(eslint-config-next)をベースにしている。
 * 既存コードで大量に引っかかるルールは、いきなりエラーにすると作業が止まるため
 * 「警告(warn)」にしてある。新しく書くコードでは警告も出さないようにし、
 * 直し終わったルールから "error" に戻していくこと。
 *
 * 出典: https://nextjs.org/docs/app/api-reference/config/eslint
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // 既存コードに多いもの(段階的に直す)
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-require-imports": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // React Compiler 向けの新しいルール。既存の「useEffect 内で setState」パターンが多いため警告に留める
      "react-hooks/set-state-in-effect": "warn",
      "@next/next/no-img-element": "warn",
      "jsx-a11y/alt-text": "warn",
      "prefer-const": "warn",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "*.tsbuildinfo"],
  },
];

export default eslintConfig;
