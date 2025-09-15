import { DengekiSSO } from "@/hooks/UseLoginState";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import "@/styles/globals.css";
import {
  Box,
  Center,
  ChakraProvider,
  Heading,
  Text,
  VStack,
  Image,
  Button,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import type { AppProps } from "next/app";
import Link from "next/link";
import router from "next/router";
import { useState, useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { session, login, logout } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [pending, setPending] = useState(true);
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);
  return (
    <>
      <ChakraProvider>
        <Box
          backgroundColor={"#fc8819"}
          width="100%"
          position="sticky"
          top="0"
          zIndex={"calc(infinity)"}
        >
          <Link href="/">
            <Center>
              <Image
                src="/header.png"
                width="50%"
                alt="ヘッダー画像"
                position="sticky"
                top="0"
                zIndex={"calc(infinity)"}
              />
            </Center>
          </Link>
        </Box>
        <Center marginTop={"20px"}>
          <VStack w="100%">
            {!pending && isLogin ? (
              <>
                <Text>
                  Login as : {userName}
                  {isAdmin ? "(管理者)" : "(一般ユーザー)"}
                </Text>
              </>
            ) : null}
            <Component {...pageProps} />
          </VStack>
        </Center>
      </ChakraProvider>
    </>
  );
}
