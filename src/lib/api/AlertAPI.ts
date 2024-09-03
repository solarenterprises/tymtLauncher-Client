import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs/index";
import { IReqReadAllUnreadAlertsForChatroom, IReqReadMultipleAlerts, IReqUnreadAlertsCountForChatroom } from "../../types/AlertAPITypes";
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

  static async readAllUnreadAlertsForChatroom({ userId, roomId }: IReqReadAllUnreadAlertsForChatroom): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(
      `${tymt_backend_url}/alerts/read-all-unread-alerts/${userId}?roomId=${roomId}`,
      {},
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async unreadAlertsCountForChatroom({ userId, roomId }: IReqUnreadAlertsCountForChatroom): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/alerts/unread-alerts-count/${userId}?roomId=${roomId}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default AlertAPI;
