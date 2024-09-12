import { useState, useEffect } from "react";

import { Box, Skeleton } from "@mui/material";

import ChatroomAPI from "../../lib/api/ChatroomAPI";

import Mask from "../../assets/account/mask.png";
import AccountIcon from "../../assets/wallet/account.svg";

export interface IPropsGroupImage {
  groupId: string;
  size: number;
}

const GroupImage = ({ groupId, size }: IPropsGroupImage) => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGroupImage = async () => {
    try {
      setLoading(true);
      const data = await ChatroomAPI.fetchChatroomAvatar(groupId);
      const imageUrl = URL.createObjectURL(data?.data);
      console.log("imageUrl", imageUrl);
      setAvatar(imageUrl);
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetchGroupImage: ", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupImage();
  }, [groupId]);

  return (
    <>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
          display: "inline-block",
          border: "transparent",
        }}
      >
        {loading && <Skeleton variant="circular" width={`${size}px`} height={`${size}px`} />}
        {!loading && (
          <Box
            component={"img"}
            key={`${groupId}-chatroom-image`}
            src={avatar}
            loading="lazy"
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
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = AccountIcon;
            }}
          />
        )}
      </div>
    </>
  );
};

export default GroupImage;
