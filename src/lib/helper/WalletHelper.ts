import * as bip39 from "bip39";
import { IWallet } from "../../types/walletTypes";
import tymtCore from "../core/tymtCore";

export const getWalletAddressFromPassphrase = async (passphrase: string) => {
  try {
    const solarAddr = await tymtCore.Blockchains.solar.wallet.getAddress(passphrase);
    const bscAddr = await tymtCore.Blockchains.bsc.wallet.getAddress(passphrase);
    const ethereumAddr = await tymtCore.Blockchains.eth.wallet.getAddress(passphrase);
    const bitcoinAddr = await tymtCore.Blockchains.btc.wallet.getAddress(passphrase);
    const solanaAddr = await tymtCore.Blockchains.solana.wallet.getAddress(passphrase);
    const polygonAddr = await tymtCore.Blockchains.polygon.wallet.getAddress(passphrase);
    const avalancheAddr = await tymtCore.Blockchains.avalanche.wallet.getAddress(passphrase);
    const arbitrumAddr = await tymtCore.Blockchains.arbitrum.wallet.getAddress(passphrase);
    const optimismAddr = await tymtCore.Blockchains.op.wallet.getAddress(passphrase);

    const res: IWallet = {
      arbitrum: arbitrumAddr,
      avalanche: avalancheAddr,
      bitcoin: bitcoinAddr,
      binance: bscAddr,
      ethereum: ethereumAddr,
      optimism: optimismAddr,
      polygon: polygonAddr,
      solana: solanaAddr,
      solar: solarAddr,
    };

    console.log("getWalletAddressFromPassphrase", res);
    return res;
  } catch (err) {
    console.log("Failed to getWalletAddressFromPassphrase: ", err);
  }
};

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice(); // Clone the array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

export const getMnemonic = (_length: number) => {
  if (_length === 12) {
    return `${bip39.generateMnemonic()}`;
  } else if (_length === 24) {
    return `${bip39.generateMnemonic()} ${bip39.generateMnemonic()}`;
  }
  return "";
};

export const checkMnemonic = (_mnemonic: string) => {
  if (_mnemonic.split(" ").length == 24) {
    return (
      (bip39.validateMnemonic(_mnemonic.split(" ").slice(0, 12).join(" ")) && bip39.validateMnemonic(_mnemonic.split(" ").slice(12, 24).join(" "))) ||
      bip39.validateMnemonic(_mnemonic)
    );
  } else if (_mnemonic.split(" ").length == 12) {
    return bip39.validateMnemonic(_mnemonic);
  }
  return false;
};
