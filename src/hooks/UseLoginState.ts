import { useCallback, useEffect, useState } from "react";
import { createHash, randomUUID } from "crypto";
import { useToast } from "@chakra-ui/react";

const STORAGE_TOKEN = "storage_token";
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const USER_TOKEN = process.env.NEXT_PUBLIC_USER_TOKEN;
const ADMIN_ID = process.env.NEXT_PUBLIC_ADMNI_ID;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
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
  isAdmin: boolean,
  Login: (ID: string, TOKEN: string, LocalIP: string) => void,
  Logout: () => void
] {
  const [isUserInternal, setIsUserInternal] = useState(defaultValue);
  const [isAdminInternal,setIsAdminInternal] = useState(defaultValue)

  const toast = useToast();
  // const sessionToken = localStorage.getItem(STORAGE_TOKEN)

  async function loginAuth(isAdmin:boolean,isUser:boolean,tokens:string){
    const loginDate = new Date()
    const body = {
      tokens,
      loginDate,
      isAdmin,
      isUser,
    }
    await fetch("/api/auth/login",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  async function logoutAuth(tokens:string){
    const body = {
      tokens,
    }
    await fetch("/api/auth/logout",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  const getAuth = async () => {
    const sessionToken = localStorage.getItem(STORAGE_TOKEN)
    const body = {
      sessionToken
    }
    const response = await fetch("/api/auth",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if(data){
      if(data.limit >= new Date()){
        localStorage.clear;
        setIsUserInternal(false)
        setIsAdminInternal(false)
      } else {
        setIsUserInternal(data.isUser)
        setIsAdminInternal(data.isAdmin)
      }
    }
  }

  useEffect(() => {
    getAuth()
  }, [setIsUserInternal]);

  const Login = useCallback(
    (id: string, pass: string, lIP: string) => {
      const hashPass = encryptSha256(pass);
      const date = new Date();
      const uuidToken = crypto.randomUUID()

      if ((id == USER_ID && hashPass == USER_TOKEN) || (id == ADMIN_ID &&hashPass == ADMIN_TOKEN)) {
        if (lIP.includes(acceptIP)) {
          localStorage.setItem(STORAGE_TOKEN, uuidToken);
          loginAuth((id == ADMIN_ID &&hashPass == ADMIN_TOKEN),(id == USER_ID && hashPass == USER_TOKEN),uuidToken)
          setIsAdminInternal((id == ADMIN_ID &&hashPass == ADMIN_TOKEN))
          setIsUserInternal((id == USER_ID && hashPass == USER_TOKEN));
          if(isAdminInternal){
            toast({
              title: "ログイン完了",
              description:
                "一般ユーザーとしてログインしましたログイン日時：" + date,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } else if(isUserInternal){
            toast({
              title: "ログイン完了",
              description:
                "一般ユーザーとしてログインしましたログイン日時：" + date,
              status: "success",
              duration: 5000,
              isClosable: true,
            })
          }
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
    []
  );
  const Logout = useCallback(() => {
    const sessionToken = localStorage.getItem(STORAGE_TOKEN)
    logoutAuth(sessionToken!)
    localStorage.removeItem(STORAGE_TOKEN);
    setIsUserInternal(false);
  }, []);
  return [isUserInternal,isAdminInternal, Login, Logout];
}
