import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: {
    body: {
        threadID: string,
        inputPass: string,
    }
  } ,
  res: NextApiResponse
) {
    const {threadID,inputPass} = req.body;
    let isAdmin = false;
    let isUser = false;
    const sessionToken = inputPass
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
    if(isAdmin || isUser){
      const result = await prisma.threadID.update({
        where: {
          id: 1
        },
        data:{
            threadID: threadID,
        }
      });
      res.status(200).json(result?.threadID);
    } else {
      res.status(403).end()
    }
}
