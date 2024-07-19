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
          <Text fontSize={"2xl"}>校友会費収支申請ホーム</Text>
          <Link href={"/alumni/income"}>
            <Box borderBottom="1px solid #fc8819">収入報告</Box>
          </Link>
          <Link href={"/alumni/outcome"}>
            <Box borderBottom="1px solid #fc8819">支出報告</Box>
          </Link>
          <Button onClick={Logout}>ログアウト</Button>
        </VStack>
      : 
      <>
        {status ?
        <>
          <VStack>
            <Heading>ログインしてください。</Heading>
            <Button
              onClick={() => {
                router.push({
                  pathname:"https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/login",
                  query: {locate:"accounting",}
                },"http:/localhost:3000/login")
              }}>
                ログイン
              </Button>
          </VStack>
        </>
        :
          <Heading>ログイン状態確認中</Heading>
        }
      </>
      }
    </>
  );
}
