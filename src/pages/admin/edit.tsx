import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Box,
  Button,
  Center,
  Heading,
  VStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { GetServerSideProps, GetStaticProps } from "next";
import prisma from "@/lib/prisma";
import Update from "../../components/update";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";
import axios from "axios";

type updateAccount = {
  response: any;
  id: number;
  year: string;
  date: Date;
  type: string;
  typeAlphabet: string;
  subtype: string;
  fixture: string;
  income: number;
  outcome: number;
};

const Home: React.FC<updateAccount> = (props) => {
  const fromType = ["main", "hatosai", "clubsupport", "alumni"];
  const fromName = ["本予算", "鳩山祭援助金", "後援会費", "校友会費"];
  const { session, login, logout } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [pending, setPending] = useState(true);
  const [from, setFrom] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<updateAccount[]>();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);
  useEffect(() => {
    console.log(searchParams.get("from"));
    setFrom(searchParams.get("from"));
    if (
      searchParams.get("from") == "main" ||
      searchParams.get("from") == "hatosai" ||
      searchParams.get("from") == "clubsupport" ||
      searchParams.get("from") == "alumni"
    ) {
      axios.get(`/api/database/get/${searchParams.get("from")}`).then((res) => {
        setAccountData(res.data.data);
      });
    }
  }, [searchParams]);
  return (
    <>
      {!pending && isLogin ? (
        <>
          {isAdmin ? (
            <Center width="100%">
              {["main", "hatosai", "alumni", "clubsupport"].includes(from!) &&
              from ? (
                <VStack width="100%">
                  <Heading>
                    {fromName[fromType.indexOf(from)]}収支報告編集ページ
                  </Heading>
                  <Table width="100%">
                    <Thead>
                      <Tr>
                        <Th>年度</Th>
                        <Th>購入日時</Th>
                        <Th>分類</Th>
                        <Th>分類番号大</Th>
                        <Th>分類項目小</Th>
                        <Th>名称</Th>
                        <Th>収入</Th>
                        <Th>支出</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    {accountData ? (
                      <Tbody>
                        {accountData.map((account) => (
                          <Tr key={account.id}>
                            <Update update={account} from={from} />
                          </Tr>
                        ))}
                      </Tbody>
                    ) : (
                      <>
                        <Text>データ取得中</Text>
                      </>
                    )}
                  </Table>
                </VStack>
              ) : (
                <VStack>
                  <Heading>クエリが不正です。</Heading>
                  <Text>次のリンクから再アクセスしてください。</Text>
                  <Link href={"/admin/edit?from=main"}>
                    <Box borderBottom="1px solid #fc8819">本予算</Box>
                  </Link>
                  <Link href={"/admin/edit?from=hatosai"}>
                    <Box borderBottom="1px solid #fc8819">鳩祭援助金</Box>
                  </Link>
                  <Link href={"/admin/edit?from=clubsupport"}>
                    <Box borderBottom="1px solid #fc8819">後援会費関連</Box>
                  </Link>
                  <Link href={"/admin/edit?from=alumni"}>
                    <Box borderBottom="1px solid #fc8819">校友会費関連</Box>
                  </Link>
                </VStack>
              )}
            </Center>
          ) : (
            <Text>一般ユーザーの権限では使用できません。</Text>
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
};

export default Home;
