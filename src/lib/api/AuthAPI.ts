import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";
import { INonCustodyBeforeSignInReq } from "../../types/AuthAPITypes";

class AuthAPI {
  static async nonCustodySignup(
    body: any,
    url: string
  ): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}${url}`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static async getUserBySolarAddress(
    sxpAddress: string
  ): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/users?sxp=${sxpAddress}`);
  }

  static async nonCustodySignin(body: any): Promise<AxiosResponse<any, any>> {
    return await axios.post(
      `${tymt_backend_url}/auth/non-custody/signin`,
      body
    );
  }

  static async nonCustodyBeforeSignin(
    body: INonCustodyBeforeSignInReq
  ): Promise<AxiosResponse<any, any>> {
    return await axios.post(
      `${tymt_backend_url}/auth/non-custody/before-signin`,
      body
    );
  }
}

export default AuthAPI;
