import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import axios from "axios";

export default async function handle(
  req: {
    body: {
      year: string;
      inputPass: string;
      oneTimeToken: string;
      hostname: string;
      from: string;
    };
  },
  res: NextApiResponse
) {
  const { year, inputPass, oneTimeToken, hostname, from } = req.body;
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!;
  const sessionToken = inputPass;
  let http = "http";
  if (process.env.NODE_ENV == "production") {
    http = "https";
  }
  axios
    .post(
      http + "://" + process.env.NEXT_PUBLIC_SSO_DOMAIN + "/api/auth/authToken",
      {
        oneTimeToken,
      }
    )
    .then(async (pr) => {
      const passResult = pr.data;
      if (hostname.includes(allowHOST)) {
        const tokenLimit = passResult.limit;
        if (new Date() < new Date(tokenLimit)) {
          axios
            .post(
              http + "://" + process.env.NEXT_PUBLIC_SSO_DOMAIN + "/api/auth",
              {
                token: sessionToken,
                mode: "get",
              }
            )
            .then(async (response) => {
              const limit = response.data.limit;
              if (new Date(limit) > new Date()) {
                response.data.isAdmin;
                if (response.data.isAdmin) {
                  if (from == "main") {
                    const result = await prisma.mainAccount.findMany({
                      where: {
                        year: year,
                      },
                      orderBy: [
                        { date: "asc" },
                        { income: "desc" },
                        { outcome: "desc" },
                        { id: "asc" },
                      ],
                    });
                    let response: String[] = [];
                    for (let i = 0; i < result.length; i++) {
                      response.push(String(JSON.stringify(result[i])));
                    }
                    res.status(200).json({ data: result });
                  }
                  if (from == "hatosai") {
                    const result = await prisma.hatosaiAccount.findMany({
                      where: {
                        year: year,
                      },
                      orderBy: { date: "asc" },
                    });
                    let response: String[] = [];
                    for (let i = 0; i < result.length; i++) {
                      response.push(String(JSON.stringify(result[i])));
                    }
                    res.status(200).json({ data: result });
                  }
                  if (from == "clubsupport") {
                    const result = await prisma.clubsupportAccount.findMany({
                      where: {
                        year: year,
                      },
                      orderBy: { date: "asc" },
                    });
                    let response: String[] = [];
                    for (let i = 0; i < result.length; i++) {
                      response.push(String(JSON.stringify(result[i])));
                    }
                    res.status(200).json({ data: result });
                  }
                  if (from == "alumni") {
                    const result = await prisma.alumniAccount.findMany({
                      where: {
                        year: year,
                      },
                      orderBy: { date: "asc" },
                    });
                    let response: String[] = [];
                    for (let i = 0; i < result.length; i++) {
                      response.push(String(JSON.stringify(result[i])));
                    }
                    res.status(200).json({ data: result });
                  }
                } else {
                  res.status(403).json({ msg: "Query error" });
                }
              }
            })
            .catch((error) => {
              res.status(403).json(error);
            });
        } else {
          res.status(403).json({ msg: "Authentication information expired" });
        }
      } else {
        res.status(403).json({ msg: "Network Authentication error" });
      }
    })
    .catch((error) => {
      res.status(403).json(error);
    });
}
