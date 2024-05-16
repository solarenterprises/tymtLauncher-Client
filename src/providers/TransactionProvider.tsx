import { Outlet } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { emit } from "@tauri-apps/api/event";
import { IGetAccountReq, IGetBalanceReq } from "../types/eventParamTypes";
import TransactionProviderAPI from "../lib/api/TransactionProviderAPI";

const TransactionProvider = () => {
  useEffect(() => {
    const unlisten_get_account = listen("POST-/get-account", async (event) => {
      const json_data: IGetAccountReq = JSON.parse(event.payload as string);
      let res: string = await TransactionProviderAPI.getAccount(json_data);
      emit("res-POST-/get-account", res);
    });

    const unlisten_get_balance = listen("POST-/get-balance", async (event) => {
      const json_data: IGetBalanceReq = JSON.parse(event.payload as string);
      let bal: number = await TransactionProviderAPI.getBalance(json_data);
      emit("res-POST-/get-balance", bal);
    });

    return () => {
      unlisten_get_account.then((unlistenFn) => unlistenFn());
      unlisten_get_balance.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
