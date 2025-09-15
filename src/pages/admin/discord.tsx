import { DengekiSSO } from "@/hooks/UseLoginState";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import {
  Button,
  Heading,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useAtomValue } from "jotai";
import router from "next/router";
import { useState, useEffect } from "react";

export default function main() {
  const { session, login, logout } = DengekiSSO();
  const userName = useAtomValue(loginNameAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const [pending, setPending] = useState(true);
  const [mainThread, setMainThread] = useState("");
  const [hatosaiThread, setHatosaiThread] = useState("");
  const [alumniThread, setAlumniThread] = useState("");
  const [clubSupportThread, setClubSupportThread] = useState("");
  const [mainPastThread, setMainPastThread] = useState("");
  const [hatosaiPastThread, setHatosaiPastThread] = useState("");
  const [alumniPastThread, setAlumniPastThread] = useState("");
  const [clubSupportPastThread, setClubSupportPastThread] = useState("");
  const toast = useToast();
  useEffect(() => {
    session().then(() => {
      setPending(false);
    });
    axios.get("/api/discord/getThreadID").then((res) => {
      setMainThread(res.data.main);
      setHatosaiThread(res.data.hatosai);
      setAlumniThread(res.data.alumni);
      setClubSupportThread(res.data.clubsupport);
      setMainPastThread(res.data.main);
      setHatosaiPastThread(res.data.hatosai);
      setAlumniPastThread(res.data.alumni);
      setClubSupportPastThread(res.data.clubsupport);
    });
  }, []);
  useEffect(() => {}, [mainThread]);
  if (isLogin && isAdmin) {
    return (
      <>
        <Heading>{pending ? "セッション確認中" : "セッション確認完了"}</Heading>
        <VStack w="100%">
          <HStack w="80%">
            <Text w="25%">本会計スレッドID</Text>
            <Input
              focusBorderColor="lime"
              w="75%"
              defaultValue={mainThread}
              onChange={(e) => {
                setMainThread(e.target.value);
              }}
            ></Input>
          </HStack>
          {mainThread.length != 19 ? (
            <Text fontWeight={"extrabold"} color={"red"}>
              本会計スレッドIDが不正です
            </Text>
          ) : null}
        </VStack>
        <VStack w="100%">
          <HStack w="80%">
            <Text w="25%">鳩祭会計スレッドID</Text>
            <Input
              focusBorderColor="pink.400"
              w="75%"
              defaultValue={hatosaiThread}
              onChange={(e) => {
                setHatosaiThread(e.target.value);
              }}
            ></Input>
          </HStack>
          {hatosaiThread.length != 19 ? (
            <Text fontWeight={"extrabold"} color={"red"}>
              鳩祭会計スレッドIDが不正です
            </Text>
          ) : null}
        </VStack>
        <VStack w="100%">
          <HStack w="80%">
            <Text w="25%">後援会費会計スレッドID</Text>
            <Input
              focusBorderColor="lime"
              w="75%"
              defaultValue={clubSupportThread}
              onChange={(e) => {
                setClubSupportThread(e.target.value);
              }}
            ></Input>
          </HStack>
          {clubSupportThread.length != 19 ? (
            <Text fontWeight={"extrabold"} color={"red"}>
              後援会費会計スレッドIDが不正です
            </Text>
          ) : null}
        </VStack>
        <VStack w="100%">
          <HStack w="80%">
            <Text w="25%">校友会費会計スレッドID</Text>
            <Input
              focusBorderColor="pink.400"
              w="75%"
              defaultValue={alumniThread}
              onChange={(e) => {
                setAlumniThread(e.target.value);
              }}
            ></Input>
          </HStack>
          {alumniThread.length != 19 ? (
            <Text fontWeight={"extrabold"} color={"red"}>
              校友会費会計スレッドIDが不正です
            </Text>
          ) : null}
        </VStack>
        {mainThread != mainPastThread ||
        hatosaiThread != hatosaiPastThread ||
        alumniThread != alumniPastThread ||
        clubSupportThread != clubSupportPastThread ||
        mainThread.length == 19 ||
        hatosaiThread.length == 19 ||
        alumniThread.length == 19 ||
        clubSupportThread.length == 19 ? (
          <Button
            onClick={() => {
              toast({
                title: "更新中",
                status: "loading",
                isClosable: false,
              });
              axios
                .post("/api/discord/updateThread", {
                  threadID: {
                    main: mainThread,
                    hatosai: hatosaiThread,
                    clubSupport: clubSupportThread,
                    alumni: alumniThread,
                  },
                })
                .then(() => {
                  toast.closeAll();
                  toast({
                    title: "更新完了",
                    description: "更新が完了しました",
                    status: "success",
                    isClosable: true,
                    duration: 3000,
                  });
                })
                .catch(() => {
                  toast.closeAll();
                  toast({
                    title: "更新エラー",
                    description: "更新作業でエラーが発生しました。",
                    status: "error",
                    isClosable: true,
                    duration: 3000,
                  });
                });
            }}
          >
            変更する
          </Button>
        ) : null}
      </>
    );
  } else {
    if (isLogin) {
      return <Heading>一般ユーザーの権限では使用できません。</Heading>;
    } else {
      if (pending) {
        return <Heading>ログイン状態確認中</Heading>;
      } else {
        return (
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
        );
      }
    }
  }
}
