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
import React from "react";
import { isLoginAtom } from "@/lib/jotai/isLoginAtom";
import { useAtomValue } from "jotai";

export default function LoginForm() {
  const serceParams = useSearchParams();
  const pageLocate = serceParams.get("pagelocate");

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

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
        <VStack w="100%">
          <Center top={10} w={"50%"}>
            <VStack>
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input
                  variant="flushed"
                  onChange={(e) => setId(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
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
