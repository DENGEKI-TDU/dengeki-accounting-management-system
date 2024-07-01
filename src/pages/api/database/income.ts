import prisma from "@/lib/prisma";

export default async function handle(
  req: {
    body: {
      date: string;
      fixture: string;
      value: number;
      year: string;
      inputPass: string;
    };
  },
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
  const { date, fixture, value, year,inputPass } = req.body;
  const buyDate = new Date(date);
  if(inputPass == process.env.NEXT_PUBLIC_USER_TOKEN){
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
  } else {
    res.status(403).json("permission denied.")
  }
}
