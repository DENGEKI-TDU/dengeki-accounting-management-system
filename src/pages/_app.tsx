import "@/styles/globals.css";
import { Box, Center, ChakraProvider, Heading, Text, VStack, Image } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Box backgroundColor={"#fc8819"} width="100%" position="sticky" top="0" zIndex={"calc(infinity)"}>
          <Link href="/">
            <Center>
              <Image src="/header.png" width="50%" alt="ヘッダー画像" position="sticky" top="0" zIndex={"calc(infinity)"} />
            </Center>
          </Link>
        </Box>
        <Center marginTop={"20px"}>
          <Component {...pageProps} />
        </Center>
      </ChakraProvider>
    </>
  );
}
