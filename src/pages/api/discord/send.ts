import { NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { supabase } from "../../../../utils/supabase/supabase";

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
  const splitedValueContent = valueContent.split("\n");
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
    const hookurl =
      result?.hookurl + "?thread_id=" + result?.threadID + "&wait=true";

    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(sendData));
    const response = await fetch(hookurl, {
      method: "POST",
      body: formData,
    });
    const discordResponse = await response.json();
    const discordLink = `https://discord.com/channels/${process.env.DISCORD_SERVER_ID}/${discordResponse.channel_id}/${discordResponse.id}`;
    if (splitedValueContent[0] == "# 収入報告") {
      const queueValue = {
        created_at: new Date(splitedValueContent[1].split(" : ")[1]),
        income: Number(splitedValueContent[3].split(" : ")[1].slice(1)),
        outcome: 0,
        hasApproved: false,
        hasPaymented: false,
        hasGetReceipt: false,
        from: splitedValueContent[4].split(" : ")[1],
        name: splitedValueContent[5].split(" : ")[1],
        type: mode,
        link: discordLink,
      };
      const { error } = await supabase
        .from("accouting_queue")
        .insert(queueValue);
      if (error) {
        console.error(new Date(), error);
      }
    } else {
      const queueValue = {
        created_at: new Date(splitedValueContent[1].split(" : ")[1]),
        income: 0,
        outcome: Number(splitedValueContent[5].split(" : ")[1].slice(1)),
        hasApproved: false,
        hasPaymented: false,
        hasGetReceipt: false,
        from: splitedValueContent[6].split(" : ")[1],
        name: splitedValueContent[7].split(" : ")[1],
        type: mode,
        link: discordLink,
      };
      const { error } = await supabase
        .from("accouting_queue")
        .insert(queueValue);
      if (error) {
        console.error(new Date(), error);
      }
    }
    res.status(200).json({ msg: "success!!" });
  } catch (error) {
    console.error(error);
  }
}
