import { IRecipient } from "../../features/wallet/CryptoApi";
import { nonCustodialType } from "../../types/accountTypes";
import { IGetAccountReq, IGetBalanceReq } from "../../types/eventParamTypes";
import { multiWalletType } from "../../types/walletTypes";
import tymtCore from "../core/tymtCore";
import tymtStorage from "../Storage";
import { decrypt } from "./Encrypt";

export default class TransactionProviderAPI {
  static getAccount = async (params: IGetAccountReq) => {
    let multiWalletStore: multiWalletType = JSON.parse(
      tymtStorage.get(`multiWallet`)
    );
    let res: string = "";
    switch (params.chain) {
      case "solar":
        res = multiWalletStore.Solar.chain.wallet;
        break;
      case "evm":
        res = multiWalletStore.Ethereum.chain.wallet;
        break;
      case "bitcoin":
        res = multiWalletStore.Bitcoin.chain.wallet;
        break;
      case "solana":
        res = multiWalletStore.Solana.chain.wallet;
        break;
    }
    return res;
  };

  static getBalance = async (params: IGetBalanceReq) => {
    const { chain, address } = params;
    let bal: number = 0;
    switch (chain) {
      case "solar":
        bal = await tymtCore.Blockchains.solar.wallet.getBalance(address);
        bal *= 1e8; // SXP decimal
        break;
      case "bitcoin":
        bal = await tymtCore.Blockchains.btc.wallet.getBalance(address);
        break;
      case "solana":
        bal = await tymtCore.Blockchains.solana.wallet.getBalance(address);
        break;
      case "ethereum":
        bal = await tymtCore.Blockchains.eth.wallet.getBalance(address);
        break;
      case "binance":
        bal = await tymtCore.Blockchains.bsc.wallet.getBalance(address);
        break;
      case "polygon":
        bal = await tymtCore.Blockchains.polygon.wallet.getBalance(address);
        break;
      case "arbitrum":
        bal = await tymtCore.Blockchains.arbitrum.wallet.getBalance(address);
        break;
      case "avalanche":
        bal = await tymtCore.Blockchains.avalanche.wallet.getBalance(address);
        break;
      case "optimism":
        bal = await tymtCore.Blockchains.op.wallet.getBalance(address);
        break;
    }
    return bal;
  };

  // currently only for Solar Blockchain
  static sendTransaction = async (
    chain: string,
    to: string,
    amount: string,
    password: string,
    fee: string
  ) => {
    console.log("API entered");
    const nonCustodialStore: nonCustodialType = JSON.parse(
      tymtStorage.get(`nonCustodial`)
    );
    const passphrase: string = await decrypt(
      nonCustodialStore.mnemonic,
      password
    );
    const recipients: IRecipient[] = [
      {
        address: to,
        amount: amount,
      },
    ];
    const tx = {
      recipients: recipients,
      fee: fee,
    };
    let res;
    switch (chain) {
      case "solar":
        console.log("solar");
        res = await tymtCore.Blockchains.solar.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "bitcoin":
        res = await tymtCore.Blockchains.btc.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "solana":
        res = await tymtCore.Blockchains.solana.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "ethereum":
        res = await tymtCore.Blockchains.eth.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "binance":
        res = await tymtCore.Blockchains.bsc.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "polygon":
        res = await tymtCore.Blockchains.polygon.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "arbitrum":
        res = await tymtCore.Blockchains.arbitrum.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "avalanche":
        res = await tymtCore.Blockchains.avalanche.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
      case "optimism":
        res = await tymtCore.Blockchains.op.wallet.sendTransaction(
          passphrase,
          tx
        );
        break;
    }
    return res;
  };
}
