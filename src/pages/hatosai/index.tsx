import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function Home() {
  // const [isAdmin, isUser, status, Login, Logout] = UseLoginState(false);
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
      <VStack>
        {!pending && isLogin ? (
          <>
            <Text fontSize={"2xl"}>鳩山祭援助金収支申請ホーム</Text>
            <Link href={"/hatosai/income"}>
              <Box borderBottom="1px solid #fc8819">収入報告</Box>
            </Link>
            <Link href={"/hatosai/outcome"}>
              <Box borderBottom="1px solid #fc8819">支出報告</Box>
            </Link>
            <Button onClick={logout}>ログアウト</Button>
          </>
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
      </VStack>
    </>
  );
}
