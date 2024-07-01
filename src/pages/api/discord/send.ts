import { NextApiResponse } from "next";
import prisma from "@/lib/prisma";

type Data = {
  msg?: string;
};


export default async function handle(
  req: {
    body: {
      valueContent: string;
    };
  },
  res: NextApiResponse<Data>
) {
  const { valueContent } = req.body;
  const sendData = {
    username: "支出報告くん",
    content: valueContent,
  };
  try {
    const result = await prisma.threadID.findFirst({
      where: {
        id: 1
      }
    });
    const threadID = result?.threadID
    const hookurl = process.env.NEXT_PUBLIC_HOOK_URL!+threadID;
    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(sendData));
    const response = await fetch(hookurl, {
      method: "POST",
      body: formData,
    });
    res.status(200).json({ msg: "success!!" });
  } catch (error) {
    console.error(error);
  }
}
