import * as crypto from "crypto";
import createKeccakHash from "keccak";

export const encrypt = async (_mnemonic: string, _password: string) => {
  const key = crypto.createHash("sha512").update(_password.normalize("NFD")).digest("hex").substring(0, 32);
  const encryptionIV = crypto.createHash("sha512").update("secretIV").digest("hex").substring(0, 16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, encryptionIV);
  const encrypted = Buffer.from(cipher.update(_mnemonic.normalize("NFD"), "utf8", "hex") + cipher.final("hex")).toString("base64");
  return encrypted;
};

export const decrypt = async (_encryptedMnemonic: string, _password: string) => {
  try {
    const key = crypto.createHash("sha512").update(_password.normalize("NFD")).digest("hex").substring(0, 32);
    const encryptionIV = crypto.createHash("sha512").update("secretIV").digest("hex").substring(0, 16);
    const buff = Buffer.from(_encryptedMnemonic.normalize("NFD"), "base64");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);
    return decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const generateRandomString = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!#~$%^&*()-=+";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const getKeccak256Hash = (plain: string) => {
  try {
    const res = createKeccakHash("keccak256").update(plain).digest("hex");
    return res;
  } catch (err) {
    console.log("Failed to getKeccak256Hash: ", err);
  }
};

