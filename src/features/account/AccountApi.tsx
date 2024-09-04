import { tymt_backend_url } from "../../configs";
import Axios from "../../lib/Aixo";
import axios from "axios";
import { IAccount, IAccountList, ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";
import { IMyInfo } from "../../types/chatTypes";
import AuthAPI from "../../lib/api/AuthAPI";

export const fileUpload = async (formdata) => {
  const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
  return await axios.post(`${tymt_backend_url}/users/upload`, formdata, {
    headers: {
      "x-token": saltTokenStore.token,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (data: IMyInfo) => {
  const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
  return Axios.put(`${tymt_backend_url}/user/` + data._id, data, {
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

export const fetchAccountAvatar = async (account: IAccount) => {
  try {
    const sxpAddress = account?.sxpAddress;
    console.log("fetchAccountAvatar: ", sxpAddress);

    const data = await AuthAPI.getUserBySolarAddress(sxpAddress);
    if (!data) {
      console.log("Failed to fetchAccountAvatar: user undefined!", data);
      return;
    }

    const newAvatar = data?.data?.users[0]?.avatar;
    const newAccount: IAccount = {
      ...account,
      avatar: newAvatar ?? "",
    };

    return newAccount;
  } catch (err) {
    console.log("Failed to fetchAccountAvatar: ", err);
  }
};

export const fetchAccountListAvatar = async (accountList: IAccountList) => {
  try {
    let newAccountList: IAccount[] = [];
    for (const account of accountList?.list) {
      const res = await fetchAccountAvatar(account);
      newAccountList.push(res);
    }
    return newAccountList;
  } catch (err) {
    console.log("Failed to fetchAccountListAvatar: ", err);
    return [];
  }
};
