import { Button, Text, VStack } from "@chakra-ui/react";
import LoginGate from "./LoginGate";
import MenuLink from "./MenuLink";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { BudgetKey } from "@/config/budgets";

/**
 * 本予算以外の各予算(鳩山祭・校友会・後援会)のホーム画面。
 * 以前は pages/hatosai, alumni, clubsupport の index.tsx にほぼ同じ内容がコピーされていた。
 */
export default function BudgetHome({ budgetKey, title }: { budgetKey: BudgetKey; title: string }) {
  const { logout } = DengekiSSO();
  return (
    <LoginGate>
      <VStack>
        <Text fontSize={"2xl"}>{title}</Text>
        <MenuLink href={`/${budgetKey}/income`}>収入報告</MenuLink>
        <MenuLink href={`/${budgetKey}/outcome`}>支出報告</MenuLink>
        <Button onClick={logout}>ログアウト</Button>
      </VStack>
    </LoginGate>
  );
}
