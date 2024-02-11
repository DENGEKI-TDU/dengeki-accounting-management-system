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
  const [images, setImages] = useState<Blob[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const hookurl = process.env.NEXT_PUBLIC_HOOK_URL!;
  const [isLogin, Login, Logout] = UseLoginState(false);
  const path = router.pathname;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "アップロード中",
      status: "loading",
      duration: 9000,
      isClosable: true,
    });

    const fileName = (
      document.getElementById("reciept")! as HTMLInputElement
    ).value
      .split("\\")
      .slice(-1)[0];

    const formData = new FormData();

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

    const valueContent: string =
      "# 支出報告\n購入日時 : " +
      date +
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
      memo;
    for await (const [i, v] of Object.entries(images)) {
      formData.append("files", v);
    }
    await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });
    try {
      const body = {
        date,
        type,
        typeAlphabet,
        subType,
        fixture,
        value,
      };
      await fetch("/api/database/outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const body = {
        valueContent,
        fileName,
      };
      await fetch("api/discord/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
    toast({
      title: "アップロード完了",
      description: "アップロードが完了しました。アップロード日時：" + date,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    router.push("/");
  };

  const handleOnAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...e.target.files]);
  };
  if (isLogin) {
    return (
      <Container pt="10">
        <Heading>支出報告フォーム</Heading>
        <form onSubmit={onSubmit} encType="multipart/form-data">
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
              accept="image/*,.png,.jpg,.jpeg,.gif"
              onChange={handleOnAddImage}
              ref={inputFileRef}
              id="reciept"
            />
          </FormControl>
          <FormControl>
            <FormLabel>購入物品名</FormLabel>
            <Textarea onChange={(e) => setFixture(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>メモ</FormLabel>
            <Textarea onChange={(e) => setMemo(e.target.value)} />
          </FormControl>
          {date != "" &&
          type != "" &&
          subType != "" &&
          value != 0 &&
          name != "" &&
          fixture != "" &&
          images.length != 0 ? (
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
    <>
      <Heading>ログインが必要です。</Heading>
      <Button onClick={() => router.push(`/login?pagelocate=${path}`)}>
        ログインする
      </Button>
    </>;
  }
};

export default Home;
