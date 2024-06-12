import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";
import { INonCustodyBeforeSignInReq, INonCustodySignUpReq } from "../../types/AuthAPITypes";

class AuthAPI {
  static async nonCustodySignup(body: INonCustodySignUpReq): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/auth/non-custody/signup`, body);
  }

  static async getUserBySolarAddress(sxpAddress: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/users?sxp=${sxpAddress}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async nonCustodySignin(body: any): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/auth/non-custody/signin`, body);
  }

  static async nonCustodyBeforeSignin(body: INonCustodyBeforeSignInReq): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/auth/non-custody/before-signin`, body);
  }
}

export default AuthAPI;
