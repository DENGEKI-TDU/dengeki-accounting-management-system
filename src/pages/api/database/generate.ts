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
      year:string
      inputPass: string;
      oneTimeToken: string;
    };
  },
  res: NextApiResponse
) {
  const { year,inputPass, oneTimeToken } = req.body;
  console.log(year,inputPass,oneTimeToken)
  let isAdmin = false;
  const data = await fetch("https://ipapi.co/json")
  const ip = await data.json()
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
        console.log(data)
        if(data){
          if(data.limit > new Date()){
            isAdmin = data.isAdmin
          }
        }
      } catch(error) {
        console.error(error)
      }
      if((isAdmin) && ip.ip.includes(process.env.NEXT_PUBLIC_HOST_IP)){
        const result = await prisma.mainAccount.findMany({
          where:{
            year:year
          },
          orderBy:[{income:"desc"},{date:"asc"}]
        });
        let response:String[] = []
        for(let i=0;i<result.length;i++){
            response.push(String(JSON.stringify(result[i])))
        }
        res.json({"data":result});
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
