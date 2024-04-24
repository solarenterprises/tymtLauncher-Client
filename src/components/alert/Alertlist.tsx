import { Stack, Box, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { propsAlertListType } from "../../types/alertTypes";
import failedIcon from "../../assets/alert/failed-icon.svg";
import successIcon from "../../assets/alert/success-icon.svg";
import warnnigIcon from "../../assets/alert/warnning-icon.svg";
import alertIcon from "../../assets/alert/alert-icon.png";
import messageIcon from "../../assets/alert/message-icon.svg";
import unreaddot from "../../assets/alert/unreaddot.svg";
import readdot from "../../assets/alert/readdot.svg";

import Avatar from "../home/Avatar";

import { getUserlist } from "../../features/chat/Chat-userlistSlice";
import { userType } from "../../types/chatTypes";
import {
  getFriendlist,
  setFriendlist,
} from "../../features/chat/Chat-friendlistSlice";

const socket: Socket = io(socket_backend_url as string);
import { socket_backend_url } from "../../configs";
import { io, Socket } from "socket.io-client";

const AlertList = ({ status, title, detail, read }: propsAlertListType) => {
  const dispatch = useDispatch();
  const [logo, setLogo] = useState<any>();
  const chatuserlist: userType[] = useSelector(getUserlist);
  const friendlist: userType[] = useSelector(getFriendlist);
  const senderUser = chatuserlist.find(
    (user) => user._id === detail.note?.sender
  );
  const addFriend = async () => {
    const senderId = title === "Friend Request" ? detail.note?.sender : null;
    const senderInChatUserlist = chatuserlist.find(
      (user) => user._id === senderId
    );
    const senderInChatFriendlist = friendlist.find(
      (user) => user._id === senderId
    );
    console.log("friendlist", friendlist);
    console.log("request sender", senderInChatUserlist);
    console.log("chatuserlist", chatuserlist);
    const updatedFriendlist: userType[] = [...friendlist, senderInChatUserlist];
    if (!senderInChatFriendlist) dispatch(setFriendlist(updatedFriendlist));
  };

  const approveFR = () => {
    const data = {
      id: detail._id,
      updateFields: {
        status: "accepted",
        receivers: detail.receivers,
      },
    };
    console.log("approving data", data);
    socket.emit("update-alert", JSON.stringify(data));
  };
  const declineFR = () => {
    const data = {
      id: detail._id,
      updateFields: {
        status: "rejected",
        receivers: detail.receivers,
      },
    };
    console.log("rejecting data", data);
    socket.emit("update-alert", JSON.stringify(data));
  };

  useEffect(() => {
    if (status == "failed") {
      setLogo(failedIcon);
    }
    if (status == "success") {
      setLogo(successIcon);
    }
    if (status == "warning") {
      setLogo(warnnigIcon);
    }
    if (status == "alert") {
      setLogo(alertIcon);
    }
    if (status == "message") {
      setLogo(messageIcon);
    }
  }, [status]);

  useEffect(() => {
    console.log("title", title);
  }, []);

  return (
    <>
      <Box sx={{ width: "100%" }} marginTop={"16px"}>
        <Stack direction={"column"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
              <img src={logo} />
              <Box className={"fs-h4 white"}>{title}</Box>
            </Stack>
            {read === "unread" && (
              <img src={unreaddot} width={"12px"} height={"12px"} />
            )}
            {read === "read" && (
              <img src={readdot} width={"12px"} height={"12px"} />
            )}
          </Stack>
          <Box className={"fs-16-regular white"} marginTop={"12px"}>
            {title !== "Friend Request" &&
              (detail.length > 100 ? detail.substring(0, 100) + "..." : detail)}
            {title === "Friend Request" &&
              "Don't miss out on the fun - add to your friends now!"}
          </Box>
          {title === "Friend Request" && (
            <>
              <Stack
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
                marginTop={"12px"}
              >
                <Stack direction={"row"} alignItems={"center"} gap={"7px"}>
                  <Avatar
                    onlineStatus={senderUser?.onlineStatus}
                    userid={senderUser?._id}
                    size={40}
                  />
                  <Box className={"fs-18-regular white"}>
                    {senderUser?.nickName}
                  </Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                  <Button
                    className="modal_btn_right"
                    onClick={() => {
                      addFriend();
                      approveFR();
                    }}
                  >
                    <Box className={"fs-18-bold white"}>Add</Box>
                  </Button>
                  <Button
                    className="modal_btn_left_fr"
                    onClick={() => {
                      declineFR();
                    }}
                  >
                    <Box
                      className={"fs-18-bold"}
                      color={"var(--Main-Blue, #52E1F2)"}
                    >
                      Decline
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
          <Divider
            sx={{
              backgroundColor: "#FFFFFF1A",
              marginTop: "10px",
            }}
          />
        </Stack>
      </Box>
    </>
  );
};
export default AlertList;
