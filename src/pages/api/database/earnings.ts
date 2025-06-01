import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkJWT } from "@/lib/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { year } = req.body;
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  const isAdmin =
    (await checkJWT(jwt!)).isAdmin ||
    (await checkJWT(jwt!)).isDev ||
    (await checkJWT(jwt!)).isTreasurer;
  if (jwt != "" && isAdmin) {
    const result = await prisma.mainAccount.findMany({
      where: {
        year: year,
      },
    });
    if (result.length != 0) {
      let income: number = 0;
      let outcome: number = 0;
      for (var i = 0; i < result.length; i++) {
        income += result[i].income;
        outcome += result[i].outcome;
      }
      var balance = income - outcome;
      const hatoyamaResult = await prisma.hatosaiAccount.findMany({
        where: {
          year: year,
        },
      });
      let hatoyamaIncome: number = 0;
      let hatoyamaOutcome: number = 0;
      for (var i = 0; i < hatoyamaResult.length; i++) {
        hatoyamaIncome += hatoyamaResult[i].income;
        hatoyamaOutcome += hatoyamaResult[i].outcome;
      }
      var hatoyamaBalance = hatoyamaIncome - hatoyamaOutcome;
      const csResult = await prisma.clubsupportAccount.findMany({
        where: {
          year: year,
        },
      });
      let csIncome: number = 0;
      let csOutcome: number = 0;
      for (var i = 0; i < csResult.length; i++) {
        csIncome += csResult[i].income;
        csOutcome += csResult[i].outcome;
      }
      var csBalance = csIncome - csOutcome;
      const alumniResult = await prisma.alumniAccount.findMany({
        where: {
          year: year,
        },
      });
      let alumniIncome: number = 0;
      let alumniOutcome: number = 0;
      for (var i = 0; i < alumniResult.length; i++) {
        alumniIncome += alumniResult[i].income;
        alumniOutcome += alumniResult[i].outcome;
      }
      var alumniBalance = alumniIncome - alumniOutcome;
      const aidResult = await prisma.aid.findMany({
        where: {
          year: year,
        },
      });
      let aidIncome: number = 0;
      let aidOutcome: number = 0;
      for (var i = 0; i < aidResult.length; i++) {
        aidIncome += aidResult[i].income;
        aidOutcome += aidResult[i].outcome;
      }
      var aidBalance = aidIncome - aidOutcome;
      res.status(200).json({
        income: income,
        outcome: outcome,
        balance: balance,
        hatosaiIncome: hatoyamaIncome,
        hatosaiOutcome: hatoyamaOutcome,
        hatosaiBalance: hatoyamaBalance,
        csIncome: csIncome,
        csOutcome: csOutcome,
        csBalance: csBalance,
        alumniIncome: alumniIncome,
        alumniOutcome: alumniOutcome,
        alumniBalance: alumniBalance,
        aidIncome: aidIncome,
        aidOutcome: aidOutcome,
        aidBalance: aidBalance,
      });
    } else {
      res.status(200).json({
        income: 0,
        outcome: 0,
        balance: 0,
        hatosaiIncome: 0,
        hatosaiOutcome: 0,
        hatosaiBalance: 0,
        csIncome: 0,
        csOutcome: 0,
        csBalance: 0,
        alumniIncome: 0,
        alumniOutcome: 0,
        alumniBalance: 0,
        aidIncome: 0,
        aidOutcome: 0,
        aidBalance: 0,
      });
    }
  } else {
    res.status(403).end();
  }
}
