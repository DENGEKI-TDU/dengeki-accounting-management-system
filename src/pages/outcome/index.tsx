"use client";
import {
  Container,
  FormLabel,
  FormControl,
  Heading,
  Image,
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
import type { NextPage } from "next";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; //カルーセル用のタグをインポート
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"; // スタイルをインポート
import "swiper/css/pagination"; // スタイルをインポート
import { DengekiSSO } from "@/hooks/UseLoginState";
import Router, { useRouter } from "next/router";
import { supabase } from "../../../utils/supabase/supabase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";

const Home: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [subType, setSubType] = useState("");
  const [value, setValue] = useState(0);
  const [name, setName] = useState("");
  const [fixture, setFixture] = useState("");
  const [memo, setMemo] = useState("");
  const [year, setYear] = useState("");
  const [images, setImages] = useState<Blob[]>([]);
  // const [isAdmin, isUser, status, Login, Logout] = UseLoginState(false);
  const { session, login, logout } = DengekiSSO();
  const [pending, setPending] = useState(false);
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [memberList, setMemberList] = useState<string[]>([]);
  const path = router.pathname;
  const public_url = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
  const toastIdRef: any = useRef();
  let http = "http";
  if (process.env.NODE_ENV == "production") {
    http = "https";
  }
  useEffect(() => {
    session().then(() => {
      axios.get("/api/session/withPast").then((res) => {
        setMemberList(res.data.data);
        setPending(false);
      });
    });
  }, []);
  useEffect(() => {
    setName(userName);
  }, [userName]);

  const [file, setFile] = useState<File>();
  const handleChangeFile = (e: any) => {
    if (e.target.files.length !== 0) {
      setFile(e.target.files[0]);
    }
    if (!e.target.files) return;
    setImages([...e.target.files]);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastIdRef.current = toast({
      title: "アップロード中",
      status: "loading",
      duration: 15000,
      isClosable: true,
    });

    const types: string[] = [
      "大道具",
      "小道具",
      "衣装",
      "照明",
      "音響",
      "庶務",
      "その他",
    ];

    const alphabet: string[] = ["A", "B", "C", "D", "E", "F", "X"];

    const typeAlphabet = alphabet[types.indexOf(type)];
    axios
      .post("/api/database/post-earning", {
        date,
        type,
        typeAlphabet,
        subType,
        fixture,
        value,
        year,
        mode: "outcome",
        from: "main",
      })
      .then(async () => {
        if (file!!.type.match("image.*")) {
          const fileExtension = file!!.name.split(".").pop();
          const uuid = uuidv4();
          const inputFileName = `image/${year}/${uuid}.${fileExtension}`;
          const ImageURL = public_url + inputFileName;
          const { error } = await supabase.storage
            .from("dengeki-receipt")
            .upload(inputFileName, file!!);
          if (error) {
            alert("エラーが発生しました：" + error.message);
            return;
          }
          setFile(undefined);
          const valueContent: string =
            "# 支出報告\n購入日時 : " +
            date +
            "\n会計年度 : " +
            year +
            "\n分類 : " +
            type +
            "\n分類番号 : " +
            typeAlphabet +
            subType +
            "\n金額 : ¥" +
            value +
            "\n購入者 : " +
            name +
            "\n備品名 : " +
            fixture +
            "\nメモ : " +
            memo +
            "\n[レシート画像URL](" +
            ImageURL +
            ")";
          const username = "支出報告くん";
          axios
            .post("/api/discord/send", {
              username,
              valueContent,
              mode: "main",
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
        } else {
          if (toastIdRef.current) {
            toast.close(toastIdRef.current);
          }
          toast({
            title: "画像形式エラー",
            description: "画像ファイル以外はアップロードできません。",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
          router.reload();
        }
      })
      .catch((error) => {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
        toast({
          title: "db post error",
          description: error,
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      });
  };
  if (!pending && isLogin) {
    return (
      <Container pt="10">
        <Heading>支出報告フォーム</Heading>
        <form onSubmit={onSubmit} encType="multipart/form-data">
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
            <FormLabel>購入日時</FormLabel>
            <Input type="date" onChange={(e) => setDate(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>分類</FormLabel>
            <Select
              onChange={(e) => setType(e.target.value)}
              placeholder="選択してください"
            >
              <option value={"大道具"}>大道具</option>
              <option value={"小道具"}>小道具</option>
              <option value={"衣装"}>衣装</option>
              <option value={"照明"}>照明</option>
              <option value={"音響"}>音響</option>
              <option value={"庶務"}>庶務</option>
              <option value={"その他"}>その他</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>分類詳細</FormLabel>
            <Select
              onChange={(e) => setSubType(e.target.value)}
              placeholder="選択してください"
            >
              {type == "大道具" ? (
                <>
                  <option value="1">昨年度大道具代</option>
                  <option value="2">大道具部品代</option>
                  <option value="3">大道具代</option>
                </>
              ) : null}
              {type == "小道具" ? (
                <>
                  <option value="1">昨年度小道具代</option>
                  <option value="2">小道具部品代</option>
                  <option value="3">小道具代</option>
                </>
              ) : null}
              {type == "衣装" ? (
                <>
                  <option value="1">昨年度衣装代</option>
                  <option value="2">衣装部品代</option>
                  <option value="3">衣装代</option>
                  <option value="4">化粧品代</option>
                  <option value="5">クリーニング代</option>
                </>
              ) : null}
              {type == "照明" ? (
                <>
                  <option value="1">昨年度照明代</option>
                  <option value="2">照明代</option>
                </>
              ) : null}
              {type == "音響" ? (
                <>
                  <option value="1">昨年度音響代</option>
                  <option value="2">音響代</option>
                </>
              ) : null}
              {type == "庶務" ? (
                <>
                  <option value="1">昨年度庶務代</option>
                  <option value="2">庶務代</option>
                </>
              ) : null}
              <option value="X">その他</option>
              <option value="Z">不明</option>
            </Select>
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
          {name != "" && !memberList!.includes(userName) ? (
            <FormControl>
              <FormLabel>購入者</FormLabel>
              {memberList ? (
                <Select
                  onChange={(e) => setName(e.target.value)}
                  placeholder="選択してください"
                >
                  {memberList.map((memberListContent) => {
                    return (
                      <option value={memberListContent}>
                        {memberListContent}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                <Input onChange={(e) => setName(e.target.value)} value={name} />
              )}
            </FormControl>
          ) : (
            <FormControl>
              <FormLabel>購入者</FormLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={true}
              />
            </FormControl>
          )}
          <FormControl>
            <FormLabel htmlFor="postImages">レシート画像</FormLabel>
            <Input
              type="file"
              id="formFile"
              accept="image/*"
              onChange={(e) => {
                handleChangeFile(e);
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>購入物品名</FormLabel>
            <Input onChange={(e) => setFixture(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>メモ</FormLabel>
            <Textarea onChange={(e) => setMemo(e.target.value)} />
          </FormControl>
          {date != "" &&
          year != "" &&
          type != "" &&
          subType != "" &&
          value != 0 &&
          name != "" &&
          fixture != "" &&
          file != undefined ? (
            <Input
              type="submit"
              value="提出"
              margin="10px auto"
              variant="filled"
            />
          ) : null}
        </form>
        <Container>
          <p>購入日時 : {date}</p>
          <p>分類 : {type}</p>
          <p>金額 : ¥{value}</p>
          <p>購入者 : {name}</p>
          <p>備品名 : {fixture}</p>
          <p>{memo}</p>
          <Swiper
            slidesPerView={1} //一度に表示するスライドの数
            modules={[Navigation, Pagination]}
            pagination={{
              clickable: true,
            }}
            navigation
            loop={true}
          >
            {images.map((image, i) => (
              <SwiperSlide key={i}>
                <Image src={URL.createObjectURL(image)} w={"80%"} h={"auto"} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Container>
    );
  } else {
    return (
      <>
        {!pending ? (
          <>
            <VStack>
              <Heading>ログインしてください。</Heading>
              <Button
                onClick={() => {
                  router.push("/login");
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
};
export default Home;

