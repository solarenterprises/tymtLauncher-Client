import axios from "axios";
import { tymt_backend_url } from "../../configs";

interface ICurrencyRes {
  _id: string;
  currency_id: string;
  rate: Number;
}

export const refreshCurrency = async () => {
  try {
    const res = await axios.get(`${tymt_backend_url}/currencies`);
    console.log("refreshCurrency");
    return {
      USD: 1.0,
      EUR: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "EUR").rate,
      JPY: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "JPY").rate,
      GBP: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "GBP").rate,
      CNY: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "CNY").rate,
      AMD: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "AMD").rate,
      RUB: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "RUB").rate,
      PLN: res.data.result.data.find((element: ICurrencyRes) => element.currency_id === "PLN").rate,
    };
  } catch (err) {
    console.error("Failed to refreshCurrency: ", err);
    return {};
  }
};
