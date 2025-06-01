import { DengekiSSO } from "@/hooks/UseLoginState";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
const ExcelJS = require("exceljs");

export default function Home() {
  const { session, login, logout } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [pending, setPending] = useState(true);
  const toast = useToast();
  const router = useRouter();
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const accoutnType = ["", "鳩山祭", "後援会費", "校友会費"];
  const jpAccoutnType = ["本予算", "鳩山祭", "後援会費", "校友会費"];
  const accountIndex = ["main", "hatosai", "clubsupport", "alumni"];
  const toastIdRef: any = useRef();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);
  function generate() {
    toastIdRef.current = toast({
      title: "生成中",
      description:
        year +
        "年度" +
        jpAccoutnType[accountIndex.indexOf(from)] +
        "の決算Excelファイルを生成中",
      status: "loading",
      duration: 4000,
      isClosable: true,
    });
    clickButtonAsync().then((msg) => {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast({
        title: "生成完了",
        description:
          year +
          "年度" +
          jpAccoutnType[accountIndex.indexOf(from)] +
          "の決算Excelファイルを生成しました",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });
  }
  async function clickButtonAsync() {
    // Workbookの作成
    const workbook = new ExcelJS.Workbook();
    // Workbookに新しいWorksheetを追加
    workbook.addWorksheet("金銭出納帳簿");
    // ↑で追加したWorksheetを参照し変数に代入
    const worksheet = workbook.getWorksheet("金銭出納帳簿");
    // 列を定義
    worksheet.columns = [
      { header: "", key: "empty" },
      { header: "月", key: "month" },
      { header: "日", key: "date" },
      { header: "摘要", key: "fixture" },
      { header: "領収書番号", key: "indexNumber" },
      { header: "分類番号大", key: "mainType" },
      { header: "分類項目小", key: "subType" },
      { header: "収入金額", key: "income" },
      { header: "支払金額", key: "outcome" },
      { header: "差引残高", key: "earnings" },
    ];
    // 行を定義
    axios
      .post("/api/database/generate", {
        year,
        from,
      })
      .then(async (response) => {
        const result = response.data;
        var earning: number = 0;
        for (var i = 0; i < result.data.length; i++) {
          earning += result.data[i].income;
          earning -= result.data[i].outcome;
          const earning_string = "\\" + earning.toLocaleString();
          let income: string = "";
          if (result.data[i].income != 0) {
            income = "\\" + result.data[i].income.toLocaleString();
          }
          let outcome: string = "";
          if (result.data[i].outcome != 0) {
            outcome = "\\" + result.data[i].outcome.toLocaleString();
            if (outcome.length > 3) {
            }
          }
          worksheet.addRow({
            month: new Date(result.data[i].date).getMonth() + 1,
            date: new Date(result.data[i].date).getDate(),
            fixture: result.data[i].fixture,
            indexNumber: "",
            mainType: result.data[i].typeAlphabet,
            subType: result.data[i].subtype,
            income: income,
            outcome: outcome,
            earnings: earning_string,
          });
        }
        // UInt8Arrayを生成
        const uint8Array = await workbook.xlsx.writeBuffer();
        // Blob
        const blob = new Blob([uint8Array], {
          type: "application/octet-binary",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `演劇部${
          accoutnType[accountIndex.indexOf(from)]
        }決算_${year}.xlsx`;
        a.click();
        // ダウンロード後は不要なのでaタグを除去
        a.remove();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      {!pending && isLogin ? (
        <>
          {isAdmin ? (
            <VStack>
              <Heading>Excelダウンロードページ</Heading>
              <Text fontSize={"xl"}>生成する年度を入力してください。</Text>
              <FormControl>
                <FormLabel>会計種別を選択</FormLabel>
                <Select
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder={"選択してください"}
                >
                  <option value="main">本予算</option>
                  <option value="hatosai">鳩山祭援助金</option>
                  <option value="clubsupport">後援会費</option>
                  <option value="alumni">校友会費</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>生成する年度</FormLabel>
                <Input
                  onChange={(e) => {
                    setYear(e.target.value);
                  }}
                ></Input>
              </FormControl>
              {from && year ? (
                <Button onClick={(e) => generate()}>ダウンロード</Button>
              ) : null}
            </VStack>
          ) : (
            <Heading>一般ユーザーの権限では使用できません。</Heading>
          )}
        </>
      ) : (
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
      )}
    </>
  );
}
