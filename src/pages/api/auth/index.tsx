import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function Handler(
  req: {
    body: {
      sessionToken: string;
    };
  },
  res: NextApiResponse
) {
  const { sessionToken } = req.body;
  if(sessionToken){
		const sessionUser = await prisma.tokens.findFirst({
			where:{
				tokens:sessionToken
			}
		})
		res.status(200).json({"isAdmin":sessionUser?.isAdmin,"isUser":sessionUser?.isUser})
	} else {
		res.status(403).json("permission denied.")
	}
}