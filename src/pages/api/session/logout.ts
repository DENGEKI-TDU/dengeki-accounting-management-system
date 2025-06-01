import { NextApiResponse } from "next";

export default async function handler(
  req: {
    body: {
      name: string;
      password: string;
    };
  },
  res: NextApiResponse
) {
  res.setHeader("Set-Cookie", `token=;Path=/; HttpOnly; Secure; Max-Age=10800`);
  res.json({
    status: "success",
  });
}
