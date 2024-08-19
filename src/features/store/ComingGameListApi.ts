import { emit } from "@tauri-apps/api/event";
import GameAPI from "../../lib/api/GameAPI";
import { INotificationParams } from "../../types/NotificationTypes";
import { TauriEventNames } from "../../consts/TauriEventNames";
import { isArray } from "lodash";

export const fetchComingGameList = async () => {
  try {
    const res = await GameAPI.fetchComingGameList();
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
