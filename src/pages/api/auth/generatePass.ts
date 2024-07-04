import prisma from "@/lib/prisma";
import { createHash, randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const encryptSha256 = (str: string) => {
    const hash = createHash("sha256");
    hash.update(str);
    return hash.digest().toString("base64");
  };

export default async function Handler(
	req: NextApiRequest,
	res: NextApiResponse
	){
    const data = await fetch("https://ipapi.co/json")
    const ip = await data.json()
    const allowIP = process.env.NEXT_PUBLIC_HOST_IP
    console.log(ip.ip,allowIP)
    // if(ip.ip.includes(process.env.NEXT_PUBLIC_HOST_IP)){
        const randomToken = randomUUID()
        const result = await prisma.oneTimeToken.create({
            data: {
                token: encryptSha256(randomToken),
                limit:new Date(new Date().setMinutes(new Date().getMinutes()+3))
            }
        })
        res.status(200).json({"token":randomToken,"ip":ip.ip,"allow":allowIP})
    // } else {
    //     res.status(403).json("permission denied.")
    // }
}