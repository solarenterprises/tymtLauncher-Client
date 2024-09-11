import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import { getActiveUserList, IActiveUserList } from "../../features/chat/ActiveUserListSlice";

import UserAPI from "../../lib/api/UserAPI";

import OnlineFrame from "../../assets/chat/onlineframe.svg";
import OfflineFrame from "../../assets/chat/offlineframe.svg";
import Mask from "../../assets/account/mask.png";
import AccountIcon from "../../assets/wallet/account.svg";

export interface IPropsUserAvatar {
  userId: string;
  size: number;
}

const UserAvatar = ({ userId, size }: IPropsUserAvatar) => {
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);

  const isOnline: boolean = useMemo(() => activeUserListStore?.users?.some((one) => one === userId), [activeUserListStore]);

  const [avatar, setAvatar] = useState(null);

  const fetchUserAvatar = async () => {
    try {
      const data = await UserAPI.fetchAvatar(userId);
      const imageUrl = URL.createObjectURL(data?.data);
      console.log("imageUrl", imageUrl);
      setAvatar(imageUrl);
    } catch (err) {
      console.log("Failed to fetchUserAvatar: ", err);
    }
  };

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
        display: "inline-block",
        border: "transparent",
      }}
    >
      <Box
        component={"img"}
        src={isOnline ? OnlineFrame : OfflineFrame}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          overflow: "hidden",
        }}
      />
      <Box
        component={"img"}
        src={avatar}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          borderColor: "transparent",
          maskImage: `url(${Mask})`,
          maskPosition: "center",
          maskSize: "cover",
          zIndex: 1,
          opacity: 0.9,
          transition: "all 0.5s",
        }}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = AccountIcon;
        }}
      />
    </div>
  );
};

export default UserAvatar;
