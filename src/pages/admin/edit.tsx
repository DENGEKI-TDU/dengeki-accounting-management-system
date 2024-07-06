import { Table,Thead,Tbody,Tr,Th,Td, Select, Button, Center, Heading, VStack, Box } from "@chakra-ui/react";
import { GetServerSideProps, GetStaticProps } from "next";
import prisma from "@/lib/prisma";
import { useState } from "react";
import Update from "../../components/update"

export const getServerSideProps: GetServerSideProps = async () => {
	let nowYear = new Date().getFullYear()
	if(nowYear < 4){
		nowYear -1
	}
	const result = await prisma.mainAccount.findMany({
		where: {
			year: String(nowYear)
		},
		orderBy:[{income:"desc"},{date:"asc"}]
	})
	let response = []
	for(let i=0;i<result.length;i++){
		response.push({"id":result[i].id,"date":String(result[i].date),"year":result[i].year,"type":result[i].type,"typeAlphabet":result[i].typeAlphabet,"subtype":result[i].subtype,"fixture":result[i].fixture,"income":result[i].income,"outcome":result[i].outcome})
	}
	return {
		props: {response},
	}
}

type updateAccount = {
	response: any;
    id: number,
    year: String,
    date: Date,
    type: String,
    typeAlphabet: String,
    subtype: String,
    fixture: String,
    income: number,
    outcome: number,
}

const Home: React.FC<updateAccount> = (props) => {
	return (
		<>
		<Center width="100%">
		  <VStack width="100%">
			<Heading>収支報告編集ページ</Heading>
			<Table width="100%">
				<Thead>
				<Tr>
					<Th>年度</Th>
					<Th>購入日時</Th>
					<Th>分類</Th>
					<Th>分類番号大</Th>
					<Th>分類項目小</Th>
					<Th>名称</Th>
					<Th>収入</Th>
					<Th>支出</Th>
					<Th></Th>
				</Tr>
				</Thead>
				<Tbody>
			{
				props.response.map((account: { id: number; year: string; date: Date; type: string; typeAlphabet: string; subtype: string; fixture: string; income: number; outcome: number; }) => (
					<Tr key={account.id}>
						<Update update={account} key={account.id}/>
					</Tr>
				))
			}
				</Tbody>
			</Table>
			</VStack>
		</Center>
		</>
	)
}

export default Home