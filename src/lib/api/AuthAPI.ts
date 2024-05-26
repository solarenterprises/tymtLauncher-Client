import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";
import { INonCustodyBeforeSignInReq } from "../../types/AuthAPITypes";
import { ISaltToken } from "../../types/accountTypes";

class AuthAPI {
  static async nonCustodySignup(
    body: any,
    url: string
  ): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(
      sessionStorage.getItem(`saltToken`)
    );
    return await axios.post(`${tymt_backend_url}${url}`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static async getUserBySolarAddress(
    sxpAddress: string
  ): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/users?sxp=${sxpAddress}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
