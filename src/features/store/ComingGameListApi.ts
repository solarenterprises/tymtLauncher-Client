import { emit } from "@tauri-apps/api/event";
import GameAPI from "../../lib/api/GameAPI";
import { INotificationParams } from "../../types/NotificationTypes";
import { TauriEventNames } from "../../consts/TauriEventNames";
import { isArray } from "lodash";
import { IGame } from "../../types/GameTypes";

export const fetchComingGameList = async (page: number) => {
  try {
    const res = await GameAPI.fetchComingGameList(page);
    if (!res?.data?.result?.data || !isArray(res?.data?.result?.data)) {
      console.error("Failed to fetchComingGameList: response error!", res);
      const noti: INotificationParams = {
        status: "failed",
        title: "Error",
        message: "Server response error!",
        link: null,
        translate: true,
      };
      emit(TauriEventNames.NOTIFICATION, noti);
      return null;
    }
    return { games: res.data.result.data };
  } catch (err) {
    console.error("Failed to fetchComingGameList: ", err);
    const noti: INotificationParams = {
      status: "failed",
      title: "Error",
      message: err.toString(),
      link: null,
      translate: true,
    };
    emit(TauriEventNames.NOTIFICATION, noti);
    return null;
  }
};

export const fetchAllComingGameList = async () => {
  try {
    const res1 = await GameAPI.fetchComingGameList(1);
    const totalPage: number = res1?.data?.result?.meta?.pagination?.pageCount;

    const items = Array.from({ length: totalPage });
    const promiseList = items.map((_item, index) => GameAPI.fetchComingGameList(index + 1));
    const dataList = await Promise.all(promiseList);

    let res: IGame[] = [];
    for (const data of dataList) {
      res.push(data?.data?.result?.data);
    }

    return { games: res };
  } catch (err) {
    console.log("Failed to fetchAllGameList: ", err);
    return null;
  }
};
