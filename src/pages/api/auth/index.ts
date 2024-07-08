import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

const encryptSha256 = (str: string) => {
	const hash = createHash("sha256");
	hash.update(str);
	return hash.digest().toString("base64");
  };


export default async function Handler(
  req: {
    body: {
        id: string,
        pass: string,
        token: string,
        oneTimeToken: string,
        hostname:string,
        mode: string,
    };
  },
  res: NextApiResponse
) {
    const {id,pass,token,oneTimeToken,hostname, mode} = req.body;
  if(token && mode){
    if(mode == "get"){
			const sessionUser = await prisma.tokens.findFirst({
				where:{
					tokens:encryptSha256(token)
				}
			})
			res.status(200).json({"isAdmin":sessionUser?.isAdmin,"isUser":sessionUser?.isUser})
		}
		if(mode == "login"){
			const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
			const loginDate = new Date()
			var limit = new Date()
			limit = new Date(limit.setDate(limit.getDate()+3))
			const passResult = await prisma.oneTimeToken.findFirst({
				where: {
					token:encryptSha256(oneTimeToken),
				}
			})
			if(passResult && hostname.includes(allowHOST)){
				const tokenLimit = passResult.limit
				if(new Date() < tokenLimit){
						const authResult = await prisma.users.findFirst({
								where:{
									user:id,
									pass:pass
								}
						})
						if(authResult){
							const result = await prisma.tokens.create({
							data: {
								loginDate:loginDate,
								limit:limit,
								isAdmin:authResult.isAdmin,
								isUser:authResult.isUser,
								tokens:encryptSha256(token),
							}
						})
						await prisma.oneTimeToken.deleteMany({
							where: {
								token:encryptSha256(oneTimeToken),
							}
						})
						res.status(200).json({"status":"success"})
					} else {
						res.status(200).json({"status":"wrong"})
					}
				} else {
					res.status(403).json("Authentication information expired")
				}
			} else{
				res.status(403).json({"msg":"permission denied."})
			}
		}
		if(mode == "logout"){
			const result = await prisma.tokens.deleteMany({
					where:{
							tokens:encryptSha256(token),
					}
			})
			res.status(200).json(result)
		}
	} else {
		res.status(403).json({"msg":"permission denied."})
	}
}