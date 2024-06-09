import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export const fetchFriendList = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/friend/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchFriendList");
      return {
        contacts: res?.data?.friends,
      };
    } else {
      console.log("fetchFriendList res.status: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to fetchFriendList: ", err);
    return {
      contacts: [],
    };
  }
};

export const createFriend = async (_id: string) => {
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
      console.log("createFriend");
      if (res?.data?.friends) {
        return {
          contacts: res?.data?.friends,
        };
      }
      return null;
    } else {
      console.log("createFriend: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to createFriend: ", err);
    return {
      contacts: [],
    };
  }
};

export const deleteFriend = async (_id: string) => {
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
      console.log("deleteFriend");
      return {
        contacts: res?.data?.friends,
      };
    } else {
      console.log("deleteFriend: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to deleteFriend: ", err);
    return {
      contacts: [],
    };
  }
};
