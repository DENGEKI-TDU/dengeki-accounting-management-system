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
      sessionToken: string;
    };
  },
  res: NextApiResponse
) {
  const pass = process.env.EARNINGPASS
  const {year,inputPass,sessionToken} = req.body
  let isAdmin:boolean = false
  const data = await prisma.tokens.findFirst({
    where:{
      tokens:sessionToken
    }
  });
  if(data){
    if(data.limit > new Date()){
      isAdmin = data.isAdmin
    }
  }
  if(inputPass || sessionToken){
    const hashPass = encryptSha256(inputPass)
    if(pass == hashPass || isAdmin) {
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
      const hatoyamaResult = await prisma.hatosaiAccount.findMany({
        where: {
          year: year
        }
      });
      let hatoyamaIncome:number = 0;
      let hatoyamaOutcome: number = 0;
      for(var i=0;i<hatoyamaResult.length;i++){
        hatoyamaIncome += hatoyamaResult[i].income
        hatoyamaOutcome += hatoyamaResult[i].outcome
      }
      var hatoyamaBalance = hatoyamaIncome-hatoyamaOutcome
      const csResult = await prisma.clubsupportAccount.findMany({
        where: {
          year: year
        }
      });
      let csIncome:number = 0;
      let csOutcome: number = 0;
      for(var i=0;i<csResult.length;i++){
        csIncome += csResult[i].income
        csOutcome += csResult[i].outcome
      }
      var csBalance = csIncome-csOutcome
      const alumniResult = await prisma.alumniAccount.findMany({
        where: {
          year: year
        }
      });
      let alumniIncome:number = 0;
      let alumniOutcome: number = 0;
      for(var i=0;i<alumniResult.length;i++){
        alumniIncome += alumniResult[i].income
        alumniOutcome += alumniResult[i].outcome
      }
      var alumniBalance = alumniIncome-alumniOutcome
      var response = {"income":income,"outcome":outcome,"balance":balance,"hatosaiIncome":hatoyamaIncome,"hatosaiOutcome":hatoyamaOutcome,"hayosaiBalance":hatoyamaBalance,"csIncome":csIncome,"csOutcome":csOutcome,"csBalance":csBalance,"alumniIncome":alumniIncome,"alumniOutcome":alumniOutcome,"alumniBalance":alumniBalance}
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
