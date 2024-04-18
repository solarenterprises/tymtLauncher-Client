import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";

class PriceAPI {
  static async getTokenPrices(
    accessToken: string
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await axios.get(`${tymt_backend_url}/token-prices`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return result.data.result.data;
    } catch (err) {
      console.log(err);
    }
  }

  static async getTokenPrice(
    accessToken: string,
    cmc: string
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await axios.get(
        `${tymt_backend_url}/token-prices/latest-token-price-by-cmc/${cmc}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
