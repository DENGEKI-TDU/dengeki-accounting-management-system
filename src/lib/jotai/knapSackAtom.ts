import { knapSackAccountType } from "@/pages/admin/KnapSack";
import { atom } from "jotai";

export const knapSackAtom = atom<knapSackAccountType[]|null>(null);
