import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs/index";
import { IReqChatroomAddParticipant, IReqChatroomCreateChatroom, IReqChatroomLeaveChatroom } from "../../types/ChatroomAPITypes";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";

class ChatroomAPI {
  static saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));

  static async createChatroom(body: IReqChatroomCreateChatroom): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/chatroom/create-chatroom`, body, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async addParticipant(body: IReqChatroomAddParticipant): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${tymt_backend_url}/chatroom/add-participant`, body, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAllChatroomsCreatedBy(_id: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/all-chatrooms-created-by/${_id}`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAllChatroomsFor(_id: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/all-chatrooms-for/${_id}`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAllChatrooms(): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/all-chatroom`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchChatroom(_id: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/${_id}`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteChatroom(_id: string): Promise<AxiosResponse<any, any>> {
    return await axios.put(`${tymt_backend_url}/chatroom/delete-chat-room/${_id}`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async leaveChatroom(body: IReqChatroomLeaveChatroom): Promise<AxiosResponse<any, any>> {
    return await axios.put(`${tymt_backend_url}/chatroom/leave-chat-room`, body, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async searchPublicChatrooms(name: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/public-chatrooms/${name}`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchCurrentChatroomMembers(_chatroomId: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/get-room-members/${_chatroomId}`, {
      headers: {
        "x-token": this.saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default ChatroomAPI;
