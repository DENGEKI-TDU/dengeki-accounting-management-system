import { NextApiResponse } from "next";
import prisma from "@/lib/prisma";

type Data = {
  msg?: string;
};

export default async function handle(
  req: {
    body: {
      username: string;
      valueContent: string;
      mode: string;
    };
  },
  res: NextApiResponse<Data>
) {
  const { username, valueContent, mode } = req.body;

  const sendData = {
    username: username,
    content: valueContent,
  };
  try {
    const result = await prisma.threadID.findFirst({
      where: {
        mode: mode,
      },
    });
    const hookurl = result?.hookurl + "?thread_id=" + result?.threadID;

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
