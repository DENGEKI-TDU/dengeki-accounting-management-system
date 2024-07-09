import { UseLoginState } from "@/hooks/UseLoginState";
import {
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  useToast,
  Button,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin,isUser,status, Login, Logout] = UseLoginState(false);
  const [date, setDate] = useState("");
  const [value, setValue] = useState(0);
  const [fixture, setFixture] = useState("");
  const [memo, setMemo] = useState("");
  const [year, setYear] = useState("");
  const [inputPass,setInputPass] = useState("")
  const toast = useToast();
  const router = useRouter();
  const toastIdRef:any = useRef()
  const path = router.pathname;
  useEffect(() => {
    setInputPass(localStorage.getItem("storage_token")!)
  },[])

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastIdRef.current = toast({
      title: "アップロード中",
      status: "loading",
      duration: 15000,
      isClosable: true,
    });

    const valueContent: string =
      "# 収入報告\n取得日 : " +
      date +
      "\n会計年度 : " +
      year +
      "\n金額 : ¥" +
      value +
      "\n収入事由 : " +
      fixture +
      "\nメモ : " +
      memo;
    const username = "後援会費収入報告くん"
    const discordData = {
      username,
      valueContent,
      mode:"clubsupport"
    };
    const getHost = await fetch("https://ipapi.co/json")
    const res = await getHost.json()
    const hostname = res.ip
    const authBody = {
      hostname
    }
    const oneTimePass = await fetch("/api/auth/generatePass",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(authBody)
    })
    const passResult = await oneTimePass.json()
    const oneTimeToken = passResult.token
    try {
      const body = {
        date,
        fixture,
        value,
        year,
        inputPass,
        oneTimeToken,
        hostname,
        mode:"income",
        from:"clubsupport"
      };
      await fetch("/api/database/post-earning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
    await fetch("/api/discord/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordData),
    }).then(() => {
      if(toastIdRef.current){
        toast.close(toastIdRef.current)
      }
      toast({
        title: "アップロード完了",
        description: "アップロードが完了しました。アップロード日時：" + date,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      router.push("/");
    });
  };
  if(status && (isAdmin || isUser)){
    return (
      <>
        <Container>
          <Heading>後援会費収入報告フォーム</Heading>
          <form onSubmit={onsubmit} encType="multipart/form-data">
            <FormControl>
              <FormLabel>会計年度</FormLabel>
              <NumberInput
                min={new Date().getFullYear() - 2}
                onChange={(e) => setYear(String(Number(e)))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>取得日</FormLabel>
              <Input type="date" onChange={(e) => setDate(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>金額</FormLabel>
              <NumberInput min={1} onChange={(e) => setValue(Number(e))}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>収入事由</FormLabel>
              <Input onChange={(e) => setFixture(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>メモ</FormLabel>
              <Textarea onChange={(e) => setMemo(e.target.value)} />
            </FormControl>
            {date != "" && value != 0 && fixture != "" ? (
              <Input
                type="submit"
                value="提出"
                margin="10px auto"
                variant="filled"
              />
            ) : null}
          </form>
        </Container>
      </>
    );
  } else {
    return (
      <>
      {status ?
        <>
          <VStack>
            <Heading>ログインしてください。</Heading>
            <Button onClick={() => router.push("/login")}>ログイン</Button>
          </VStack>
        </>
        :
          <Heading>ログイン状態確認中</Heading>
        }
      </>
    )
  }
}
