import { Box, Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin,isUser, Login, Logout] = UseLoginState(false);
  const router = useRouter();
  return (
    <>
      <VStack>
        {isAdmin || isUser ?
          <>
            <Text>Log in as : {isAdmin?"管理者":"一般ユーザー"}</Text>
          </> 
        : null}
        <Text fontSize={"2xl"}>ホーム</Text>
        {isAdmin || isUser ? (
          <>
            <Link href={"/income"}>
              <Box borderBottom="1px solid #fc8819">収入報告</Box>
            </Link>
            <Link href={"/outcome"}>
              <Box borderBottom="1px solid #fc8819">支出報告</Box>
            </Link>
            {isAdmin ? 
            <Link href="/generate">
              <Box borderBottom="1px solid #fc8819">excel出力</Box>
            </Link>
            : null }
            <Button onClick={Logout}>ログアウト</Button>
          </>
        ) : (
          <Button onClick={() => router.push("/login")}>ログイン</Button>
        )}
      </VStack>
    </>
  );
}
