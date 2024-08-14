import { emit } from "@tauri-apps/api/event";
import UserAPI from "../../lib/api/UserAPI";

export const fetchAdminList = async () => {
  try {
    const res = await UserAPI.getUsersByRoles();
    if (!res || !res?.data) {
      console.error("Failed to fetchAdminList: response undefined!", res);
      return null;
    }

    console.log("fetchAdminList", res);
    return null;
  } catch (err) {
    console.error("Failed to fetchAdminList: ", err);
    emit("error", { message: err.toString() });
    return null;
  }
};
