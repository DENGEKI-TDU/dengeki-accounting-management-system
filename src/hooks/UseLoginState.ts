import { useCallback, useEffect, useState } from "react";
import { createHash } from "crypto";
import { useToast } from "@chakra-ui/react";

const STORAGE_TOKEN = "storage_token";
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const USER_TOKEN = process.env.NEXT_PUBLIC_USER_TOKEN;
const acceptIP = process.env.NEXT_PUBLIC_HOST_IP!;

const encryptSha256 = (str: string) => {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest().toString("base64");
};

export function UseLoginState(
  defaultValue: boolean
): [
  isUser: boolean,
  Login: (ID: string, TOKEN: string, LocalIP: string) => void,
  Logout: () => void
] {
  const [isUserInternal, setIsUserInternal] = useState(defaultValue);
  const limit = new Date();
  const lYear = limit.getFullYear();
  const lMonth = limit.getMonth();
  const lDate = limit.getDate() - 3;
  const l_date = new Date(lYear, lMonth, lDate);

  const toast = useToast();

  useEffect(() => {
    const s_d = localStorage.getItem("loginTime");
    if (s_d ? new Date(s_d) < l_date : false) {
      localStorage.removeItem(STORAGE_TOKEN);
    }
    setIsUserInternal(localStorage.getItem(STORAGE_TOKEN) == USER_TOKEN);
  }, [setIsUserInternal]);

  const Login = useCallback(
    (id: string, pass: string, lIP: string) => {
      const hashPass = encryptSha256(pass);
      const date = new Date();

      if (id == USER_ID && hashPass == USER_TOKEN) {
        if (lIP.includes(acceptIP)) {
          localStorage.setItem(STORAGE_TOKEN, hashPass);
          setIsUserInternal(true);
          toast({
            title: "ログイン完了",
            description:
              "一般ユーザーとしてログインしましたログイン日時：" + date,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "認証エラー",
            description: "ログインには学内ネットワークへの接続が必要です。",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "ログインエラー",
          description: "IDまたはPASSWORDが異なります。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [setIsUserInternal]
  );
  const Logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    setIsUserInternal(false);
  }, [setIsUserInternal]);
  return [isUserInternal, Login, Logout];
}
