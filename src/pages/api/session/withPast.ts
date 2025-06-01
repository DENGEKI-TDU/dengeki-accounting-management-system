import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const HomeDomain = process.env.DENGEKI_DOMAIN as string;
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (jwt != "" && jwt) {
    const response = await axios.post(`${HomeDomain}/api/portal/getMembers`, {
      token: jwt,
    });
    return res.json(response.data);
  } else {
    return res.status(403);
  }
}
