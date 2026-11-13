import LoginGate from "@/components/session/LoginGate";
import IncomeForm from "@/components/income";

export default function Home() {
  return <LoginGate>{(userName) => <IncomeForm from="clubsupport" userName={userName} />}</LoginGate>;
}
