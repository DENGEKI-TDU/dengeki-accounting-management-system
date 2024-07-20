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
      hostname:string;
      from:string;
    };
  },
  res: NextApiResponse
) {
  const { year,inputPass, oneTimeToken, hostname, from } = req.body;
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
  let isAdmin = false;
  const sessionToken = inputPass
  const body = {
    oneTimeToken
  }
  const pr = await fetch("https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth/authToken",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(body)
  })
  const passResult = await pr.json()
  if(hostname.includes(allowHOST) && passResult){
		const tokenLimit = passResult.limit
		if(new Date() < new Date(tokenLimit)){
      try {
        const body = {
          token:sessionToken,
          mode:"get"
        }
        const response = await fetch("https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        });
        const data = await response.json()
        if(data){
          if(new Date(data.limit) > new Date()){
            isAdmin = data.isAdmin
          }
        }
      } catch(error) {
        console.error(error)
      }
      if((isAdmin)){
        if(from == "main"){
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
        }
        if(from == "hatosai"){
          const result = await prisma.hatosaiAccount.findMany({
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
        }
        if(from == "clubsupport"){
          const result = await prisma.clubsupportAccount.findMany({
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
        }
        if(from == "alumni"){
          const result = await prisma.alumniAccount.findMany({
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
        }
      } else {
        res.status(403).end()
      }
    } else {
      res.status(403).json({"msg":"Authentication information expired"})
    }
  } else {
    res.status(403).end()
  }
}