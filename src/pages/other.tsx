import { Button, Text, VStack } from "@chakra-ui/react";
import LoginGate from "@/components/session/LoginGate";
import MenuLink from "@/components/session/MenuLink";
import { DengekiSSO } from "@/hooks/UseLoginState";

/** 本予算以外の予算の一覧 */
export default function Home() {
  const { logout } = DengekiSSO();
  return (
    <LoginGate>
      <VStack>
        <Text fontSize={"2xl"}>本予算を除く予算申請ページ</Text>
        <MenuLink href="/hatosai">鳩山祭関連</MenuLink>
        <MenuLink href="/clubsupport">後援会費関連</MenuLink>
        <MenuLink href="/alumni">校友会費関連</MenuLink>
        <Button onClick={logout}>ログアウト</Button>
      </VStack>
    </LoginGate>
  );
}
