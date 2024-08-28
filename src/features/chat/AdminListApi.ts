import UserAPI from "../../lib/api/UserAPI";

export const fetchAdminList = async (body: string[]) => {
  try {
    const res = await UserAPI.getUsersByRoles(body);
    if (!res || res.status !== 200 || !res?.data?.result) {
      console.error("Failed to fetchAdminList: response undefined!", res);
      return null;
    }
    return {
      admins: res.data.result,
    };
  } catch (err) {
    console.error("Failed to fetchAdminList: ", err);
    return null;
  }
};
