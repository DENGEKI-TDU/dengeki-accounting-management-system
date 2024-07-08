import { UseLoginState } from "@/hooks/UseLoginState";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const serceParams = useSearchParams();
  const pageLocate = serceParams.get("pagelocate");
  const [isAdmin,isUser,status, Login, Logout] = UseLoginState(false);
  const [inputID, setInputID] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [IP, setIP] = useState("");
  const ipUrl = "https://ipapi.co/json";
  const getIp = async () => {
    const response = await fetch(ipUrl);
    const data = await response.json();
    setIP(data.ip);
  };

  useEffect(() => {
    getIp();
  }, []);
  function setLogin() {
    Login(inputID, inputPass, IP);
  }
  return (
    <>
      {status && (isAdmin || isUser) ? 
          <Heading>ログイン済みです。</Heading>
        :
        <Center>
        <VStack>
          <Heading>ログインフォーム</Heading>
          <Text>
            ログインには学内インターネットへの接続が必要です。
            <br />
            学外からログインするには
            <Link href="https://www.mrcl.dendai.ac.jp/mrcl/it-service/network/vpn/">
              <Box as="span" borderBottom={"1px solid #fc8819"}>
                このリンク
              </Box>
              を参照してVPNを利用してください。
            </Link>
          </Text>
          <Box border={"3px dotted #fc8819"} w="80%">
            <FormControl>
              <FormLabel>ID</FormLabel>
              <Input onChange={(e) => setInputID(e.target.value)}></Input>
            </FormControl>
            <FormControl>
              <FormLabel>PASSWORD</FormLabel>
              <Input
                onChange={(e) => setInputPass(e.target.value)}
                type="password"
              ></Input>
            </FormControl>
            <Button onClick={setLogin}>LOGIN</Button>
          </Box>
        </VStack>
      </Center>
      }
      </>
  )
}
