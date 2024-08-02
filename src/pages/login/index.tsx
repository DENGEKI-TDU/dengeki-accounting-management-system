import { useEffect } from "react";
import { HStack, Spinner, Text } from '@chakra-ui/react'
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if(router.isReady){
      const token = router.query.token
      
      if(token != ""){
        localStorage.setItem("storage_token",String(token))
      }
      router.push("/")
    }
},[router])
  return (
    <>
      <HStack><Spinner /><Text>ログイン認証中</Text></HStack>
    </>
  )
}
