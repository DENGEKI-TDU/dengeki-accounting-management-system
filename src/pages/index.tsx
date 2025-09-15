import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";

export default function Home() {
  // const [isAdmin, isUser, status, Login, Logout] = UseLoginState(false);
  const { session, login, logout } = DengekiSSO();
  const [pending, setPending] = useState(true);
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const router = useRouter();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  });
  return (
    <>
      {!pending && (isAdmin || isLogin) ? (
        <VStack>
          <Text fontSize={"2xl"}>ホーム</Text>
          <Link href={"/income"}>
            <Box borderBottom="1px solid #fc8819">本予算収入報告</Box>
          </Link>
          <Link href={"/outcome"}>
            <Box borderBottom="1px solid #fc8819">本予算支出報告</Box>
          </Link>
          <Link href={"/other"}>
            <Box borderBottom="1px solid #fc8819">
              本予算以外の収支報告ページ
            </Box>
          </Link>
          {isAdmin ? (
            <Link href="/admin">
              <Box borderBottom="1px solid #fc8819">管理者用ページ</Box>
            </Link>
          ) : null}
          <Button onClick={logout}>ログアウト</Button>
        </VStack>
      ) : (
        <>
          {!pending ? (
            <>
              <VStack>
                <Heading>ログインしてください。</Heading>
                <Button
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  ログイン
                </Button>
              </VStack>
            </>
          ) : (
            <Heading>ログイン状態確認中</Heading>
          )}
        </>
      )}
    </>
  );
}
