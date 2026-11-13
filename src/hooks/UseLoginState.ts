import { useToast } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useRouter } from "next/router";
import { dev } from "@/lib/Dev";

/**
 * ログイン後の移動先として安全なパスか(サイト内の "/" で始まるパスだけ許可する)。
 * `?pagelocate=https://外部サイト` のような指定で外部に飛ばされないようにするため。
 */
const isSafeInternalPath = (path: string | null): path is string =>
  !!path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\");

export const DengekiSSO = () => {
  const toast = useToast();
  const router = useRouter();
  const setUserName = useSetAtom(loginNameAtom);
  const setIsLogin = useSetAtom(isLoginAtom);
  const setIsAdmin = useSetAtom(isAdminAtom);
  const session = async () => {
    dev.log("SSO Session Function");
    await fetch("/api/session/getSession").then(async (res) => {
      const response = await res.json();
      setUserName(response.name);
      setIsLogin(response.isLogin);
      if (response.isLogin) {
        setIsAdmin(response.isAdmin || response.isDev || response.isTreasurer);
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
      description: `${name}としてログイン中です......`,
      duration: 10000,
      status: "loading",
    });
    await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, password: password }),
    }).then(async () => {
      await fetch("/api/session/getSession").then(async (res) => {
        const response = await res.json();
        // getSession は失敗時に status を返さず isLogin: false を返すため、isLogin で判定する
        // (以前は status == "failed" で判定しており、失敗のトーストが一度も出ていなかった)
        if (!response.isLogin) {
          toast.closeAll();
          toast({
            title: "ログイン失敗",
            description:
              "ログインに失敗しました。ID又はパスワードを確認してください。",
            // 以前は失敗なのに success(緑色)で表示されていた
            status: "error",
            duration: 3000,
          });
        } else {
          setIsLogin(response.isLogin);
          setUserName(response.name);
          toast.closeAll();
          if (response.isLogin) {
            toast({
              title: "ログイン成功",
              description: "ログインに成功しました。",
              status: "success",
              duration: 3000,
            });
            setIsAdmin(
              response.isAdmin || response.isDev || response.isTreasurer,
            );
            if (isSafeInternalPath(locate)) {
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
