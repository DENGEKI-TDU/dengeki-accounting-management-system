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
      hostname:string
    };
  },
  res: NextApiResponse
) {
  const { year,inputPass, oneTimeToken, hostname } = req.body;
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
  let isAdmin = false;
  const sessionToken = inputPass
	const passResult = await prisma.oneTimeToken.findFirst({
		where: {
			token:encryptSha256(oneTimeToken),
		}
	})
  if(hostname.includes(allowHOST) && passResult){
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