import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin,isUser,status, Login, Logout] = UseLoginState(false);
  const router = useRouter();
  return (
    <>
    {status && (isAdmin || isUser) ?
      <VStack>
        <Text>Log in as : {isAdmin?"管理者":"一般ユーザー"}</Text>
        <Text fontSize={"2xl"}>本予算を除く予算申請ページ</Text>
        <Link href={"/hatosai"}>
          <Box borderBottom="1px solid #fc8819">鳩山祭関連</Box>
        </Link>
        <Link href={"/clubsupport"}>
          <Box borderBottom="1px solid #fc8819">後援会費関連</Box>
        </Link>
        {isAdmin ? 
        <Link href="/alumni">
          <Box borderBottom="1px solid #fc8819">校友会費関連</Box>
        </Link>
        : null }
        <Button onClick={Logout}>ログアウト</Button>
      </VStack>
    : 
      <>
        {status ?
        <>
          <VStack>
            <Heading>ログインしてください。</Heading>
            <Button onClick={() => router.push("/login")}>ログイン</Button>
          </VStack>
        </>
        :
          <Heading>ログイン状態認証中</Heading>
        }
      </>
      }
    </>
  );
}