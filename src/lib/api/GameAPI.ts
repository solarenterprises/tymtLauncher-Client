import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs";

class GameAPI {
  static async fetchGameList(): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/store`);
  }
}

export default GameAPI;
