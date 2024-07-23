import UserAPI from "../../lib/api/UserAPI";
import { IReqCreateMutedList, IReqDeleteMutedList } from "../../types/UserAPITypes";

export const fetchMutedList = async () => {
  try {
    const res = await UserAPI.fetchMutedList();
    if (res?.status !== 200 || !res?.data || !res?.data?.muted_rooms) {
      console.error("Failed to fetchMutedList: ", res);
      return null;
    }
    console.log("fetchMutedList", res);
    return res.data.muted_rooms;
  } catch (err) {
    console.error("Failed to fetchMutedList: ", err);
    return null;
  }
};

export const createMutedList = async (body: IReqCreateMutedList) => {
  try {
    const res = await UserAPI.createMutedList(body);
    if (res?.status !== 200 || !res?.data || !res?.data?.muted_rooms) {
      console.error("Failed to createMutedList: ", res);
      return null;
    }
    console.log("createMutedList", res);
    return res.data.muted_rooms;
  } catch (err) {
    console.error("Failed to createMutedList: ", err);
    return null;
  }
};

export const deleteMutedList = async (body: IReqDeleteMutedList) => {
  try {
    const res = await UserAPI.deleteMutedList(body);
    if (res?.status !== 200 || !res?.data || !res?.data?.muted_rooms) {
      console.error("Failed to deleteMutedList: ", res);
      return null;
    }
    console.log("deleteMutedList", res);
    return res.data.muted_rooms;
  } catch (err) {
    console.error("Failed to deleteMutedList: ", err);
    return null;
  }
};
