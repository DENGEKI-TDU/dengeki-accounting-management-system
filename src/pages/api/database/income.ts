import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import { hostname } from "os";

const encryptSha256 = (str: string) => {
	const hash = createHash("sha256");
	hash.update(str);
	return hash.digest().toString("base64");
  };


export default async function handle(
  req: {
    body: {
      date: string;
      fixture: string;
      value: number;
      year: string;
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
  const { date, fixture, value, year,inputPass, oneTimeToken, hostname } = req.body;
  let isAdmin = false;
  let isUser = false;
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
  const buyDate = new Date(date);
  const sessionToken = inputPass
	const passResult = await prisma.oneTimeToken.findFirst({
		where: {
			token:encryptSha256(oneTimeToken),
		}
	})
  if(passResult){
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
            isUser = data.isUser
            isAdmin = data.isAdmin
          }
        }
      } catch(error) {
        console.error(error)
      }
      if((isAdmin || isUser) && hostname.includes(allowHOST)){
        const result = await prisma.mainAccount.create({
          data: {
            date: buyDate,
            year: year,
            type: "",
            subtype: "",
            fixture: fixture,
            income: value,
            outcome: 0,
            typeAlphabet: "",
          },
        });
        res.status(200).json(result);
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
