import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: {
    body: {
        threadID: string,
    }
  } ,
  res: NextApiResponse
) {
    const {threadID} = req.body;
  const result = await prisma.threadID.update({
    where: {
      id: 1
    },
    data:{
        threadID: threadID,
    }
  });
  res.status(200).json(result?.threadID);
}
