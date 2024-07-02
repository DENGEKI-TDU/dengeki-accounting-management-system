import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";

export default async function Handler(
    req: {
        body: {
            tokens:string,
        }
    },
    res: NextApiResponse
){
    const {tokens} = req.body;
    const result = await prisma.tokens.deleteMany({
        where:{
            tokens:tokens,
        }
    })
    res.status(200).json(result)
}