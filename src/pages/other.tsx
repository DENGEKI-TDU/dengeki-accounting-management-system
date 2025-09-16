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
  const { session, login, logout } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [pending, setPending] = useState(true);
  const router = useRouter();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);
  return (
    <>
      {!pending && isLogin ? (
        <VStack>
          <Text fontSize={"2xl"}>本予算を除く予算申請ページ</Text>
          <Link href={"/hatosai"}>
            <Box borderBottom="1px solid #fc8819">鳩山祭関連</Box>
          </Link>
          <Link href={"/clubsupport"}>
            <Box borderBottom="1px solid #fc8819">後援会費関連</Box>
          </Link>
          {isAdmin ? (
            <Link href="/alumni">
              <Box borderBottom="1px solid #fc8819">校友会費関連</Box>
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
