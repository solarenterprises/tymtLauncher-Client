import { tymt_backend_url } from "../../configs";
import Axios from "../../lib/Aixo";
import axios from "axios";
import { accountType } from "../../types/accountTypes";

export const fileUpload = async (formdata, accessToken) => {
  return await axios.post(`${tymt_backend_url}/users/upload`, formdata, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (data: accountType) => {
  return Axios.put(`${tymt_backend_url}/user/` + data.uid, data);
};

export const updateUserNickname = async (uid, nickName, accessToken) => {
  return await axios.put(
    `${tymt_backend_url}/users/${uid}`,
    { nickName: nickName },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
