import prisma from "@/lib/prisma";

export default async function handle(
  req: {
    body: {
      date: string;
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
  const { date, fixture, value } = req.body;
  const buyDate = new Date(date);
  const result = await prisma.account.create({
    data: {
      date: buyDate,
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
