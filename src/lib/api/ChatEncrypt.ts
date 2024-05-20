import * as crypto from "crypto";
// import { translateString } from "./Translate";

export const Chatencrypt = (_mnemonic: string, _password: string) => {
  const key = crypto
    .createHash("sha512")
    .update(_password.normalize("NFD"))
    .digest("hex")
    .substring(0, 32);
  const encryptionIV = crypto
    .createHash("sha512")
    .update("secretIV")
    .digest("hex")
    .substring(0, 16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, encryptionIV);
  const encrypted = Buffer.from(
    cipher.update(_mnemonic.normalize("NFD"), "utf8", "hex") +
      cipher.final("hex")
  ).toString("base64");
  return encrypted;
};

export const Chatdecrypt = (_encryptedMnemonic: string, _password: string) => {
  try {
    const key = crypto
      .createHash("sha512")
      .update(_password.normalize("NFD"))
      .digest("hex")
      .substring(0, 32);
    const encryptionIV = crypto
      .createHash("sha512")
      .update("secretIV")
      .digest("hex")
      .substring(0, 16);
    const buff = Buffer.from(_encryptedMnemonic.normalize("NFD"), "base64");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);
    return (
      decipher.update(buff.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8")
    );
  } catch (e) {
    // console.log(e);
    return "Unable to decode message #tymt114#";
    // return <ThreeDots height="100%" width={100} radius={3} color={`#EF4444`} />;
  }
};
