import "@/styles/globals.css";
import { Box, Center, ChakraProvider, Heading, VStack } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Box w="100%" position="sticky" top="0" zIndex={"calc(infinity)"}>
          <Link href="/">
            <img src="/header.png" width={"100%"} height="auto" />
          </Link>
        </Box>
        <Center>
          <Component {...pageProps} />
        </Center>
      </ChakraProvider>
    </>
  );
}
