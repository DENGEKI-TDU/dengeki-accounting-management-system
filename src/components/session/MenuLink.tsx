import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";
import { BRAND_COLOR } from "@/config/theme";

/** ホーム画面などに並べる、下線付きのメニュー項目 */
export default function MenuLink({
  href,
  target,
  children,
}: {
  href: string;
  target?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} target={target}>
      <Box borderBottom={`1px solid ${BRAND_COLOR}`}>{children}</Box>
    </Link>
  );
}
