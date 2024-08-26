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
