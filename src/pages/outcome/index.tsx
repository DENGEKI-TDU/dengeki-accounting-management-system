"use client";
import { Heading, Button, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";
import Outcome from "@/components/outcome";

const Home: NextPage = () => {
  const router = useRouter();
  const { session } = DengekiSSO();
  const [pending, setPending] = useState(false);
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  let http = "http";
  if (process.env.NODE_ENV == "production") {
    http = "https";
  }
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);

  if (!pending && isLogin) {
    return <Outcome from="main" userName={userName} />;
  } else {
    return (
      <>
        {!pending ? (
          <>
            <VStack>
              <Heading>ログインしてください。</Heading>
              <Button
                onClick={() => {
                  router.push("/login");
                }}
              >
                ログイン
              </Button>
            </VStack>
          </>
        ) : (
          <Heading>ログイン状態確認中</Heading>
        )}
      </>
    );
  }
};
export default Home;
