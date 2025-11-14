import { knapSackAtom } from "@/lib/jotai/knapSackAtom";
import { knapSackSelectDataChangedAtom } from "@/lib/jotai/knapSAckSelectDataChanged";
import { knapSackSelectDateAtom } from "@/lib/jotai/knapSackSelectDateAtom";
import { knapSackAccountType } from "@/pages/admin/KnapSack";
import { Tr, Td, Checkbox } from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

export function KnapSackData({
  accountData,
}: {
  accountData: knapSackAccountType;
}) {
  const accountTypes = ["main", "hatosai", "clubsupport", "alumni", "aid"];
  const accountTypeString = [
    "本予算",
    "鳩山祭",
    "後援会費",
    "校友会費",
    "共済金",
  ];
  const [selected, setSelected] = useState(false);
  const [knapSackData, setKnapSackData] = useAtom(knapSackAtom);
  const knapSackSelectDate = useAtomValue(knapSackSelectDateAtom);
  const setKnapSackSelectDataChanged = useSetAtom(
    knapSackSelectDataChangedAtom
  );
  useEffect(() => {
    if (knapSackData?.includes(accountData)) {
      setSelected(true);
    } else {
      setSelected(false);
    }
    console.log("外部で状態が変化されました");
  }, [knapSackSelectDate]);
  const handleSelect = () => {
    if (!selected) {
      console.log("追加します");
      if (!knapSackData) {
        setKnapSackData([accountData]);
        return;
      } else {
        setKnapSackData([...knapSackData!, accountData]);
      }
    } else {
      console.log("削除します");
      setKnapSackData(
        knapSackData!.filter((data) => data.id !== accountData.id)
      );
    }
    console.log(knapSackData);
  };
  return (
    <>
      <Tr>
        <Td>
          <Checkbox
            onChange={() => {
              setSelected(!selected);
              setKnapSackSelectDataChanged(true);
              handleSelect();
            }}
            isChecked={selected}
          />
        </Td>
        <Td
          color={selected ? "red" : "black"}
          fontWeight={selected ? "extrabold" : "normal"}
        >{`${new Date(accountData.date).getFullYear()}年${
          new Date(accountData.date).getMonth() + 1
        }月${new Date(accountData.date).getDate()}日`}</Td>
        <Td
          color={selected ? "red" : "black"}
          fontWeight={selected ? "extrabold" : "normal"}
        >
          {accountData.type}
        </Td>
        <Td
          color={selected ? "red" : "black"}
          fontWeight={selected ? "extrabold" : "normal"}
        >
          {accountData.fixture}
        </Td>
        <Td
          color={selected ? "red" : "black"}
          fontWeight={selected ? "extrabold" : "normal"}
        >
          {accountData.outcome}
        </Td>
        <Td
          color={selected ? "red" : "black"}
          fontWeight={selected ? "extrabold" : "normal"}
        >
          {accountTypeString[accountTypes.indexOf(accountData.from)]}
        </Td>
      </Tr>
    </>
  );
}

export function KnapSackResultData({
  accountData,
}: {
  accountData: knapSackAccountType;
}) {
  const accountTypes = ["main", "hatosai", "clubsupport", "alumni", "aid"];
  const accountTypeString = [
    "本予算",
    "鳩山祭",
    "後援会費",
    "校友会費",
    "共済金",
  ];
  return (
    <>
      <Tr>
        <Td>{`${new Date(accountData.date).getFullYear()}年${
          new Date(accountData.date).getMonth() + 1
        }月${new Date(accountData.date).getDate()}日`}</Td>
        <Td>{accountData.type}</Td>
        <Td>{accountData.fixture}</Td>
        <Td>{accountData.outcome}</Td>
        <Td>{accountTypeString[accountTypes.indexOf(accountData.from)]}</Td>
      </Tr>
    </>
  );
}
