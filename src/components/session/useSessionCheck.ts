import { useEffect, useState } from "react";
import { DengekiSSO } from "@/hooks/UseLoginState";

/**
 * 画面を開いたときに1回だけログイン状態を確認し、確認中なら true を返す。
 * 結果(ログイン中か・管理者か・部名)は Jotai の atom に保存される。
 */
export const useSessionCheck = (): boolean => {
  const { session } = DengekiSSO();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    session()
      .catch(() => undefined) // 通信に失敗した場合は「未ログイン」として扱う
      .finally(() => {
        if (isMounted) setIsChecking(false);
      });
    return () => {
      isMounted = false;
    };
    // 画面を開いたときに1回だけ実行する(session は毎回作り直される関数のため依存配列に入れない)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isChecking;
};
