import { useToast } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useRouter } from "next/router";

export const DengekiSSO = () => {
  const toast = useToast();
  const router = useRouter();
  const setUsetName = useSetAtom(loginNameAtom);
  const setIsLogin = useSetAtom(isLoginAtom);
  const setIsAdmin = useSetAtom(isAdminAtom);
  const session = async () => {
    console.log("SSO Session Function");
    await fetch("/api/session/getSession").then(async (res) => {
      const response = await res.json();
      console.log(response.name);
      setUsetName(response.name);
      setIsLogin(response.isLogin);
      if (response.isLogin) {
        setIsAdmin(response.isAdmin || response.isDev);
      }
    });
  };
  const login = async ({
    name,
    password,
    locate,
  }: {
    name: string;
    password: string;
    locate: string | null;
  }) => {
    toast({
      title: "ログイン中",
      description: "ログイン中です......",
      duration: 10000,
      status: "loading",
    });
    await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, password: password }),
    }).then(async (res) => {
      const response = await res.json();
      await fetch("/api/session/getSession").then(async (res) => {
        const response = await res.json();
        if (response.status == "failed") {
          alert("failed!");
          toast({
            title: "ログイン失敗",
            description:
              "ログインに失敗しました。ID又はパスワードを確認してください。",
            status: "success",
            duration: 3000,
          });
        } else {
          setIsLogin(response.isLogin);
          setUsetName(response.name);
          toast.closeAll();
          if (response.isLogin) {
            toast({
              title: "ログイン成功",
              description: "ログインに成功しました。リダイレクトします。",
              status: "success",
              duration: 3000,
            });
            setIsAdmin(
              response.isAdmin || response.isDev || response.isTreasurer
            );
            if (locate) {
              router.push(locate);
            } else {
              router.push("/");
            }
          }
        }
      });
    });
  };
  const logout = async () => {
    await fetch("/api/session/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    setIsLogin(false);
    setIsAdmin(false);
  };
  return { session, login, logout };
};
