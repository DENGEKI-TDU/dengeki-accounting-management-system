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
      year: string;
    };
  },
  res: {
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
  const { date, type, typeAlphabet, subType, fixture, value, year } = req.body;
  const buyDate = new Date(date);
  const result = await prisma.account.create({
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
