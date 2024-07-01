import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import type { NextApiResponse } from "next";
import { env } from "process";

const encryptSha256 = (str: string) => {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest().toString("base64");
};

export default async function handle(
  req: {
    body: {
      year: string;
      inputPass: string;
    };
  },
  res: NextApiResponse
) {
  const pass = process.env.EARNINGPASS
  const {year,inputPass} = req.body
  if(inputPass){
    const hashPass = encryptSha256(inputPass)
    if(pass == hashPass) {
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
    else {
      res.status(403).json("permission denied.")
    }
  } else {
    res.status(403).json("permission denied.")
  }
}
