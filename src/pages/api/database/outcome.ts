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
  const { date, type, typeAlphabet, subType, fixture, value, year, inputPass } = req.body;
  let isAdmin = false;
  let isUser = false;
  const buyDate = new Date(date);
  const sessionToken = inputPass
  try {
    const data = await prisma.tokens.findFirst({
			where:{
				tokens:sessionToken
			}
		});
    console.log(data)
    if(data){
      if(data.limit > new Date()){
        isUser = data.isUser
        isAdmin = data.isAdmin
      }
    }
  } catch(error) {
    console.error(error)
  }
  if(isAdmin || isUser){
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
  } else {
    res.status(403).json("permission denied.")
  }
}
