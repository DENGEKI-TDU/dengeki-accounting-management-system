import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import { NextApiResponse } from "next";

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
			}
	},
	res: NextApiResponse
	){
    const {id,pass,token,oneTimeToken} = req.body;
    const data = await fetch("https://ipapi.co/json")
    const ip = await data.json()
    const loginDate = new Date()
    var limit = new Date()
    limit = new Date(limit.setDate(limit.getDate()+3))
	const passResult = await prisma.oneTimeToken.findFirst({
		where: {
			token:encryptSha256(oneTimeToken),
		}
	})
	if(passResult && ip.ip.includes(process.env.NEXT_PUBLIC_HOST_IP)){
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
						tokens:token,
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
		res.status(403).json("permission denied.")
	}
}