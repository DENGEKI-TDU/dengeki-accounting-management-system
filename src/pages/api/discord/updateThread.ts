import { checkJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { threadID } = req.body;
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  console.log(threadID);
  if (
    jwt != "" &&
    ((await checkJWT(jwt!)).isAdmin ||
      (await checkJWT(jwt!)).isDev ||
      (await checkJWT(jwt!)).isTreasurer)
  ) {
    try {
      await prisma.threadID.updateMany({
        where: {
          mode: "main",
        },
        data: {
          threadID: threadID.main,
        },
      });
      await prisma.threadID.updateMany({
        where: {
          mode: "hatosai",
        },
        data: {
          threadID: threadID.hatosai,
        },
      });
      await prisma.threadID.updateMany({
        where: {
          mode: "alumni",
        },
        data: {
          threadID: threadID.alumni,
        },
      });
      await prisma.threadID.updateMany({
        where: {
          mode: "clubsupport",
        },
        data: {
          threadID: threadID.clubSupport,
        },
      });
      res.status(200).end();
    } catch (error) {
      console.error(error);
      res.status(403).json(error);
    }
  } else {
    res.status(403).end();
  }
}
