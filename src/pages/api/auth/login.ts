import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";

export default async function Handler(
    req: {
        body: {
            tokens:string,
            loginDate: Date,
            isAdmin:boolean,
            isUser:boolean,
        }
    },
    res: NextApiResponse
){
    const {tokens,loginDate,isAdmin,isUser} = req.body;
    var limit = new Date(loginDate)
    limit = new Date(limit.setDate(limit.getDate()+3))
    const result = await prisma.tokens.create({
        data: {
            tokens:tokens,
            loginDate:loginDate,
            limit:limit,
            isAdmin:isAdmin,
            isUser:isUser,
        }
    })
    res.status(200).json(result)
}