import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

import { solar_api_url } from "../../configs/index";
class SolarAPI {
  static async addTxToQueue(
    body: any,
    url: string
  ): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${url}/transactions`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  static async getData(
    query: any,
    url: string
  ): Promise<AxiosResponse<any, any>> {
    const config: AxiosRequestConfig = {
      params: query,
    };
    return await axios.get(`${solar_api_url}/${url}`, config);
  }
}

export default SolarAPI;
