import { KnapSackData, KnapSackResultData } from "@/components/knapsack";
import { knapSackAtom } from "@/lib/jotai/knapSackAtom";
import { knapSackSelectDateAtom } from "@/lib/jotai/knapSackSelectDateAtom";
import {
  Box,
  Button,
  Checkbox,
  Select,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
  useToast,
  VStack,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";

export type knapSackAccountType = {
  id: number;
  date: string;
  year: number;
  type: string;
  typeAlphabet: string;
  subtype: string;
  fixture: string;
  income: number;
  outcome: number;
  from: string;
};

type balanceType = {
  income: number;
  outcome: number;
  balance: number;
  hatosaiIncome: number;
  hatosaiOutcome: number;
  hatosaiBalance: number;
  csIncome: number;
  csOutcome: number;
  csBalance: number;
  alumniIncome: number;
  alumniOutcome: number;
  alumniBalance: number;
  aidIncome: number;
  aidOutcome: number;
  aidBalance: number;
};

const knapsack = (accountDatas: knapSackAccountType[], maxAmount: number) => {
  const n = accountDatas.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(maxAmount + 1).fill(0)
  );
  for (let i = 1; i <= n; i++) {
    const weight = accountDatas[i - 1].outcome;
    for (let w = 0; w <= maxAmount; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + weight);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  const maxValue = dp[n][maxAmount];
  let w = maxAmount;
  const chosenIDs: knapSackAccountType[] = [];
  for (let i = n; i > 0; i--) {
    if (w <= 0) break;
    if (dp[i][w] !== dp[i - 1][w]) {
      chosenIDs.push(accountDatas[i - 1]);
      w -= accountDatas[i - 1].outcome;
    }
  }
  return { result: chosenIDs, value: maxValue };
};

export default function Home() {
  // Session周りの定数定義
  const { session, login, logout } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [pending, setPending] = useState(true);
  const router = useRouter();
  //   KS問題計算用の定数定義
  const [allAccounts, setAllAccounts] = useState<knapSackAccountType[]>([]);
  const [balance, setBalance] = useState<balanceType>();
  const [knapSackFrom, setKnapSackFrom] = useState<string>("");
  const [knapSackMaxAmount, setKnapSackMaxAmount] = useState<number>(0);
  const [knapSackMaxAmountType, setKnapSackMaxAmountType] =
    useState<string>("");
  const [knapSackResult, setKnapSackResult] = useState<{
    result: knapSackAccountType[];
    value: number;
  }>();
  const [knapSackData, setKnapSackData] = useAtom(knapSackAtom);
  const setKnapSackSelectDate = useSetAtom(knapSackSelectDateAtom);
  const [selectAll, setSelectAll] = useState(false);
  const accountTypes = ["main", "hatosai", "clubsupport", "alumni", "aid"];
  const accountTypeString = [
    "本予算",
    "鳩山祭",
    "後援会費",
    "校友会費",
    "共済金",
  ];
  const toast = useToast();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
  }, []);

  useEffect(() => {
    if (isAdmin) {
      axios
        .get<knapSackAccountType[]>("/api/database/post-earnings/all")
        .then((res) => {
          setAllAccounts(res.data);
        });
      axios.get<balanceType>("/api/database/earnings").then((res) => {
        setBalance(res.data);
      });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (knapSackData?.length === allAccounts?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [knapSackData]);

  const checkMaxAmount = () => {
    if (knapSackFrom === "main") {
      return balance?.income;
    } else if (knapSackFrom === "hatosai") {
      return balance?.hatosaiIncome;
    } else if (knapSackFrom === "clubsupport") {
      return balance?.csIncome;
    } else if (knapSackFrom === "alumni") {
      return balance?.alumniIncome;
    } else if (knapSackFrom === "aid") {
      return balance?.aidIncome;
    }
  };

  const checkMax = () => {
    if (knapSackMaxAmountType === "all") {
      if (knapSackFrom === "main") {
        return balance?.income;
      } else if (knapSackFrom === "hatosai") {
        return balance?.hatosaiIncome;
      } else if (knapSackFrom === "clubsupport") {
        return balance?.csIncome;
      } else if (knapSackFrom === "alumni") {
        return balance?.alumniIncome;
      } else if (knapSackFrom === "aid") {
        return balance?.aidIncome;
      }
    } else {
      if (knapSackFrom === "main") {
        return balance?.balance;
      } else if (knapSackFrom === "hatosai") {
        return balance?.hatosaiBalance;
      } else if (knapSackFrom === "clubsupport") {
        return balance?.csBalance;
      } else if (knapSackFrom === "alumni") {
        return balance?.alumniBalance;
      } else if (knapSackFrom === "aid") {
        return balance?.aidBalance;
      }
    }
  };

  const throwKnapSack = () => {
    const maxAmount =
      knapSackMaxAmountType === "custom" ? knapSackMaxAmount : checkMax();
    if (knapSackData && maxAmount) {
      setKnapSackResult(knapsack(knapSackData, maxAmount));
    } else {
      toast({
        title: "エラー",
        description: "会計種別と金額上限、選択データを確認してください",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {!pending && isLogin ? (
        <>
          <Heading>KnapSack計算ページ</Heading>
          {isAdmin ? (
            <>
              {allAccounts ? (
                <>
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>
                            <Checkbox
                              onChange={() => {
                                setKnapSackSelectDate(new Date());
                                if (
                                  knapSackData?.length != allAccounts.length
                                ) {
                                  setKnapSackData(allAccounts);
                                } else {
                                  setKnapSackData(null);
                                }
                              }}
                              isChecked={selectAll}
                            />
                          </Th>
                          <Th>date</Th>
                          <Th>type</Th>
                          <Th>品目名</Th>
                          <Th>支出額</Th>
                          <Th>会計種別</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {allAccounts.map((allAccount) => (
                          <>
                            <KnapSackData
                              accountData={allAccount}
                              key={allAccount.id}
                            />
                          </>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Box
                    w="80%"
                    borderRadius={"md"}
                    border={"1px solid #fc8819"}
                    marginBottom={"20px"}
                  >
                    <Center w="100%">
                      <VStack w="100%">
                        <Text>使用する会計種別・金額を選択</Text>
                        <HStack w="100%">
                          <Center w="100%">
                            <Select
                              placeholder="会計種別"
                              onChange={(e) => {
                                setKnapSackFrom(e.target.value);
                              }}
                              w="30%"
                            >
                              <option value="main">本予算</option>
                              <option value="hatosai">鳩山祭</option>
                              <option value="clubsupport">後援会費</option>
                              <option value="alumni">校友会費</option>
                              <option value="aid">共済金</option>
                            </Select>
                            <Select
                              placeholder="金額上限"
                              onChange={(e) => {
                                setKnapSackMaxAmountType(e.target.value);
                              }}
                              w="30%"
                            >
                              <option value="all">収入全て</option>
                              <option value="balance">残高すべて</option>
                              <option value="custom">手動指定</option>
                            </Select>
                            {knapSackMaxAmountType === "custom" ? (
                              <Box w="40%">
                                <Text>金額を入力</Text>
                                <NumberInput
                                  min={0}
                                  max={checkMaxAmount()}
                                  onChange={(e) =>
                                    setKnapSackMaxAmount(Number(e))
                                  }
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </Box>
                            ) : null}
                          </Center>
                        </HStack>
                        <VStack>
                          {knapSackData &&
                          knapSackFrom != "" &&
                          knapSackMaxAmountType != "" ? (
                            <Button
                              onClick={() => {
                                throwKnapSack();
                              }}
                              color={"#fc8819"}
                            >
                              選択された{knapSackData?.length}件のデータと
                              {
                                accountTypeString[
                                  accountTypes.indexOf(knapSackFrom)
                                ]
                              }
                              の
                              {knapSackMaxAmountType == "custom"
                                ? `収入のうち${knapSackMaxAmount}円`
                                : `${
                                    knapSackMaxAmountType == "all"
                                      ? "収入全て"
                                      : "残高全て"
                                  }`}
                              でKnapSackを解く！
                            </Button>
                          ) : null}
                          {knapSackResult && knapSackResult.result ? (
                            <>
                              <Text>計算結果</Text>
                              <TableContainer>
                                <Table>
                                  <Thead>
                                    <Tr>
                                      <Th>date</Th>
                                      <Th>type</Th>
                                      <Th>品目名</Th>
                                      <Th>支出額</Th>
                                      <Th>会計種別</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {knapSackResult.result.map((result) => (
                                      <>
                                        <KnapSackResultData
                                          accountData={result}
                                          key={result.id}
                                        />
                                      </>
                                    ))}
                                  </Tbody>
                                </Table>
                              </TableContainer>
                              <Text
                                fontSize={"xl"}
                                fontWeight={"extrabold"}
                                color={"blue"}
                              >
                                合計 : {knapSackResult.value}円
                              </Text>
                            </>
                          ) : null}
                        </VStack>
                      </VStack>
                    </Center>
                  </Box>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </>
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
