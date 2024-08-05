import UserAPI from "../../lib/api/UserAPI";

export const fetchMyInfo = async (userId: string) => {
  try {
    console.log("fethMyInfo");

    const res = await UserAPI.getUserById(userId);
    if (!res || res.status !== 200 || !res.data?.result?.data) {
      console.error("Failed to fetchMyInfo: response error!", res);
      return null;
    }

    return res.data.result.data;
  } catch (err) {
    console.error("Failed to fetchMyInfo: ", err);
    return null;
  }
};
