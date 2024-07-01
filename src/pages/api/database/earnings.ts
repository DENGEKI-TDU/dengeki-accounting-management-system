import prisma from "@/lib/prisma";
import type { NextApiResponse } from "next";

export default async function handle(
  req: {
    body: {
      year: string;
    };
  },
  res: NextApiResponse
) {
  const {year} = req.body
  const result = await prisma.mainAccount.findMany({
    where: {
      year: year
    }
  });
  let income:number = 0;
  let outcome: number = 0;
  for(var i=0;i<result.length;i++){
    income += result[i].income
    outcome += result[i].outcome
  }
  var balance = income-outcome
  var response = {"income":income,"outcome":outcome,"balance":balance}
  var send_string = JSON.stringify(response)
  res.status(200).json(send_string);
}
