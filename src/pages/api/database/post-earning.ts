import prisma from "@/lib/prisma";
import { createHash } from "crypto";

const encryptSha256 = (str: string) => {
	const hash = createHash("sha256");
	hash.update(str);
	return hash.digest().toString("base64");
  };


export default async function handle(
  req: {
    body: {
			id: number;
      date: string;
      type: string;
      typeAlphabet: string;
      subType: string;
      fixture: string;
      value: number;
      year: string;
      inputPass: string;
      oneTimeToken: string;
      hostname: string;
      mode: string;
	  income: number;
	  outcome:number;
	  from:string;
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
  const { id, date, type, typeAlphabet, subType, fixture, value, year, inputPass, oneTimeToken, hostname, mode, income, outcome, from } = req.body;
  let isAdmin = false;
  let isUser = false;
	const passResult = await prisma.oneTimeToken.findFirst({
			where: {
					token:encryptSha256(oneTimeToken),
			}
	})
  const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
  const buyDate = new Date(date);
  const sessionToken = inputPass
  if(passResult && hostname.includes(allowHOST)){
    if(new Date() < passResult.limit){
      try {
        const data = await prisma.tokens.findFirst({
          where:{
            tokens:sessionToken
          }
        });
        if(data){
          if(data.limit > new Date()){
            isUser = data.isUser
            isAdmin = data.isAdmin
          }
        }
      } catch(error) {
        console.error(error)
      }
      if((isAdmin || isUser)){
		if(from == "main"){
			if(mode == "income"){
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
			if(mode == "outcome"){
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
			if(mode == "update" && isAdmin){
				const result = await prisma.mainAccount.update({
						where:{
								id: Number(id),
						},
						data: {
								year: year,
								date: new Date(date),
								type: type,
								typeAlphabet: typeAlphabet,
								subtype: subType,
								fixture:fixture,
								income:Number(income),
								outcome:Number(outcome),
						}
				})
				res.json(result);
			}
			if(mode == "aid" && isAdmin){
				const response = await prisma.mainAccount.findFirst({
						where:{
								id: Number(id),
						},
				})
				await prisma.mainAccount.deleteMany({
						where:{
								id: Number(id),
						},
				})
				const result = await prisma.aid.create({
						data:{
								date: response!.date,
								year: response!.year,
								type: response!.type,
								subtype: response!.subtype,
								fixture: response!.fixture,
								income: response!.income,
								outcome: response!.outcome,
								typeAlphabet: response!.typeAlphabet,
						}
				})
				res.json(result);
			}
		}
		if(from == "hatosai"){
			if(mode == "income"){
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
			if(mode == "outcome"){
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
			if(mode == "update" && isAdmin){
				const result = await prisma.hatosaiAccount.update({
						where:{
								id: Number(id),
						},
						data: {
								year: year,
								date: new Date(date),
								type: type,
								typeAlphabet: typeAlphabet,
								subtype: subType,
								fixture:fixture,
								income:Number(income),
								outcome:Number(outcome),
						}
				})
				res.json(result);
			}
			if(mode == "aid" && isAdmin){
				const response = await prisma.hatosaiAccount.findFirst({
						where:{
								id: Number(id),
						},
				})
				await prisma.hatosaiAccount.deleteMany({
						where:{
								id: Number(id),
						},
				})
				const result = await prisma.aid.create({
						data:{
								date: response!.date,
								year: response!.year,
								type: response!.type,
								subtype: response!.subtype,
								fixture: response!.fixture,
								income: response!.income,
								outcome: response!.outcome,
								typeAlphabet: response!.typeAlphabet,
						}
				})
				res.json(result);
			}
		}
		if(from == "clubsupport"){
			if(mode == "income"){
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
			if(mode == "outcome"){
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
			if(mode == "update" && isAdmin){
				const result = await prisma.clubsupportAccount.update({
						where:{
								id: Number(id),
						},
						data: {
								year: year,
								date: new Date(date),
								type: type,
								typeAlphabet: typeAlphabet,
								subtype: subType,
								fixture:fixture,
								income:Number(income),
								outcome:Number(outcome),
						}
				})
				res.json(result);
			}
			if(mode == "aid" && isAdmin){
				const response = await prisma.clubsupportAccount.findFirst({
						where:{
								id: Number(id),
						},
				})
				await prisma.clubsupportAccount.deleteMany({
						where:{
								id: Number(id),
						},
				})
				const result = await prisma.aid.create({
						data:{
								date: response!.date,
								year: response!.year,
								type: response!.type,
								subtype: response!.subtype,
								fixture: response!.fixture,
								income: response!.income,
								outcome: response!.outcome,
								typeAlphabet: response!.typeAlphabet,
						}
				})
				res.json(result);
			}
		}
		if(from == "alumni"){
			if(mode == "income"){
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
			if(mode == "outcome"){
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
			if(mode == "update" && isAdmin){
				const result = await prisma.alumniAccount.update({
						where:{
								id: Number(id),
						},
						data: {
								year: year,
								date: new Date(date),
								type: type,
								typeAlphabet: typeAlphabet,
								subtype: subType,
								fixture:fixture,
								income:Number(income),
								outcome:Number(outcome),
						}
				})
				res.json(result);
			}
			if(mode == "aid" && isAdmin){
				const response = await prisma.alumniAccount.findFirst({
						where:{
								id: Number(id),
						},
				})
				await prisma.alumniAccount.deleteMany({
						where:{
								id: Number(id),
						},
				})
				const result = await prisma.aid.create({
						data:{
								date: response!.date,
								year: response!.year,
								type: response!.type,
								subtype: response!.subtype,
								fixture: response!.fixture,
								income: response!.income,
								outcome: response!.outcome,
								typeAlphabet: response!.typeAlphabet,
						}
				})
				res.json(result);
			}
		}
      } else {
        res.status(403).json({"msg":"permission denied."})
      }
    } else {
      res.status(403).json("Authentication information expired")
    }
  } else {
    res.status(403).json({"msg":"permission denied."})
  }
}
