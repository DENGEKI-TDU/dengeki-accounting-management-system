import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DengekiSSO } from "@/hooks/UseLoginState";
import { useSearchParams } from "next/navigation";
import Router, { useRouter, usePathname } from "next/navigation";
import React from "react";
import { isAdminAtom } from "@/lib/jotai/isAdminAtom";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { loginNameAtom } from "@/lib/jotai/loginNameAtom";
import { useAtomValue } from "jotai";

export default function LoginForm() {
  const router = useRouter();
  const serceParams = useSearchParams();
  const pageLocate = serceParams.get("pagelocate");
  const [ip, setIp] = useState("");
  const [host, setHost] = useState("");
  const [locate, setLocate] = useState("");

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const ipUrl = "https://ipinfo.io/json";
  const getIp = async () => {
    await fetch(ipUrl).then(async (response) => {
      await response.json().then((data) => {
        setIp(data.ip);
        setHost(data.hostname);
        setLocate(`${data.city},${data.region},${data.country}`);
      });
    });
  };

  const { session, login, logout } = DengekiSSO();
  const isLogin = useAtomValue(isLoginAtom);
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    session();
  }, []);

  return (
    <>
      {isLogin ? (
        <>
          <Heading>ログイン済みです。</Heading>
          <Text>
            <Link href="/" color={"#fc8819"}>
              トップページ
            </Link>
            に進む
          </Text>
        </>
      ) : (
        <VStack>
          <Center top={10} w={"50%"}>
            <VStack>
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input
                  variant="flushed"
                  type="id"
                  onChange={(e) => setId(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Pass Word</FormLabel>
                <InputGroup>
                  <Input
                    variant="flushed"
                    type={show ? "text" : "password"}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                onClick={() =>
                  login({ name: id, password: pass, locate: pageLocate })
                }
              >
                login
              </Button>
            </VStack>
          </Center>
        </VStack>
      )}
    </>
  );
}
