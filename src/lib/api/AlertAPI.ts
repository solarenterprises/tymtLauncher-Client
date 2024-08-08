import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs/index";
import { IReqReadMultipleAlerts } from "../../types/AlertAPITypes";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";

class AlertAPI {
  static async readMultipleAlerts(body: IReqReadMultipleAlerts): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(`${tymt_backend_url}/alerts/read-multiple-alerts`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default AlertAPI;
