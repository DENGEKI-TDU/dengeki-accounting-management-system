import fs from "fs";
import { NextApiResponse } from "next";

type Data = {
  msg?: string;
};

export default async function handle(
  req: {
    body: {
      valueContent: string;
      fileName: string;
    };
  },
  res: NextApiResponse<Data>
) {
  const { valueContent, fileName } = req.body;
  const hookurl = process.env.NEXT_PUBLIC_HOOK_URL!;
  var imageType: string;
  console.log(fileName.split(".")[1]);
  const jpeg = ["jpg", "jpeg", "jfif", "pjpeg", "pjp"];
  if (jpeg.includes(fileName.split(".")[1])) {
    imageType = "image/jpeg";
  } else {
    imageType = "image/" + fileName.split(".")[1];
  }
  const sendData = {
    username: "支出報告くん",
    content: valueContent,
  };
  try {
    const filePath = `./public/images/${fileName}`;
    console.log(filePath, imageType);
    const file = fs.readFileSync(filePath);
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([file], { type: imageType }),
      "receipt.png"
    );
    formData.append("payload_json", JSON.stringify(sendData));
    // console.log(formData);
    const response = await fetch(hookurl, {
      method: "POST",
      body: formData,
    });
    res.status(200).json({ msg: "success!!" });
  } catch (error) {
    console.error(error);
  }
}
