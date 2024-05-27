import { tymt_backend_url } from "../../configs";
import Axios from "../../lib/Aixo";
import axios from "axios";
import { ISaltToken, accountType } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export const fileUpload = async (formdata) => {
  const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
  return await axios.post(`${tymt_backend_url}/users/upload`, formdata, {
    headers: {
      "x-token": saltTokenStore.token,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (data: accountType) => {
  const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
  return Axios.put(`${tymt_backend_url}/user/` + data.uid, data, {
    headers: {
      "x-token": saltTokenStore.token,
    },
  });
};

export const updateUserNickname = async (uid, nickName) => {
  const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
  return await axios.put(
    `${tymt_backend_url}/users/${uid}`,
    { nickName: nickName },
    {
      headers: {
        "x-token": saltTokenStore.token,
      },
    }
  );
};
