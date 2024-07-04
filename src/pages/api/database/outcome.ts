import prisma from "@/lib/prisma";
import { createHash } from "crypto";

const encryptSha256 = (str: string) => {
	const hash = createHash("sha256");
	hash.update(str);
	return hash.digest().toString("base64");
  };


export default async function handle(
  req: {
    body: {
      date: string;
      type: string;
      typeAlphabet: string;
      subType: string;
      fixture: string;
      value: number;
      year: string;
      inputPass: string;
      oneTimeToken: string;
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
  const { date, type, typeAlphabet, subType, fixture, value, year, inputPass, oneTimeToken } = req.body;
  let isAdmin = false;
  let isUser = false;
	const passResult = await prisma.oneTimeToken.findFirst({
		where: {
			token:encryptSha256(oneTimeToken),
		}
	})
  const data = await fetch("https://ipapi.co/json")
  const ip = await data.json()
  const buyDate = new Date(date);
  const sessionToken = inputPass
  if(passResult && ip.ip.includes(process.env.NEXT_PUBLIC_HOST_IP)){
    if(new Date() < passResult.limit){
      try {
        const data = await prisma.tokens.findFirst({
          where:{
            tokens:sessionToken
          }
        });
        if(data){
          if(data.limit > new Date()){
            isUser = data.isUser
            isAdmin = data.isAdmin
          }
        }
      } catch(error) {
        console.error(error)
      }
      if((isAdmin || isUser)){
        const result = await prisma.mainAccount.create({
          data: {
            year: year,
            date: buyDate,
            type: type,
            subtype: subType,
            fixture: fixture,
            income: 0,
            outcome: value,
            typeAlphabet: typeAlphabet,
          },
        });
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
