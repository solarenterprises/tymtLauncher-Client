import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ICurrency } from "../../types/walletTypes";
import { supportCurrency } from "../../consts/SupportCurrency";

interface ICurrencyRes {
  _id: string;
  currency_id: string;
  rate: Number;
}

export const fetchCurrencyList = async () => {
  try {
    console.log("fetchCurrencyList");

    const res = await axios.get(`${tymt_backend_url}/currencies`);

    const data: ICurrency[] = supportCurrency?.map((one) => {
      const item: ICurrency = {
        name: one?.name,
        reserve: res?.data?.result?.data?.find((element: ICurrencyRes) => element?.currency_id === one?.name)?.rate,
      };
      return item;
    });

    return data;
  } catch (err) {
    console.log("Failed to fetchCurrencyList: ", err);
  }
};
