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
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin,isUser, Login, Logout] = UseLoginState(false);
  const [date, setDate] = useState("");
  const [value, setValue] = useState(0);
  const [fixture, setFixture] = useState("");
  const [memo, setMemo] = useState("");
  const [year, setYear] = useState("");
  const [inputPass,setInputPass] = useState("")
  const toast = useToast();
  const hookurl = process.env.NEXT_PUBLIC_HOOK_URL!;
  const router = useRouter();
  const path = router.pathname;
  useEffect(() => {
    setInputPass(localStorage.getItem("storage_token")!)
  },[])

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "アップロード中",
      status: "loading",
      duration: 9000,
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
    const sendData = {
      username: "収入報告くん",
      content: valueContent,
    };
    const hostname = await fetch("https://ipinfo.io/hostname")
    const authBody = {
      hostname
    }
    const oneTimePass = await fetch("api/auth/generatePass",{
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
      };
      await fetch("/api/database/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
    await fetch(hookurl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    });
    toast({
      title: "アップロード完了",
      description: "アップロードが完了しました。アップロード日時：" + date,
      status: "success",
      duration: 2500,
      isClosable: true,
    });
    router.push("/");
  };

  if (isAdmin || isUser) {
    return (
      <>
        <Container>
          <Heading>収入報告フォーム</Heading>
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
              <Textarea onChange={(e) => setFixture(e.target.value)} />
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
        <Heading>ログインが必要です。</Heading>
        <Button onClick={() => router.push(`/login?pagelocate=${path}`)}>
          ログインする
        </Button>
      </>
    );
  }
}
