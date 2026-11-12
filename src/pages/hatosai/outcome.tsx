import LoginGate from "@/components/session/LoginGate";
import Outcome from "@/components/outcome";

export default function Home() {
  return <LoginGate>{(userName) => <Outcome from="hatosai" userName={userName} />}</LoginGate>;
}
