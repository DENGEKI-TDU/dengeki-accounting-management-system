import { Box, Button, Heading, Tab, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";

export default function Home() {
  const [isAdmin,isUser,status, Login, Logout] = UseLoginState(false);
  const router = useRouter();
  const [income,setIncome] = useState(0)
  const [outcome,setOutcome] = useState(0)
  const [balance,setBalance] = useState(0)
  const [hatosaiIncome,setHatosaiIncome] = useState(0)
  const [hatosaiOutcome,setHatosaiOutcome] = useState(0)
  const [hatosaiBalance,setHatosaiBalance] = useState(0)
  const [csIncome,setCSIncome] = useState(0)
  const [csOutcome,setCSOutcome] = useState(0)
  const [csBalance,setCSBalance] = useState(0)
  const [alumniIncome,setAlumniIncome] = useState(0)
  const [alumniOutcome,setAlumniOutcome] = useState(0)
  const [alumniBalance,setAlumniBalance] = useState(0)
  async function getEarngings(sessionToken:string) {
    let year = new Date().getFullYear()
    if(new Date().getMonth()+1 < 4){
      year -1
    }
    const sendYear = String(year)
    const body = {
      year:sendYear,
      inputPass:"from admin page",
      sessionToken
    }
    const result = await fetch("/api/database/earnings",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    })
    const res = JSON.parse(await result.json())
    setIncome(res.income)
    setOutcome(res.outcome)
    setBalance(res.balance)
    setHatosaiIncome(res.hatosaiIncome)
    setHatosaiOutcome(res.hatosaiOutcome)
    setHatosaiBalance(res.hatosaiBalance)
    setCSIncome(res.csIncome)
    setCSOutcome(res.csOutcome)
    setCSBalance(res.csBalance)
    setAlumniIncome(res.alumniIncome)
    setAlumniOutcome(res.alumniOutcome)
    setAlumniBalance(res.alumniBalance)
  }
  useEffect(()=>{
      const sessionToken = localStorage.getItem("storage_token")!
      getEarngings(sessionToken)
  },[])
  return (
    <>
      {status && (isAdmin || isUser) ? 
        <VStack>
          <Text>Log in as : {isAdmin?"管理者":"一般ユーザー"}</Text> 
          <Text fontSize={"2xl"}>管理者用ページホーム</Text>
          {isAdmin || isUser ? (
            <>
              {isAdmin ? 
              <>
              <Link href="/admin/generate">
                <Box borderBottom="1px solid #fc8819">excel出力</Box>
              </Link>
              <Link href={"/admin/edit?from=main"}>
                <Box borderBottom="1px solid #fc8819">本予算帳簿データ編集</Box>
              </Link>
              <Link href={"/admin/edit?from=hatosai"}>
                <Box borderBottom="1px solid #fc8819">鳩祭援助金帳簿データ編集</Box>
              </Link>
              <Link href={"/admin/edit?from=clubsupport"}>
                <Box borderBottom="1px solid #fc8819">後援会費関連帳簿データ編集</Box>
              </Link>
              <Link href={"/admin/edit?from=alumni"}>
                <Box borderBottom="1px solid #fc8819">校友会費関連帳簿データ編集</Box>
              </Link>
              <Box>
                <Box margin="5px"  border="1px solid #fc8819" borderRadius={"lg"}>
                  <VStack margin={"5px"}>
                  <Text>現在の本予算収支</Text>
                  <Text>収入:{income}円、支出:{outcome}円、残高:{(balance>=0)?<>{balance}</>:<Text as="span" color="red" fontWeight={"extrabold"}>{balance}</Text>}円</Text>
                  </VStack>
                </Box>
                <Box margin="5px"  border="1px solid #1e90ff" borderRadius={"lg"}>
                  <VStack margin={"5px"}>
                  <Text>現在の鳩山祭援助金収支</Text>
                  <Text>収入:{hatosaiIncome}円、支出:{hatosaiOutcome}円、残高:{(hatosaiBalance>=0)?<>{hatosaiBalance}</>:<Text as="span" color="red" fontWeight={"extrabold"}>{hatosaiBalance}</Text>}円</Text>
                  </VStack>
                </Box>
                <Box margin="5px"  border="1px solid #32cd32" borderRadius={"lg"}>
                  <VStack margin={"5px"}>
                  <Text>現在の後援会費収支</Text>
                  <Text>収入:{csIncome}円、支出:{csOutcome}円、残高:{(csBalance>=0)?<>{csBalance}</>:<Text as="span" color="red" fontWeight={"extrabold"}>{csBalance}</Text>}円</Text>
                  </VStack>
                </Box>
                <Box margin="5px" border="1px solid #0000cd" borderRadius={"lg"}>
                  <VStack margin={"5px"}>
                  <Text>現在の校友会費収支</Text>
                  <Text>収入:{alumniIncome}円、支出:{alumniOutcome}円、残高:{(alumniBalance>=0)?<>{alumniBalance}</>:<Text as="span" color="red" fontWeight={"extrabold"}>{alumniBalance}</Text>}円</Text>
                  </VStack>
                </Box>
              </Box>
              </>
              : <Heading>一般ユーザーの権限では使用できません。</Heading> }
              
              <Button onClick={Logout}>ログアウト</Button>
            </>
          ) : (
            <Button onClick={() => router.push("/login")}>ログイン</Button>
          )}
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
