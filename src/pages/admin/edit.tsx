import { Table,Thead,Tbody,Tr,Th,Td, Select, Box, Button, Center, Heading, VStack, Text, Link } from "@chakra-ui/react";
import { GetServerSideProps, GetStaticProps } from "next";
import prisma from "@/lib/prisma";
import Update from "../../components/update"
import { UseLoginState } from "@/hooks/UseLoginState";
import {useRouter} from "next/router";
import { useSearchParams } from "next/navigation";


export async function getServerSideProps(context:any) {
	const from = context.query.from
	let nowYear = new Date().getFullYear()
	if(nowYear < 4){
		nowYear -1
	}
	let response = []
	if(from == "main"){
		const result = await prisma.mainAccount.findMany({
			where: {
				year: String(nowYear)
			},
			orderBy:[{income:"desc"},{date:"asc"}]
		})
		for(let i=0;i<result.length;i++){
			response.push({"id":result[i].id,"date":String(result[i].date),"year":result[i].year,"type":result[i].type,"typeAlphabet":result[i].typeAlphabet,"subtype":result[i].subtype,"fixture":result[i].fixture,"income":result[i].income,"outcome":result[i].outcome})
		}
	}
	if(from == "hatosai"){
		const result = await prisma.hatosaiAccount.findMany({
			where: {
				year: String(nowYear)
			},
			orderBy:[{income:"desc"},{date:"asc"}]
		})
		for(let i=0;i<result.length;i++){
			response.push({"id":result[i].id,"date":String(result[i].date),"year":result[i].year,"type":result[i].type,"typeAlphabet":result[i].typeAlphabet,"subtype":result[i].subtype,"fixture":result[i].fixture,"income":result[i].income,"outcome":result[i].outcome})
		}
	}
	if(from == "clubsupport"){
		const result = await prisma.clubsupportAccount.findMany({
			where: {
				year: String(nowYear)
			},
			orderBy:[{income:"desc"},{date:"asc"}]
		})
		for(let i=0;i<result.length;i++){
			response.push({"id":result[i].id,"date":String(result[i].date),"year":result[i].year,"type":result[i].type,"typeAlphabet":result[i].typeAlphabet,"subtype":result[i].subtype,"fixture":result[i].fixture,"income":result[i].income,"outcome":result[i].outcome})
		}
	}
	if(from == "alumni"){
		const result = await prisma.alumniAccount.findMany({
			where: {
				year: String(nowYear)
			},
			orderBy:[{income:"desc"},{date:"asc"}]
		})
		for(let i=0;i<result.length;i++){
			response.push({"id":result[i].id,"date":String(result[i].date),"year":result[i].year,"type":result[i].type,"typeAlphabet":result[i].typeAlphabet,"subtype":result[i].subtype,"fixture":result[i].fixture,"income":result[i].income,"outcome":result[i].outcome})
		}
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
	const serachParams = useSearchParams()
	const from = serachParams.get("from")
	const [isAdmin,isUser, Login, Logout] = UseLoginState(false);
	const router = useRouter()
	return (
		<>
		{isAdmin || isUser ? 
		<>
		{isAdmin ? 
		<Center width="100%">
		{from ? 
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
						<Update update={account} />
					</Tr>
				))
			}
				</Tbody>
			</Table>
			</VStack>
		: 
			<VStack>
				<Heading>クエリが不正です。</Heading>
				<Text>次のリンクから再アクセスしてください。</Text>
				<Link href={"/admin/edit?from=main"}>
				<Box borderBottom="1px solid #fc8819">本予算</Box>
				</Link>
				<Link href={"/admin/edit?from=hatosai"}>
				<Box borderBottom="1px solid #fc8819">鳩祭援助金</Box>
				</Link>
				<Link href={"/admin/edit?from=clubsupport"}>
				<Box borderBottom="1px solid #fc8819">後援会費関連</Box>
				</Link>
				<Link href={"/admin/edit?from=alumni"}>
				<Box borderBottom="1px solid #fc8819">校友会費関連</Box>
				</Link>
			</VStack>
		}
		</Center>
		: <Text>一般ユーザーの権限では使用できません。</Text>}
		</>
		: 
		<>
		  <VStack>
			<Heading>ログインしてください。</Heading>
			<Button onClick={() => router.push("/login")}>ログイン</Button>
		  </VStack>
		</>
		} 
		</>
	)
}

export default Home