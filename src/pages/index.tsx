import { Button, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import LoginGate from "@/components/session/LoginGate";
import MenuLink from "@/components/session/MenuLink";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { PORTAL_ORIGIN } from "@/config/site";

/** ポータルで開く「会計の申請状況」ページ */
const PORTAL_QUEUE_PATH = "/accounting_queue";

export default function Home() {
  const { logout } = DengekiSSO();
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [portalLink, setPortalLink] = useState("");

  // ログイン状態をポータルへ引き継ぐための一時トークンを api から受け取り、リンクを作る
  useEffect(() => {
    if (!isLogin) return;
    axios
      .post("/api/redirect/getToken", { redirectTo: PORTAL_QUEUE_PATH })
      .then((res) => {
        // トークンは URL に入れるため、記号が含まれても壊れないようにエンコードする
        setPortalLink(`${PORTAL_ORIGIN}/redirect?token=${encodeURIComponent(res.data.token)}`);
      })
      .catch(() => setPortalLink(""));
  }, [isLogin]);

  return (
    <LoginGate>
      <VStack>
        <Text fontSize={"2xl"}>ホーム</Text>
        <MenuLink href="/income">本予算収入報告</MenuLink>
        <MenuLink href="/outcome">本予算支出報告</MenuLink>
        <MenuLink href="/other">本予算以外の収支報告ページ</MenuLink>
        {portalLink !== "" ? (
          <MenuLink href={portalLink} target="_blank">
            会計の申請状況確認ページ
          </MenuLink>
        ) : null}
        {isAdmin ? <MenuLink href="/admin">管理者用ページ</MenuLink> : null}
        <Button onClick={logout}>ログアウト</Button>
      </VStack>
    </LoginGate>
  );
}
