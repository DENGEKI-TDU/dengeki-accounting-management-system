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
        id: number;
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
  const { id,inputPass, oneTimeToken, hostname } = req.body;
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
        const response = await prisma.mainAccount.findFirst({
            where:{
                id: Number(id),
            },
        })
        await prisma.mainAccount.deleteMany({
            where:{
                id: Number(id),
            },
        })
        const result = await prisma.aid.create({
            data:{
                date: response!.date,
                year: response!.year,
                type: response!.type,
                subtype: response!.subtype,
                fixture: response!.fixture,
                income: response!.income,
                outcome: response!.outcome,
                typeAlphabet: response!.typeAlphabet,
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
