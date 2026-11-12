/**
 * ログインしている人にだけ中身を見せる共通部品。
 *
 * 以前は収入・支出・各予算のホームなど12ページに、
 * 「ログイン確認 → 確認中の表示 → 未ログインならログインボタン」という同じ約40行がコピーされていた。
 * その一部は確認中の状態(pending)の初期値が false で、確認が終わる前に
 * 一瞬「ログインしてください」が表示されていた。
 *
 * 使い方:
 *   <LoginGate>{(userName) => <IncomeForm from="main" userName={userName} />}</LoginGate>
 *   <LoginGate requireAdmin>...</LoginGate>  // 管理者のみ
 */
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useSessionCheck } from "./useSessionCheck";

type LoginGateProps = {
  /** true にすると、管理者(isAdmin / isDev / isTreasurer)以外には中身を見せない */
  requireAdmin?: boolean;
  /** ログイン済みのときに表示する内容。関数を渡すとログイン中の部名を受け取れる */
  children: ReactNode | ((userName: string) => ReactNode);
};

export default function LoginGate({ requireAdmin = false, children }: LoginGateProps) {
  const isChecking = useSessionCheck();
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const userName = useAtomValue(loginNameAtom);
  const router = useRouter();

  if (isChecking) {
    return <Heading>ログイン状態確認中</Heading>;
  }
  if (!isLogin) {
    return (
      <VStack>
        <Heading>ログインしてください。</Heading>
        <Button
          onClick={() =>
            router.push({ pathname: "/login", query: { pagelocate: router.asPath } })
          }
        >
          ログイン
        </Button>
      </VStack>
    );
  }
  if (requireAdmin && !isAdmin) {
    return <Text>一般ユーザーの権限では使用できません。</Text>;
  }
  return <>{typeof children === "function" ? children(userName) : children}</>;
}
