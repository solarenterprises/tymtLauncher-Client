import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export const fetchBlockList = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/block/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200 && res?.data?.blocks) {
      console.log("fetchBlockList");
      return {
        contacts: res?.data?.blocks,
      };
    } else {
      console.log("fetchBlockList: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to fetchBlockList: ", err);
    return null;
  }
};

export const createBlock = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const block = {
      block: _id,
    };
    const res = await axios.post(`${tymt_backend_url}/users/block`, block, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200 && res?.data?.blocks) {
      console.log("createBlock");
      return {
        contacts: res?.data?.blocks,
      };
    } else {
      console.log("createBlock: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to createBlock: ", err);
    return null;
  }
};

export const deleteBlock = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.delete(`${tymt_backend_url}/users/block`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
      data: {
        block: _id,
      },
    });
    if (res?.status === 200 && res?.data?.blocks) {
      console.log("deleteBlock");
      return {
        contacts: res?.data?.blocks,
      };
    } else {
      console.log("deleteBlock: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to deleteBlock: ", err);
    return null;
  }
};
