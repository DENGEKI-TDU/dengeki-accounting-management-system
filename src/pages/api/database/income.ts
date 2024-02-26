import prisma from "@/lib/prisma";

export default async function handle(
  req: {
    body: {
      date: string;
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
  const { date, fixture, value, year } = req.body;
  const buyDate = new Date(date);
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
  res.json(result);
}
