import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

import { coingecko_api_url, coingecko_api_key } from "../../configs/index";

class CoingeckoAPI {
  static async getData(query: any, url: string): Promise<AxiosResponse<any, any>> {
    const config: AxiosRequestConfig = {
      params: query,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-cg-pro-api-key": coingecko_api_key,
      },
    };
    return await (
      await axios.get(`${coingecko_api_url}/${url}`, config)
    ).data;
  }
}

export default CoingeckoAPI;
