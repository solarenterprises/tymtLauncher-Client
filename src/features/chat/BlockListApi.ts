import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export const fetchBlockList = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/friend/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchBlockList");
      return {
        contacts: res?.data?.friends,
      };
    } else {
      console.log("fetchBlockList: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to fetchBlockList: ", err);
    return {
      contacts: [],
    };
  }
};

export const createBlock = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const friend = {
      friend: _id,
    };
    const res = await axios.post(`${tymt_backend_url}/users/friend`, friend, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("createBlock");
      if (res?.data?.contacts) {
        return {
          contacts: res?.data?.friends,
        };
      }
      return null;
    } else {
      console.log("createBlock: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to createBlock: ", err);
    return {
      contacts: [],
    };
  }
};

export const deleteBlock = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.delete(`${tymt_backend_url}/users/friend`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
      data: {
        friend: _id,
      },
    });
    if (res?.status === 200) {
      console.log("deleteBlock");
      return {
        contacts: res?.data?.friends,
      };
    } else {
      console.log("deleteBlock: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to deleteBlock: ", err);
    return {
      contacts: [],
    };
  }
};
