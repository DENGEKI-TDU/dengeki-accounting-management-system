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
import { UseLoginState } from "@/hooks/UseLoginState";
import Router, { useRouter } from "next/router";
import { supabase } from "../../../utils/supabase/supabase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

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
  const [isAdmin,isUser, status, Login, Logout] = UseLoginState(false);
  const [inputPass,setInputPass] = useState("")
  const path = router.pathname;
  const public_url = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
  const toastIdRef:any = useRef()
  useEffect(() => {
    setInputPass(localStorage.getItem("storage_token")!)
  },[])
  const listAllImage = async () => {
    const tempUrlList: string[] = [];
    const { data, error } = await supabase.storage
      .from("dengeki-receipt")
      .list("img", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (error) {
      
      return;
    }

    for (let index = 0; index < data.length; index++) {
      if (data[index].name != ".emptyFolderPlaceholder") {
        tempUrlList.push(data[index].name);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await listAllImage();
    })();
  }, []);

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
    axios.get("https://ipapi.co/json").then((getHost) => {
      const hostname = getHost.data.ip
      axios.post("/api/auth/generatePass",{
        hostname
      }).then((oneTimePass) => {
        const oneTimeToken = oneTimePass.data.token
        
        axios.post("/api/database/post-earning",{
          date,
          type,
          typeAlphabet,
          subType,
          fixture,
          value,
          year,
          inputPass,
          oneTimeToken,
          hostname,
          mode:"outcome",
          from:"alumni"
        }).then(async () => {
          if (file!!.type.match("image.*")) {
            const fileExtension = file!!.name.split(".").pop();
            const uuid = uuidv4();
            const inputFileName = `image/${year}/alumni/${uuid}.${fileExtension}`;
            const ImageURL = public_url + inputFileName;
            const { error } = await supabase.storage
              .from("dengeki-receipt")
              .upload(inputFileName, file!!);
            if (error) {
              alert("エラーが発生しました：" + error.message);
              return;
            }
            setFile(undefined);
            await listAllImage();
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
              const username = "支出報告くん"
              axios.post("/api/discord/send",{
                username,
                valueContent,
                mode:"alumni"
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
              }).catch(() => {
                if(toastIdRef.current){
                  toast.close(toastIdRef.current)
                }
                toast({
                  title: "discord error",
                  status: "error",
                  duration: 2500,
                  isClosable: true,
                });
              })
          } else {
            if(toastIdRef.current){
              toast.close(toastIdRef.current)
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
        }).catch(() => {
          if(toastIdRef.current){
            toast.close(toastIdRef.current)
          }
          toast({
            title: "db post error",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
        }).catch(() => {
          if(toastIdRef.current){
            toast.close(toastIdRef.current)
          }
          toast({
            title: "token generate error",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
        })
      })
    }).catch(() => {
      if(toastIdRef.current){
        toast.close(toastIdRef.current)
      }
      toast({
        title: "IPアドレス取得エラー",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    })
  };
  if(status && (isAdmin || isUser)){
      return (
        <Container pt="10">
          <Heading>後援会費支出報告フォーム</Heading>
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
                placeholder="選択してください。"
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
                placeholder="選択してください。"
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
            <FormControl>
              <FormLabel>購入者</FormLabel>
              <Input onChange={(e) => setName(e.target.value)} />
            </FormControl>
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
        {status ?
          <>
            <VStack>
              <Heading>ログインしてください。</Heading>
              <Button
              onClick={() => {
                router.push({
                  pathname:"https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/login",
                  query: {locate:"accounting",}
                },"http:/localhost:3000/login")
              }}>
                ログイン
              </Button>
            </VStack>
          </>
          :
            <Heading>ログイン状態確認中</Heading>
          }
        </>
      )
    }
  }
export default Home;
