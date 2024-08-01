import prisma from "@/lib/prisma";
import axios from "axios";

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
  console.log(id, date, type, typeAlphabet, subType, fixture, value, year, inputPass, oneTimeToken, hostname, mode, income, outcome, from)
  let isAdmin = false;
  let isUser = false;
  let http = "http"
  if(process.env.NODE_ENV == "production"){
	http = "https"
  }
  axios.post(http+"://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth/authToken",{
	oneTimeToken
  }).then( async(getPass) => {
	const passResult = getPass.data
	const allowHOST = process.env.NEXT_PUBLIC_ALLOW_HOSTNAME!
	const buyDate = new Date(date);
	if(passResult && hostname.includes(allowHOST)){
		if(new Date() < new Date(passResult.limit)){
			const token = inputPass
			if(token){
			const body = {
				token,
				mode:"get"
			}
			const response = await fetch(http+"://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth",{
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body)
			});
			await response.json().then((data) => {
				console.log(data)
				if(data){
				if(data.limit >= new Date()){
					localStorage.clear;
					isUser = false
					isAdmin = false
				} else {
					isUser = data.isUser
					isAdmin = data.isAdmin
				}
				}
			});
			} else {
			isUser = false
			isAdmin = false
			}
			console.log((isAdmin || isUser))
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
					console.log(result)
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
			res.status(403).end()
		}
		} else {
		res.status(403).json("Authentication information expired")
		}
	} else {
		res.status(403).end()
	}
  }).catch((error) => {
	console.log(new Date(),"token認証エラー")
	res.status(403).json(error)
  })
}
