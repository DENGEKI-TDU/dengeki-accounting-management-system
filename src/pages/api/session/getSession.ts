import { checkJWT } from "@/lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (jwt != "" && jwt) {
    const checkData = await checkJWT(jwt);
    return res.json({
      name: checkData.name,
      isLogin: checkData.isLogin,
      isAdmin: checkData.isAdmin,
      isDev: checkData.isDev,
      isTreasurer: checkData.isTreasurer,
    });
  } else {
    return res.json({ isLogin: false });
  }
}
