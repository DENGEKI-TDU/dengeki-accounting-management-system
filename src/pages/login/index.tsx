import { useEffect } from "react";
import { HStack, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const token = router.query.token;
      const path = router.query.path;
      if (token != "") {
        localStorage.setItem("storage_token", String(token));
      }
      if (path) {
        router.push(String(path));
      } else {
        router.push("/");
      }
    }
  }, [router]);
  return (
    <>
      <HStack>
        <Spinner />
        <Text>ログイン認証中</Text>
      </HStack>
    </>
  );
}
