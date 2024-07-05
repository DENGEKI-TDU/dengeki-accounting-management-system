import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
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
            {isAdmin ? 
            <>
            <Link href="/admin/generate">
              <Box borderBottom="1px solid #fc8819">excel出力</Box>
            </Link>
            <Link href="/admin/edit">
              <Box borderBottom="1px solid #fc8819">帳簿データ編集</Box>
            </Link>
            </>
            : <Heading>一般ユーザーの権限では使用できません。</Heading> }
            <Button onClick={Logout}>ログアウト</Button>
          </>
        ) : (
          <Button onClick={() => router.push("/login")}>ログイン</Button>
        )}
      </VStack>
    </>
  );
}
