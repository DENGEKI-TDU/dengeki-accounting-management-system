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
import axios from "axios";

export default function Home() {
  const [isAdmin, isUser, status, Login, Logout] = UseLoginState(false);
  const [date, setDate] = useState("");
  const [value, setValue] = useState(0);
  const [fixture, setFixture] = useState("");
  const [memo, setMemo] = useState("");
  const [year, setYear] = useState("");
  const [inputPass, setInputPass] = useState("");
  const toast = useToast();
  const router = useRouter();
  const toastIdRef: any = useRef();
  const path = router.pathname;
  let http = "http";
  if (process.env.NODE_ENV == "production") {
    http = "https";
  }
  useEffect(() => {
    setInputPass(localStorage.getItem("storage_token")!);
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
      "\n収入事由 : " +
      fixture +
      "\nメモ : " +
      memo;
    const username = "収入報告くん";
    const discordData = {
      username,
      valueContent,
      mode: "main",
    };
    axios
      .get("https://ipapi.co/json")
      .then((getHost) => {
        const hostname = getHost.data.ip;
        axios
          .post("/api/auth/generatePass", {
            hostname,
          })
          .then((oneTimePass) => {
            const oneTimeToken = oneTimePass.data.token;

            axios
              .post("/api/database/post-earning", {
                date,
                fixture,
                value,
                year,
                inputPass,
                oneTimeToken,
                hostname,
                mode: "income",
                from: "alumni",
              })
              .then(async () => {
                const username = "収入報告くん";
                axios
                  .post("/api/discord/send", {
                    username,
                    valueContent,
                    mode: "alumni",
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
              })
              .catch(() => {
                if (toastIdRef.current) {
                  toast.close(toastIdRef.current);
                }
                toast({
                  title: "token generate error",
                  status: "error",
                  duration: 2500,
                  isClosable: true,
                });
              });
          });
      })
      .catch(() => {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
        toast({
          title: "IPアドレス取得エラー",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      });
  };
  if (status && (isAdmin || isUser)) {
    return (
      <>
        <Container>
          <Heading>鳩山祭援助金収入報告フォーム</Heading>
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
        {status ? (
          <>
            <VStack>
              <Heading>ログインしてください。</Heading>
              <Button
                onClick={() => {
                  router.push(
                    {
                      pathname:
                        http +
                        "://" +
                        process.env.NEXT_PUBLIC_SSO_DOMAIN +
                        "/login",
                      query: { locate: "accounting", path: path },
                    },
                    "http:/localhost:3000/login"
                  );
                }}
              >
                ログイン
              </Button>
            </VStack>
          </>
        ) : (
          <Heading>ログイン状態確認中</Heading>
        )}
      </>
    );
  }
}
