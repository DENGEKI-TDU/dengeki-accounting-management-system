import { useCallback, useEffect, useRef, useState } from "react";
import { createHash, randomUUID } from "crypto";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const STORAGE_TOKEN = "storage_token";

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
  status: boolean,
  Login: (ID: string, TOKEN: string, LocalIP: string) => void,
  Logout: () => void
] {
  const [isUserInternal, setIsUserInternal] = useState(defaultValue);
  const [isAdminInternal,setIsAdminInternal] = useState(defaultValue)

  const toast = useToast();
  const router = useRouter();
  const toastIdRef:any = useRef()
  const [sessionStatus,setSessionStatus] = useState(false)

  async function logoutAuth(tokens:string){
    const body = {
      tokens,
      mode:"logout"
    }
    await fetch("/api/auth",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  async function loginAuth(id:string,pass:string,token:string,hostname:string){
    toastIdRef.current = toast({
      title: "ログイン中",
      status: "loading",
      duration: 5000,
      isClosable: true,
    });
    const authBody = {
      hostname
    }
    const oneTimePass = await fetch("/api/auth/generatePass",{
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
      mode:"login"
    }
    const response = await fetch("/api/auth",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    await response.json().then((result) => {
      if(toastIdRef.current){
        toast.close(toastIdRef.current)
      }
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
    })
  }

  const getAuth = async () => {
    const token = localStorage.getItem(STORAGE_TOKEN)
    const body = {
      token,
      mode:"get"
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
    setSessionStatus(true)
  }, [setIsUserInternal]);

  const Login = useCallback(
    (id: string, pass: string, lIP: string) => {
      const hashPass = encryptSha256(pass);
      const uuidToken = crypto.randomUUID()
      const allow = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
      if (lIP.includes(allow)) {
        loginAuth(id,hashPass,uuidToken,lIP)
      } else {
        toast({
          title: "認証エラー",
          description: `ログインには学内ネットワークへの接続が必要です。`,
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
    router.push("")
  }, []);
  return [isAdminInternal,isUserInternal,sessionStatus, Login, Logout];
}
