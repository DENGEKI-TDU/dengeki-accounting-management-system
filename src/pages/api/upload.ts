import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs, { createWriteStream } from "fs";
import { useState } from "react";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  msg?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return;

  const form = formidable({ multiples: true, uploadDir: __dirname });
  const hookurl = process.env.NEXT_PUBLIC_HOOK_URL!;
  var imagePath = "";
  var imageName = "";

  form.onPart = async (part) => {
    if (part.originalFilename === "" || !part.mimetype) {
      form._handlePart(part);
    } else if (part.originalFilename) {
      console.log(part.name);
      imagePath = "./public/images/" + part.originalFilename;
      imageName = part.originalFilename;
      const path = "./public/images/" + part.originalFilename;
      const stream = createWriteStream(path);
      part.pipe(stream);

      part.on("end", () => {
        console.log(part.originalFilename + " is uploaded");
        stream.close();
      });
    }
  };
  console.log(imagePath);
  console.log(imageName);
  form.parse(req);
  res.status(200).json({ msg: "success!!" });
}
