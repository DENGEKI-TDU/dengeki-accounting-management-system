import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function IncomeForm({
  from,
  userName,
}: {
  from: string;
  userName: string;
}) {
  const [date, setDate] = useState("");
  const [getName, setGetName] = useState("");
  const [value, setValue] = useState(0);
  const [fixture, setFixture] = useState("");
  const [memo, setMemo] = useState("");
  const [year, setYear] = useState("");
  const [memberList, setMemberList] = useState<string[]>([]);
  const toast = useToast();
  const router = useRouter();
  const toastIdRef: any = useRef();

  const getMemberList = async () => {
    try {
      const res = await axios.get("/api/session/withPast");
      setMemberList(res.data.data);
      if (res.status != 403) {
        setMemberList([...res.data.data, "シス管試験用アカウント"]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMemberList();
  }, []);

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
      "\n受領者 : " +
      getName +
      "\n収入事由 : " +
      fixture +
      "\nメモ : " +
      memo;
    axios
      .post(`/api/database/post-earnings/${from}/income`, {
        date,
        fixture,
        value,
        year,
        mode: "income",
        from: from,
      })
      .then(async (result) => {
        console.log(result.data.accountID);
        const username = "収入報告くん";
        axios
          .post("/api/discord/send", {
            username,
            valueContent,
            mode: from,
            accountID: result.data.id,
          })
          .then(() => {
            if (toastIdRef.current) {
              toast.close(toastIdRef.current);
            }
            toast({
              title: "アップロード完了",
              description:
                "アップロードが完了しました。アップロード日時：" + date,
              status: "success",
              duration: 2500,
              isClosable: true,
            });
            router.push("/");
          })
          .catch(() => {
            if (toastIdRef.current) {
              toast.close(toastIdRef.current);
            }
            toast({
              title: "discord error",
              status: "error",
              duration: 2500,
              isClosable: true,
            });
          });
      })
      .catch(() => {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
        toast({
          title: "db post error",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      });
  };

  return (
    <Container>
      <Heading>
        {
          ["本予算", "鳩山祭援助金", "校友会費", "後援会費"][
            ["main", "hatosai", "alumni", "clubsupport"].indexOf(from)
          ]
        }
        収入報告フォーム
      </Heading>
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
          <FormLabel>受領者</FormLabel>
          {getName != "" && memberList.includes(userName) ? (
            <Input value={getName} disabled />
          ) : (
            <>
              <Select onChange={(e) => setGetName(e.target.value)}>
                <option defaultChecked>選択してください</option>
                {memberList.map((memberListComponent) => {
                  return (
                    <option
                      value={memberListComponent}
                      defaultValue={"購入者を選択してください"}
                    >
                      {memberListComponent}
                    </option>
                  );
                })}
              </Select>
            </>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>収入事由</FormLabel>
          <Input onChange={(e) => setFixture(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>メモ</FormLabel>
          <Textarea onChange={(e) => setMemo(e.target.value)} />
        </FormControl>
        <Box marginTop={5}>
          <Text textAlign={"center"}>
            会計年度 : {year} <br />
            取得日 : {date} <br />
            金額 : {value} <br />
            収入事由 : {fixture} <br />
            メモ : {memo}
          </Text>
        </Box>
        {date != "" && value != 0 && fixture != "" && getName != "" ? (
          <Input
            type="submit"
            value="提出"
            margin="10px auto"
            variant="filled"
          />
        ) : null}
      </form>
    </Container>
  );
}
