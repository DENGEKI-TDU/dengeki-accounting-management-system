import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import { NextApiResponse } from "next";

const encryptSha256 = (str: string) => {
	const hash = createHash("sha256");
	hash.update(str);
	return hash.digest().toString("base64");
  };


export default async function handle(
  req: {
    body: {
        id: number;
        date: Date;
        year: string;
        type: string;
        typeAlphabet: string;
        subtype: string;
        fixture: string;
        income: number;
        outcome: number;
        inputPass: string;
        oneTimeToken: string;
        hostname:string
    };
  },
  res: {
    status: any;
    json: (arg0: {
      id: number;
      date: Date;
      year: string;
      type: string;
      typeAlphabet: String;
      subtype: string;
      fixture: string;
      outcome: number;
    }) => void;
    }
) {
  const { id,year,date,type,typeAlphabet,subtype,fixture,income,outcome,inputPass, oneTimeToken, hostname } = req.body;
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
  let isAdmin = false;
  const sessionToken = inputPass
	const passResult = await prisma.oneTimeToken.findFirst({
		where: {
			token:encryptSha256(oneTimeToken),
		}
	})
  if(hostname.includes(allowHOST) &&passResult){
		const tokenLimit = passResult.limit
		if(new Date() < tokenLimit){
      try {
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
      } catch(error) {
        console.error(error)
      }
      if((isAdmin)){
        const result = await prisma.mainAccount.update({
            where:{
                id: Number(id),
            },
            data: {
                year: year,
                date: new Date(date),
                type: type,
                typeAlphabet: typeAlphabet,
                subtype: subtype,
                fixture:fixture,
                income:Number(income),
                outcome:Number(outcome),
            }
        })
        res.json(result);
      } else {
        res.status(403).json("permission denied.")
      }
    } else {
      res.status(403).json("Authentication information expired")
    }
  } else {
    res.status(403).json("permission denied.")
  }
}
