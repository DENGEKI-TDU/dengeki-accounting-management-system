import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var year = new Date().getFullYear();
  const month = new Date().getMonth();
  if (month < 4) {
    year - 1;
  }
  const result = await prisma.accessHistory.create({
    data: {
      accessDate: new Date(),
    },
  });
  res.status(200).json(result);
}
