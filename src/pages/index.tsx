import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";
import axios from "axios";

export default function Home() {
  const { session, login, logout } = DengekiSSO();
  const [pending, setPending] = useState(true);
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [token, setToken] = useState<string>();
  const router = useRouter();
  const domain =
    process.env.NODE_ENV === "production"
      ? "https://portal.dengeki-fox.net"
      : "http://localhost:3004";
  useEffect(() => {
    session().then(() => {
      axios
        .post("/api/redirect/getToken", { redirectTo: "/accounting_queue" })
        .then(async (res) => {
          console.log(res.data.token);
          setToken(res.data.token);
          setPending(false);
        });
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
          <Link href={`${domain}/redirect?token=${token}`} target="_break">
            <Box borderBottom="1px solid #fc8819">会計の申請状況確認ページ</Box>
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
