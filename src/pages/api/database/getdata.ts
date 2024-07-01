import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.accessHistory.update({
    where: {
      id: 1
    },
    data: {
      accessDate: new Date(),
    },
  });
  res.status(200).json(result);
}
