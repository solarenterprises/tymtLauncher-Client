import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs/index";
import {
  IReqChatroomAddParticipant,
  IReqChatroomCreateChatroom,
  IReqChatroomExportMessageHistory,
  IReqChatroomLeaveChatroom,
  IReqChatroomUpdateGroupName,
} from "../../types/ChatroomAPITypes";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";

class ChatroomAPI {
  static async createChatroom(body: IReqChatroomCreateChatroom): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/chatroom/create-chatroom`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async addParticipant(body: IReqChatroomAddParticipant): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/chatroom/add-participant`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAllChatroomsCreatedBy(_id: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/all-chatrooms-created-by/${_id}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAllChatroomsFor(_id: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/all-chatrooms-for/${_id}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAllChatrooms(): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/all-chatroom`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchChatroom(_id: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/${_id}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteChatroom(_id: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(`${tymt_backend_url}/chatroom/delete-chat-room/${_id}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async leaveChatroom(body: IReqChatroomLeaveChatroom): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(`${tymt_backend_url}/chatroom/leave-chat-room`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async searchPublicChatrooms(name: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/public-chatrooms/${name}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchCurrentChatroomMembers(_chatroomId: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/get-active-room-members/${_chatroomId}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchHistoricalChatroomMembers(_chatroomId: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/get-historical-room-members/${_chatroomId}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async uploadChatroomAvatar(formData: FormData): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/chatroom/update-room-image`, formData, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async fetchChatroomAvatar(room_id: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/chatroom/get-room-image/${room_id}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async updateChatroomName(body: IReqChatroomUpdateGroupName): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(`${tymt_backend_url}/chatroom/update-room-name`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async exportMessageHistory(body: IReqChatroomExportMessageHistory): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/messages/export-message-history`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async exportMessageHistoryStream(body: IReqChatroomExportMessageHistory): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(
      `${tymt_backend_url}/messages/export-message-history/stream?userId=${body.userId}&chatroomId=${body.chatroomId}&fromDate=${body.fromDate}&toDate=${body.toDate}`,
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async removeChatroom(chatroom_id: string): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(
      `${tymt_backend_url}/chatroom/delete-chat-room/${chatroom_id}`,
      {},
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async fetchGlobalChatrooms(): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/chatroom/global-chatrooms`);
  }
}

export default ChatroomAPI;
