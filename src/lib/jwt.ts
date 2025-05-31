const crypto = require("crypto");

const decodeBase64 = (base64Str: string) => {
  // Base64 のパディング（`=`）が削除されている場合、適切に復元する
  const padding = "=".repeat((4 - (base64Str.length % 4)) % 4);
  const base64WithPadding = base64Str + padding;

  // Base64 をデコードして JSON に変換
  const jsonStr = Buffer.from(base64WithPadding, "base64").toString("utf-8");
  return JSON.parse(jsonStr);
};

const HMAC_SHA256 = (key: string, data: string) => {
  const hash = crypto.createHmac("sha256", key).update(data).digest("base64");
  const hashNoPadding = hash.replace(/={1,2}$/, "");
  return hashNoPadding;
};

export const checkJWT = async (jwt: string) => {
  const key = process.env.JWT_KEY as string;
  const splits = jwt.split(".");
  const unsignedToken = [splits[0], splits[1]].join(".");
  const signature = splits[2];

  const decodeData: {
    name: string;
    isAdmin: boolean;
    isDev: boolean;
    isTreasurer: boolean;
    createat: Date;
  } = decodeBase64(splits[1]);
  const limit = new Date(new Date().setHours(new Date().getHours() - 3));
  if (limit <= new Date(decodeData.createat)) {
    return {
      name: decodeData.name,
      isLogin: HMAC_SHA256(key, unsignedToken) === signature,
      isAdmin: decodeData.isAdmin,
      isDev: decodeData.isDev,
      isTreasurer: decodeData.isTreasurer,
    };
  } else {
    await fetch("/api/logout");
    return {
      name: "",
      isLogin: false,
      isAdmin: false,
      isDev: false,
      isTreasurer: false,
    };
  }
};
