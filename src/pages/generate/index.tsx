import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
const ExcelJS = require("exceljs");
import prisma from "@/lib/prisma";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import Link from "next/link";

interface IProps {
  history: string[];
}

export default class Test extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.state = { data: "" };
  }
  componentDidMount() {}
  async clickButtonAsync(e: any, year: string) {
    e.preventDefault();
    // Workbookの作成
    const workbook = new ExcelJS.Workbook();
    // Workbookに新しいWorksheetを追加
    workbook.addWorksheet("My Sheet");
    // ↑で追加したWorksheetを参照し変数に代入
    const worksheet = workbook.getWorksheet("My Sheet");
    // 列を定義
    worksheet.columns = [
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
      year,
      inputPass,
      oneTimeToken,
      hostname,
    }
    const response = await fetch("/api/database/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    })
    console.log(response)
    const result = await response.json()
    console.log(result)
    console.log(result.data.length)
    var earning:number = 0
    for(var i=0;i<result.data.length;i++){
      earning += result.data[i].income
      earning -= result.data[i].outcome
      const earning_string = "\\"+earning.toLocaleString()
      let income:string = ""
      if(result.data[i].income != 0){
        income = "\\"+result.data[i].income.toLocaleString()
      }
      let outcome:string = ""
      if(result.data[i].outcome != 0){
        outcome = "\\"+result.data[i].outcome.toLocaleString()
        if(outcome.length>3){}
      }
      worksheet.addRow({month:new Date(result.data[i].date).getMonth()+1,date:new Date(result.data[i].date).getDate(),fixture:result.data[i].fixture,indexNumber:"",mainType:result.data[i].typeAlphabet,subType:result.data[i].subtype,income:income,outcome:outcome,earnings:earning_string})
    }
    // UInt8Arrayを生成
    const uint8Array = await workbook.xlsx.writeBuffer();
    // Blob
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `演劇部決算_${year}.xlsx`;
    a.click();
    // ダウンロード後は不要なのでaタグを除去
    a.remove();
  } 
  isCompleated = process.env.NEXT_PUBLIC_EXCEL_COMPLEATED == "true";
  render() {
    let inputPass = "";
    return (
      <>
        <VStack>
          <Heading>Excelダウンロードページ</Heading>
          <Text fontSize={"xl"}>
            生成する年度を入力してください。
          </Text>
          <FormControl>
            <FormLabel>生成する年度</FormLabel>
            <Input
              onChange={(e) => {
                inputPass = e.target.value;
              }}
            ></Input>
          </FormControl>
          <p>{inputPass}</p>
          <Button onClick={(e) => this.clickButtonAsync(e, inputPass)}>
            ダウンロード
          </Button>
        </VStack>
      </>
    );
  }
}
