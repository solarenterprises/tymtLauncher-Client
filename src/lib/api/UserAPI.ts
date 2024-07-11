import axios from "axios";
import { tymt_backend_url } from "../../configs/index";
import tymtStorage from "../Storage";
import { IReqCreateMutedList, IReqDeleteMutedList } from "../../types/UserAPITypes";
import { ISaltToken } from "../../types/accountTypes";

class UserAPI {
  static async getUserById(id: string) {
    return await axios.get(`${tymt_backend_url}/users/${id}`);
  }

  static async createMutedList(body: IReqCreateMutedList) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/users/muted`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteMutedList(body: IReqDeleteMutedList) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.delete(`${tymt_backend_url}/users/muted`, {
      data: body,
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchMutedList() {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/users/muted/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default UserAPI;
