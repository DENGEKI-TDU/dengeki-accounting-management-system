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
    const threadID = "1257743150223462481"
    const hookurl = "https://discord.com/api/webhooks/1206230033421836349/RolsB6o1AmgwGUTe_ns89kIQCMkAvbdjpaY1OJ0Lxk4HrOg9TRw5Xjp-uBqUmzzMh9LC?thread_id="+threadID;
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
