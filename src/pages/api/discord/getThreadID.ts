import { checkJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (
    jwt != "" &&
    ((await checkJWT(jwt!)).isAdmin ||
      (await checkJWT(jwt!)).isDev ||
      (await checkJWT(jwt!)).isTreasurer)
  ) {
    const mainResult = await prisma.threadID.findFirst({
      where: { mode: "main" },
    });
    const hatosaiResult = await prisma.threadID.findFirst({
      where: { mode: "hatosai" },
    });
    const almuniResult = await prisma.threadID.findFirst({
      where: { mode: "alumni" },
    });
    const csResult = await prisma.threadID.findFirst({
      where: { mode: "clubsupport" },
    });
    res.status(200).json({
      main: mainResult?.threadID,
      hatosai: hatosaiResult?.threadID,
      alumni: almuniResult?.threadID,
      clubsupport: csResult?.threadID,
    });
  } else {
    res.status(403).end();
  }
}
