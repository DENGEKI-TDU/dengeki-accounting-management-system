/**
 * 予算(帳簿)のキー。api アプリの lib/accountBooks.ts と同じキーを使う。
 * 予算を増やすときは、ここ・api 側・pages/<キー>/ の3か所を揃えること。
 */
export type BudgetKey = "main" | "hatosai" | "alumni" | "clubsupport";
