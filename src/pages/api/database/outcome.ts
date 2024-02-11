import prisma from "@/lib/prisma";

export default async function handle(
  req: {
    body: {
      date: string;
      type: string;
      typeAlphabet: string;
      subType: string;
      fixture: string;
      value: number;
    };
  },
  res: {
    json: (arg0: {
      id: number;
      date: Date;
      type: string;
      typeAlphabet: String;
      subtype: string;
      fixture: string;
      outcome: number;
    }) => void;
  }
) {
  const { date, type, typeAlphabet, subType, fixture, value } = req.body;
  const buyDate = new Date(date);
  const result = await prisma.account.create({
    data: {
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
