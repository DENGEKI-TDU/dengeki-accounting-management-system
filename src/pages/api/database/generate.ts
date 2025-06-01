import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { checkJWT } from "@/lib/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { year, hostname, from } = req.body;
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!;
  if (
    hostname.includes(allowHOST) &&
    jwt != "" &&
    (await checkJWT(jwt!)).isAdmin
  ) {
    if (from == "main") {
      const result = await prisma.mainAccount.findMany({
        where: {
          year: year,
        },
        orderBy: [
          { date: "asc" },
          { income: "desc" },
          { outcome: "desc" },
          { id: "asc" },
        ],
      });
      let response: String[] = [];
      for (let i = 0; i < result.length; i++) {
        response.push(String(JSON.stringify(result[i])));
      }
      res.status(200).json({ data: result });
    }
    if (from == "hatosai") {
      const result = await prisma.hatosaiAccount.findMany({
        where: {
          year: year,
        },
        orderBy: { date: "asc" },
      });
      let response: String[] = [];
      for (let i = 0; i < result.length; i++) {
        response.push(String(JSON.stringify(result[i])));
      }
      res.status(200).json({ data: result });
    }
    if (from == "clubsupport") {
      const result = await prisma.clubsupportAccount.findMany({
        where: {
          year: year,
        },
        orderBy: { date: "asc" },
      });
      let response: String[] = [];
      for (let i = 0; i < result.length; i++) {
        response.push(String(JSON.stringify(result[i])));
      }
      res.status(200).json({ data: result });
    }
    if (from == "alumni") {
      const result = await prisma.alumniAccount.findMany({
        where: {
          year: year,
        },
        orderBy: { date: "asc" },
      });
      let response: String[] = [];
      for (let i = 0; i < result.length; i++) {
        response.push(String(JSON.stringify(result[i])));
      }
      res.status(200).json({ data: result });
    }
  } else {
    res.status(403).end();
  }
}
