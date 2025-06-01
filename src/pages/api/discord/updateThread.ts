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
  if (jwt != "" && (await checkJWT(jwt!)).isAdmin) {
    const result = await prisma.threadID.update({
      where: {
        id: 1,
      },
      data: {
        threadID: threadID,
      },
    });
    res.status(200).json(result?.threadID);
  } else {
    res.status(403).end();
  }
}
