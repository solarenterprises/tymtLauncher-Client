import { mnemonicToSeed } from "bip39";
import { pki, random, md, util } from "node-forge";

export const getRsaKeyPair = async (_mnemonic) => {
  try {
    if (!_mnemonic) {
      console.error("Failed to getRsaKeyPair: _mnemonic undefined");
      return {
        publicKey: "",
        privateKey: "",
      };
    }
    const seed = (await mnemonicToSeed(_mnemonic)).toString("hex");
    const prng = random.createInstance();
    prng.seedFileSync = () => seed;
    const { publicKey, privateKey } = pki.rsa.generateKeyPair({ bits: 2048, prng, workers: 2 });
    console.log("getRsaKeyPair");
    return {
      publicKey: pki.publicKeyToPem(publicKey),
      privateKey: pki.privateKeyToPem(privateKey),
    };
  } catch (err) {
    console.error("Failed to getRsaKeyPair: ", err);
    return {
      publicKey: "",
      privateKey: "",
    };
  }
};

export const rsaEncrypt = (plainText: string, publicKey: string) => {
  try {
    if (!plainText || !publicKey) {
      console.error("Failed to getRsaKeyPair: plainText or publicKey undefined");
      return {
        publicKey: "",
        privateKey: "",
      };
    }
    const publicKeyForge = pki.publicKeyFromPem(publicKey);
    const encrypted = publicKeyForge.encrypt(plainText, "RSA-OAEP", {
      md: md.sha256.create(),
    });
    console.log("rsaEncrypt");
    return util.encode64(encrypted);
  } catch (err) {
    console.error("Failed to rsaEncrypt: ", err);
    return "";
  }
};

export const rsaDecrypt = (encryptedText: string, privateKey: string) => {
  try {
    if (!encryptedText || !privateKey) {
      console.error("Failed to getRsaKeyPair: encryptedText or privateKey undefined");
      return {
        publicKey: "",
        privateKey: "",
      };
    }
    const privateKeyForge = pki.privateKeyFromPem(privateKey);
    const encryptedBytes = util.decode64(encryptedText);
    const decrypted = privateKeyForge.decrypt(encryptedBytes, "RSA-OAEP", {
      md: md.sha256.create(),
    });
    return decrypted;
  } catch (err) {
    console.error("Failed to rsaDecrypt: ", err);
    return "";
  }
};
