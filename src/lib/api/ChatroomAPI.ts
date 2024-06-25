import axios, { AxiosResponse } from "axios";

import { tymt_backend_url } from "../../configs/index";
import { IChatroomAddParticipant, IChatroomCreateGroupReq } from "../../types/ChatroomAPITypes";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";

class ChatroomAPI {
  static saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));

  static async createGroup(body: IChatroomCreateGroupReq): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/chatroom/create-chatroom`, body, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async addParticipant(body: IChatroomAddParticipant): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/chatroom/add-participant`, body, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default ChatroomAPI;
