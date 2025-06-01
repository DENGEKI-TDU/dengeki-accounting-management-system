import { checkJWT } from "@/lib/jwt";
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
  const { name, password } = req.body;
  const fetchResponse = await fetch("https://sso-express.vercel.app/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, password: password }),
  });
  const response = await fetchResponse.json();
  if (response.status == "success") {
    const checkData = await checkJWT(response.token);
    res.setHeader(
      "Set-Cookie",
      `token=${response.token};Path=/; HttpOnly; Secure; Max-Age=10800`
    );
    res.json({
      name: checkData.name,
      isAdmin: checkData.isAdmin,
      isDev: checkData.isDev,
    });
  } else {
    res.status(500).json({ status: "failed" });
  }
}
