import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs";

class GameAPI {
  static async fetchGameList(page: number): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/store?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchComingGameList(page: number): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/store/by-visibility-state/coming%20soon?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default GameAPI;
