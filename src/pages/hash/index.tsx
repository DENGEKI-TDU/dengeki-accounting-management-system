import { createHash } from "crypto";

const encryptSha256 = (str: string) => {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest().toString("base64");
};

export default function Home() {
  return <p>{encryptSha256("-4sL-PFkMRjJYyRz")}</p>;
}
