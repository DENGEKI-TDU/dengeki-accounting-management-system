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
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import Link from "next/link";
import { createHash } from "crypto";

const STORAGE_TOKEN = "storage_token";
const USER_TOKEN = process.env.NEXT_PUBLIC_USER_TOKEN;
const SECOND_PASS = process.env.NEXT_PUBLIC_SECOND_PASS;

const encryptSha256 = (str: string) => {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest().toString("base64");
};

interface IProps {
  history: string[];
}

export default class Test extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.state = { data: "" };
  }
  componentDidMount() {}
  async clickButtonAsync(e: any, str: string) {
    if (encryptSha256(str) == SECOND_PASS) {
      e.preventDefault();
      // Workbookの作成
      const workbook = new ExcelJS.Workbook();
      // Workbookに新しいWorksheetを追加
      workbook.addWorksheet("My Sheet");
      // ↑で追加したWorksheetを参照し変数に代入
      const worksheet = workbook.getWorksheet("My Sheet");
      // 列を定義
      worksheet.columns = [
        { header: "ID", key: "id" },
        { header: "名称", key: "name" },
        { header: "価格", key: "price" },
      ];
      // 行を定義
      worksheet.addRow({ id: 1001, name: "みかん", price: 170 });
      worksheet.addRow({ id: 1002, name: "バナナ", price: 200 });
      worksheet.addRow({ id: 1003, name: "りんご", price: 260 });
      worksheet.addRow({ id: 1004, name: "トマト", price: 190 });
      // UInt8Arrayを生成
      const uint8Array = await workbook.xlsx.writeBuffer();
      // Blob
      const blob = new Blob([uint8Array], { type: "application/octet-binary" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `演劇部決算.xlsx`;
      a.click();
      // ダウンロード後は不要なのでaタグを除去
      a.remove();
    } else {
      alert("第二パスワードが異なります。");
    }
  }
  isCompleated = process.env.NEXT_PUBLIC_EXCEL_COMPLEATED == "true";
  render() {
    let inputPass = "";
    return (
      <>
        {!this.isCompleated ? (
          <Text fontSize={"xl"}>作成中です。現在は使用できません。</Text>
        ) : (
          <>
            <VStack>
              <Heading>Excelダウンロードページ</Heading>
              <Text fontSize={"xl"}>
                ダウンロードには第二パスワードが必要です。
              </Text>
              <FormControl>
                <FormLabel>第二パスワード</FormLabel>
                <Input
                  onChange={(e) => {
                    inputPass = e.target.value;
                  }}
                  type="password"
                ></Input>
              </FormControl>
              <p>{inputPass}</p>
              <Button onClick={(e) => this.clickButtonAsync(e, inputPass)}>
                ダウンロード
              </Button>
            </VStack>
          </>
        )}
      </>
    );
  }
}
