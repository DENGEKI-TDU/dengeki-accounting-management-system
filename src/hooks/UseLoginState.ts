import { useCallback, useEffect, useState } from "react";
import { createHash, randomUUID } from "crypto";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const STORAGE_TOKEN = "storage_token";
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const USER_TOKEN = process.env.NEXT_PUBLIC_USER_TOKEN;
const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;
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
  const router = useRouter();

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

  async function loginAuth(id:string,pass:string,token:string){
    toast({
      title: "ログイン中",
      status: "loading",
      duration: 2000,
      isClosable: true,
    });
    const hostname = await fetch("https://ipinfo.io/hostname")
    const authBody = {
      hostname
    }
    const oneTimePass = await fetch("api/auth/generatePass",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(authBody)
    })
    const passResult = await oneTimePass.json()
    const oneTimeToken = passResult.token
    const body = {
      id,
      pass,
      token,
      oneTimeToken,
      hostname,
    }
    const response = await fetch("/api/auth/login",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const result = await response.json()
    if(result){
      if(result.status == "success"){
        localStorage.setItem(STORAGE_TOKEN,token);
        toast({
          title: "ログイン完了",
          description:"ログイン日時：" + new Date(),
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        router.push("/")
      } else {
        toast({
          title: "ログインエラー",
          description:"ID又はパスワードが異なります。",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    }
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
      const uuidToken = crypto.randomUUID()
      if (lIP.includes(acceptIP)) {
        loginAuth(id,hashPass,uuidToken)
      } else {
        toast({
          title: "認証エラー",
          description: "ログインには学内ネットワークへの接続が必要です。",
          status: "error",
          duration: 2500,
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
    setIsUserInternal(false);toast({
      title: "ログアウトしました",
      status: "success",
      duration: 2500,
      isClosable: true,
    })
  }, []);
  return [isAdminInternal,isUserInternal, Login, Logout];
}
