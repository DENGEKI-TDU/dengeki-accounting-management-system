import { Tr,Td, Select, Button, HStack, Input, Text, useToast, Tooltip } from "@chakra-ui/react";
import { useState,useRef } from "react";
import { EditIcon,CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons"
import { useRouter } from "next/router";

type updateAccount = {
    id: number,
    year: string,
    date: Date,
    type: string,
    typeAlphabet: string,
    subtype: string,
    fixture: string,
    income: number,
    outcome: number,
}

const Update: React.FC<{ update: updateAccount,from:string }> = ({ update,from }) => {
	const [isEditMode,setIsEditMode] = useState(false)
	const [type, setType] = useState(update.type);
	const [subType, setSubType] = useState(update.subtype);
	const [fixture, setFixture] = useState(update.fixture);
	const [tmpType, setTmpType] = useState(update.type);
	const [tmpSubType, setTmpSubType] = useState(update.subtype);
	const [tmpFixture, setTmpFixture] = useState(update.fixture);
	const router = useRouter()
	const toast = useToast()
	const toastIdRef:any = useRef()
	const types: string[] = [
		"大道具",
		"小道具",
		"衣装",
		"照明",
		"音響",
		"庶務",
		"その他",
	];

	async function adopt() {
		toastIdRef.current = toast({
			title:"更新中",
			description:"ID:"+update.id+"のデータを更新中",
			status:"loading",
			duration:5000,
			isClosable:false
		})
		setType(tmpType)
		setSubType(tmpSubType)
		setFixture(tmpFixture)
		const getHost = await fetch("https://ipapi.co/json")
		const res = await getHost.json()
		const hostname = res.ip
		const authBody = {
			hostname
		}
		const token = await fetch("/api/auth/generatePass",{
			method:"POST",
			headers: {"Content-Type":"application/json"},
			body: JSON.stringify(authBody)
		})
		const getToken = await token.json()
		const oneTimeToken = getToken.token
		const inputPass = localStorage.getItem("storage_token")
		const editData = {
			"id":String(update.id),
			"year":String(update.year),
			"date":String(update.date),
			"type":String(tmpType),
			"typeAlphabet":alphabet[types.indexOf(tmpType)],
			"subtype":tmpSubType,
			"fixture":tmpFixture,
			"income":String(update.income),
			"outcome":String(update.outcome),
			"inputPass":inputPass,
			"oneTimeToken":oneTimeToken,
			"hostname":hostname,
			"mode":"update",
			from:from
		}

		await fetch("/api/database/post-earning",{
			method:"POST",
			headers:{"Content-type":"application/json"},
			body:JSON.stringify(editData)
		})
		setIsEditMode(false)
		if(toastIdRef.current){
			toast.close(toastIdRef.current)
		}
		toast({
			title:"編集完了",
			status:"success",
			duration:1500,
			isClosable:true
		})
		router.push("/admin/edit?from="+from)
	}
	async function aid() {
		toastIdRef.current = toast({
			title:"更新中",
			description:"ID:"+update.id+"のデータを共済金からの支払いに変更中",
			status:"loading",
			duration:5000,
			isClosable:false
		})
		const id = update.id
		const getHost = await fetch("https://ipapi.co/json")
		const res = await getHost.json()
		const hostname = res.ip
		const authBody = {
			hostname
		}
		const token = await fetch("/api/auth/generatePass",{
			method:"POST",
			headers: {"Content-Type":"application/json"},
			body: JSON.stringify(authBody)
		})
		const getToken = await token.json()
		const oneTimeToken = getToken.token
		const inputPass = localStorage.getItem("storage_token")
		const body = {
			id,
			inputPass,
			oneTimeToken,
			hostname,
			mode:"aid",
			from:from
		}
		await fetch("/api/database/post-earning",{
			method:"POST",
			headers:{"Content-type":"application/json"},
			body:JSON.stringify(body)
		})
		setIsEditMode(false)
		if(toastIdRef.current){
			toast.close(toastIdRef.current)
		}
		toast({
			title:"変更完了",
			description:"共済金からの支払いへの変更を完了しました。",
			status:"success",
			duration:1500,
			isClosable:true
		})
		router.push("/admin/edit?from="+from)
	}
	function close() {
		setTmpType(update.type)
		setTmpSubType(update.subtype)
		setTmpFixture(update.fixture)
		setIsEditMode(false)
	}

	const alphabet: string[] = ["A", "B", "C", "D", "E", "F", "X"];
	return (
		<>
			{!isEditMode ? 
			<>
			<Td>{update.year}</Td>
			<Td>{Number(new Date(update.date).getMonth())+1+"月"+String(Number(new Date(update.date).getDate()))+"日"}</Td>
			<Td>{type}</Td>
			<Td>{alphabet[types.indexOf(type)]}</Td>
			<Td>{subType}</Td>
			<Td>{fixture}</Td>
			<Td>{update.income}</Td>
			<Td>{update.outcome}</Td>
			<Td><Tooltip label="編集"><EditIcon onClick={()=>setIsEditMode(true)}/></Tooltip></Td>
			</>
			: 
			<>
			<Td>{update.year}</Td>
			<Td>{Number(new Date(update.date).getMonth())+1+"月"+String(Number(new Date(update.date).getDate()))+"日"}</Td>
			<Td>
				<Select
						onChange={(e) => setTmpType(e.target.value)}
						defaultValue={update.type}
						>
						<option value={"大道具"}>大道具</option>
						<option value={"小道具"}>小道具</option>
						<option value={"衣装"}>衣装</option>
						<option value={"照明"}>照明</option>
						<option value={"音響"}>音響</option>
						<option value={"庶務"}>庶務</option>
						<option value={"その他"}>その他</option>
				</Select>
			</Td>
			<Td>{alphabet[types.indexOf(tmpType)]}</Td>
			<Td>
				<HStack>
					<Select
						onChange={(e) => setTmpSubType(e.target.value)}
														defaultValue={tmpSubType}
						>
						{tmpType == "大道具" ? (
								<>
								<option value="1">昨年度大道具代</option>
								<option value="2">大道具部品代</option>
								<option value="3">大道具代</option>
								</>
						) : null}
						{tmpType == "小道具" ? (
								<>
								<option value="1">昨年度小道具代</option>
								<option value="2">小道具部品代</option>
								<option value="3">小道具代</option>
								</>
						) : null}
						{tmpType == "衣装" ? (
								<>
								<option value="1">昨年度衣装代</option>
								<option value="2">衣装部品代</option>
								<option value="3">衣装代</option>
								<option value="4">化粧品代</option>
								<option value="5">クリーニング代</option>
								</>
						) : null}
						{tmpType == "照明" ? (
								<>
								<option value="1">昨年度照明代</option>
								<option value="2">照明代</option>
								</>
						) : null}
						{tmpType == "音響" ? (
								<>
								<option value="1">昨年度音響代</option>
								<option value="2">音響代</option>
								</>
						) : null}
						{tmpType == "庶務" ? (
								<>
								<option value="1">昨年度庶務代</option>
								<option value="2">庶務代</option>
								</>
						) : null}
						<option value="X">その他</option>
						<option value="Z">不明</option>
					</Select>
					<Text>
						{tmpSubType}
					</Text>
				</HStack>
			</Td>
			<Td><Input defaultValue={tmpFixture} onChange={(e)=>setTmpFixture(e.target.value)} /></Td>
			<Td>{update.income}</Td>
			<Td>{update.outcome}</Td>
			<Td><HStack><Tooltip label="編集を保存"><CheckIcon onClick={() => adopt()} marginRight={"5px"} marginLeft={"5px"} /></Tooltip><Tooltip label="共済金からの支払いに変更"><DeleteIcon onClick={() => aid()} marginRight={"5px"} marginLeft={"5px"}/></Tooltip><Tooltip label="変更を破棄"><CloseIcon onClick={() => close()} marginRight={"5px"} marginLeft={"5px"} /></Tooltip></HStack></Td>
			</>
			}
		</>
	)
}

export default Update