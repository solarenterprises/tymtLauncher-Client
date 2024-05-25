import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";
import { ISaltToken } from "../../types/accountTypes";

class PriceAPI {
  static async getTokenPrices(): Promise<AxiosResponse<any, any>> {
    try {
      const saltTokenStore: ISaltToken = JSON.parse(
        sessionStorage.getItem(`saltToken`)
      );
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
      const saltTokenStore: ISaltToken = JSON.parse(
        sessionStorage.getItem(`saltToken`)
      );
      const result = await axios.get(
        `${tymt_backend_url}/token-prices/latest-token-price-by-cmc/${cmc}`,
        {
          headers: {
            "x-token": saltTokenStore.token,
          },
        }
      );
      return result.data.result.data[0].price;
    } catch (err) {
      console.log(err);
    }
  }
}

export default PriceAPI;
