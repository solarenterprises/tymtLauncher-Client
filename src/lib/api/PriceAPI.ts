import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";
import { isArray } from "lodash";

export interface ITokenPriceRes {
  _id: string;
  chainId: number;
  chainName: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  price: number;
  timestamp: string;
  cmc: string;
}

class PriceAPI {
  static async getAllTokenPrices(): Promise<ITokenPriceRes[]> {
    try {
      const result = await axios.get(`${tymt_backend_url}/token-prices/latest-token-prices-cmc`);
      if (!result?.data?.result?.data && !isArray(result?.data?.result?.data)) {
        console.error("getAllTokenPrices: response undefined or not an array");
        return [] as ITokenPriceRes[];
      }
      return result?.data?.result?.data as ITokenPriceRes[];
    } catch (err) {
      console.error("Failed to getAllTokenPrices: ", err);
    }
  }

  static async getTokenPrices(): Promise<AxiosResponse<any, any>> {
    try {
      const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
      const result = await axios.get(`${tymt_backend_url}/token-prices`, {
        headers: {
          "x-token": saltTokenStore.token,
        },
      });
      return result.data.result.data;
    } catch (err) {
      console.log(err);
    }
  }

  static async getTokenPrice(cmc: string): Promise<AxiosResponse<any, any>> {
    try {
      const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
      const result = await axios.get(`${tymt_backend_url}/token-prices/latest-token-price-by-cmc/${cmc}`, {
        headers: {
          "x-token": saltTokenStore.token,
        },
      });
      return result.data.result.data[0].price;
    } catch (err) {
      console.log(err);
    }
  }
}

export default PriceAPI;
