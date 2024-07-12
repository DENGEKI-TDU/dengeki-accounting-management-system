import prisma from "@/lib/prisma";
import { createHash, randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const encryptSha256 = (str: string) => {
    const hash = createHash("sha256");
    hash.update(str);
    return hash.digest().toString("base64");
  };

export default async function Handler(
	req: {
        body:{
            hostname:string
        }
    },
	res: NextApiResponse
	){
    const {hostname} = req.body;
    const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
    if(hostname.includes(allowHOST)){
        const randomToken = randomUUID()
        const result = await prisma.oneTimeToken.create({
            data: {
                token: encryptSha256(randomToken),
                limit:new Date(new Date().setMinutes(new Date().getMinutes()+3))
            }
        })
        res.status(200).json({"token":randomToken})
    } else {
        res.status(403).end()
    }
}