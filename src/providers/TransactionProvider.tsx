import { Outlet } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { emit } from "@tauri-apps/api/event";
import { IGetAccount } from "../types/eventParamTypes";
import { multiWalletType } from "../types/walletTypes";
import { useSelector } from "react-redux";
import { getMultiWallet } from "../features/wallet/MultiWalletSlice";

interface ITestPostEndpoint {
  a: number;
  b: number;
}

const TransactionProvider = () => {
  const { socket } = useSocket();
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);

  socket.on("message-posted", async () => {
    await invoke("show_transaction_window");
  });

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitTwentySeconds() {
    console.log("Start");
    await delay(20000); // 20 seconds in milliseconds
    console.log("After 20 seconds");
  }

  useEffect(() => {
    const unlisten_endpoint = listen("test-post-endpoint", async (event) => {
      console.log(JSON.parse(event.payload as string));
      const json_data: ITestPostEndpoint = JSON.parse(event.payload as string);
      const c = json_data.a + json_data.b;
      console.log({ message: c });
      await waitTwentySeconds();
      emit("res-test-post-endpoint", JSON.stringify({ message: c }));
    });

    const unlisten_get_account = listen("POST-/get-account", async (event) => {
      const json_data: IGetAccount = JSON.parse(event.payload as string);
      let res: string = "";
      switch (json_data.chain) {
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
      emit("res-POST-/get-account", res);
    });

    return () => {
      unlisten_endpoint.then((unlistenFn) => unlistenFn());
      unlisten_get_account.then((unlistenFn) => unlistenFn());
    };
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
