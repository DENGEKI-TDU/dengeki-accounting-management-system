import "@/styles/globals.css";
import { Box, Center, ChakraProvider, Heading, Text, VStack } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Box bg="#fc8819" color="white" w="100%" position="sticky" top="0" zIndex={"calc(infinity)"}>
          <Link href="/">
            <Center>
              <Text fontSize={"6xl"} fontWeight={"extrabold"}>でんげき会計管理システム</Text>
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
