import { DengekiSSO } from "@/hooks/UseLoginState";
import { Heading, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";
import IncomeForm from "@/components/income";

export default function Home() {
  const { session } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);

  if (!pending && isLogin) {
    return <IncomeForm from="hatosai" userName={userName} />;
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
}
