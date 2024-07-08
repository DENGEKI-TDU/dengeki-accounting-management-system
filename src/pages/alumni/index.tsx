import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin,isUser,status, Login, Logout] = UseLoginState(false);
  const router = useRouter();
  return (
    <>
      <VStack>
        {status ? 
        <>
        {isAdmin || isUser ?
          <>
            <Text>Log in as : {isAdmin?"管理者":"一般ユーザー"}</Text>
          </> 
        : null}
        <Text fontSize={"2xl"}>校友会費収支申請ホーム</Text>
        {isAdmin || isUser ? (
          <>
            <Link href={"/alumni/income"}>
              <Box borderBottom="1px solid #fc8819">収入報告</Box>
            </Link>
            <Link href={"/alumni/outcome"}>
              <Box borderBottom="1px solid #fc8819">支出報告</Box>
            </Link>
            <Button onClick={Logout}>ログアウト</Button>
          </>
        ) : (
          <Button onClick={() => router.push("/login")}>ログイン</Button>
        )}
        </>
        : <Heading>ログイン状態認証中</Heading> }
      </VStack>
    </>
  );
}
