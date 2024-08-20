import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs";

class GameAPI {
  static async fetchGameList(): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/store`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchComingGameList(): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/store/by-visibility-state/coming%20soon`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default GameAPI;
