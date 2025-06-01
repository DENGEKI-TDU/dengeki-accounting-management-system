import { checkJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import axios from "axios";
import { NextApiRequest } from "next";

export default async function handle(
  req: NextApiRequest,
  res: {
    status: any;
    json: (arg0: {
      id: number;
      date: Date;
      year: string;
      type: string;
      typeAlphabet: String;
      subtype: string;
      fixture: string;
      outcome: number;
    }) => void;
  }
) {
  const {
    id,
    date,
    type,
    typeAlphabet,
    subType,
    fixture,
    value,
    year,
    mode,
    income,
    outcome,
    from,
    to,
  } = req.body;
  const cookies = req.headers.cookie || "";
  const jwt = cookies
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const buyDate = new Date(date);
  const jwtSession = await checkJWT(jwt!);
  if (jwt != "" && jwtSession.isLogin) {
    if (from == "main") {
      if (mode == "income") {
        const result = await prisma.mainAccount.create({
          data: {
            date: buyDate,
            year: year,
            type: "",
            subtype: "",
            fixture: fixture,
            income: value,
            outcome: 0,
            typeAlphabet: "",
          },
        });
        res.status(200).json(result);
      }
      if (mode == "outcome") {
        const result = await prisma.mainAccount.create({
          data: {
            year: year,
            date: buyDate,
            type: type,
            subtype: subType,
            fixture: fixture,
            income: 0,
            outcome: value,
            typeAlphabet: typeAlphabet,
          },
        });

        res.json(result);
      }
      if (mode == "update" && jwtSession.isAdmin) {
        const result = await prisma.mainAccount.update({
          where: {
            id: Number(id),
          },
          data: {
            year: year,
            date: new Date(date),
            type: type,
            typeAlphabet: typeAlphabet,
            subtype: subType,
            fixture: fixture,
            income: Number(income),
            outcome: Number(outcome),
          },
        });
        res.json(result);
      }
      if (mode == "aid" && jwtSession.isAdmin) {
        const response = await prisma.mainAccount.findFirst({
          where: {
            id: Number(id),
          },
        });
        await prisma.mainAccount.deleteMany({
          where: {
            id: Number(id),
          },
        });
        if (to == "hatosai") {
          const result = await prisma.hatosaiAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "alumni") {
          const result = await prisma.alumniAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "clubsupport") {
          const result = await prisma.clubsupportAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "aid") {
          const result = await prisma.aid.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
      }
      if (mode == "delete") {
        const result = await prisma.mainAccount.delete({
          where: {
            id: id,
          },
        });
        res.json(result);
      }
    }
    if (from == "hatosai") {
      if (mode == "income") {
        const result = await prisma.hatosaiAccount.create({
          data: {
            date: buyDate,
            year: year,
            type: "",
            subtype: "",
            fixture: fixture,
            income: value,
            outcome: 0,
            typeAlphabet: "",
          },
        });
        res.status(200).json(result);
      }
      if (mode == "outcome") {
        const result = await prisma.hatosaiAccount.create({
          data: {
            year: year,
            date: buyDate,
            type: type,
            subtype: subType,
            fixture: fixture,
            income: 0,
            outcome: value,
            typeAlphabet: typeAlphabet,
          },
        });
        res.json(result);
      }
      if (mode == "update" && jwtSession.isAdmin) {
        const result = await prisma.hatosaiAccount.update({
          where: {
            id: Number(id),
          },
          data: {
            year: year,
            date: new Date(date),
            type: type,
            typeAlphabet: typeAlphabet,
            subtype: subType,
            fixture: fixture,
            income: Number(income),
            outcome: Number(outcome),
          },
        });
        res.json(result);
      }
      if (mode == "aid" && jwtSession.isAdmin) {
        const response = await prisma.hatosaiAccount.findFirst({
          where: {
            id: Number(id),
          },
        });
        await prisma.hatosaiAccount.deleteMany({
          where: {
            id: Number(id),
          },
        });
        if (to == "main") {
          const result = await prisma.mainAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "alumni") {
          const result = await prisma.alumniAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "clubsupport") {
          const result = await prisma.clubsupportAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "aid") {
          const result = await prisma.aid.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
      }
      if (mode == "delete") {
        const result = await prisma.hatosaiAccount.delete({
          where: {
            id: id,
          },
        });
        res.json(result);
      }
    }
    if (from == "clubsupport") {
      if (mode == "income") {
        const result = await prisma.clubsupportAccount.create({
          data: {
            date: buyDate,
            year: year,
            type: "",
            subtype: "",
            fixture: fixture,
            income: value,
            outcome: 0,
            typeAlphabet: "",
          },
        });
        res.status(200).json(result);
      }
      if (mode == "outcome") {
        const result = await prisma.clubsupportAccount.create({
          data: {
            year: year,
            date: buyDate,
            type: type,
            subtype: subType,
            fixture: fixture,
            income: 0,
            outcome: value,
            typeAlphabet: typeAlphabet,
          },
        });
        res.json(result);
      }
      if (mode == "update" && jwtSession.isAdmin) {
        const result = await prisma.clubsupportAccount.update({
          where: {
            id: Number(id),
          },
          data: {
            year: year,
            date: new Date(date),
            type: type,
            typeAlphabet: typeAlphabet,
            subtype: subType,
            fixture: fixture,
            income: Number(income),
            outcome: Number(outcome),
          },
        });
        res.json(result);
      }
      if (mode == "aid" && jwtSession.isAdmin) {
        const response = await prisma.clubsupportAccount.findFirst({
          where: {
            id: Number(id),
          },
        });
        await prisma.clubsupportAccount.deleteMany({
          where: {
            id: Number(id),
          },
        });
        if (to == "hatosai") {
          const result = await prisma.hatosaiAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "alumni") {
          const result = await prisma.alumniAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "main") {
          const result = await prisma.mainAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "aid") {
          const result = await prisma.aid.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
      }
      if (mode == "delete") {
        const result = await prisma.clubsupportAccount.delete({
          where: {
            id: id,
          },
        });
        res.json(result);
      }
    }
    if (from == "alumni") {
      if (mode == "income") {
        const result = await prisma.alumniAccount.create({
          data: {
            date: buyDate,
            year: year,
            type: "",
            subtype: "",
            fixture: fixture,
            income: value,
            outcome: 0,
            typeAlphabet: "",
          },
        });
        res.status(200).json(result);
      }
      if (mode == "outcome") {
        const result = await prisma.alumniAccount.create({
          data: {
            year: year,
            date: buyDate,
            type: type,
            subtype: subType,
            fixture: fixture,
            income: 0,
            outcome: value,
            typeAlphabet: typeAlphabet,
          },
        });
        res.json(result);
      }
      if (mode == "update" && jwtSession.isAdmin) {
        const result = await prisma.alumniAccount.update({
          where: {
            id: Number(id),
          },
          data: {
            year: year,
            date: new Date(date),
            type: type,
            typeAlphabet: typeAlphabet,
            subtype: subType,
            fixture: fixture,
            income: Number(income),
            outcome: Number(outcome),
          },
        });
        res.json(result);
      }
      if (mode == "aid" && jwtSession.isAdmin) {
        const response = await prisma.alumniAccount.findFirst({
          where: {
            id: Number(id),
          },
        });
        await prisma.alumniAccount.deleteMany({
          where: {
            id: Number(id),
          },
        });
        if (to == "hatosai") {
          const result = await prisma.hatosaiAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "main") {
          const result = await prisma.mainAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "clubsupport") {
          const result = await prisma.clubsupportAccount.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
        if (to == "aid") {
          const result = await prisma.aid.create({
            data: {
              date: response!.date,
              year: response!.year,
              type: response!.type,
              subtype: response!.subtype,
              fixture: response!.fixture,
              income: response!.income,
              outcome: response!.outcome,
              typeAlphabet: response!.typeAlphabet,
            },
          });
          res.json(result);
        }
      }
      if (mode == "delete") {
        const result = await prisma.alumniAccount.delete({
          where: {
            id: id,
          },
        });
        res.json(result);
      }
    }
  } else {
    res.status(403).end();
  }
}
