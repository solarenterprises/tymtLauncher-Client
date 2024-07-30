import axios from "axios";

import { tymt_backend_url } from "../../configs";

import tymtStorage from "../Storage";

import { ISaltToken } from "../../types/accountTypes";

class MessageAPI {
  static async fileUpload(body: FormData) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/messages/file-upload`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default MessageAPI;
