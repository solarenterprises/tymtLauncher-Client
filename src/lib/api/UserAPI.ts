import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs/index";

class UserAPI {
  static async getUserById(id: string): Promise<AxiosResponse<any, any>> {
    return await axios.get(`${tymt_backend_url}/users/${id}`);
  }
}

export default UserAPI;
