import { useEffect, useState } from "react";
import axios from "axios";

import { Box, Stack, Modal, Button } from "@mui/material";

import closeIcon from "../../assets/settings/x-icon.svg";

import { runGame } from "../../lib/api/Downloads";
import { useTranslation } from "react-i18next";
import InputText from "../account/InputText";

import { useNotification } from "../../providers/NotificationProvider";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

interface IServer {
  display_name: string;
  name: string;
  ip: string;
  visible: boolean;
}

const D53Modal = ({ open, setOpen }: props) => {
  const { t } = useTranslation();
  const [serverList, setServerList] = useState<IServer[]>([]);
  const [serverIp, setServerIp] = useState<string>("");

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handlePlayClick = async () => {
    if (serverIp === "") {
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-36_server-required"));
      setNotificationDetail(t("alt-37_please-fill-server"));
      setNotificationOpen(true);
      setNotificationLink(null);
    } else {
      const res = await runGame("district53", serverIp);
      if (!res) {
        setNotificationStatus("failed");
        setNotificationTitle(t("alt-9_run-failed"));
        setNotificationDetail(t("alt-10_run-failed-intro"));
        setNotificationOpen(true);
        setNotificationLink(null);
      }
    }
    setOpen(false);
  };

  function validateIPv4Address(value: string): boolean {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    return !pattern.test(value) || value === "";
  }

  useEffect(() => {
    const init = async () => {
      const res = await axios.get(
        `https://raw.githubusercontent.com/district53/announced_servers/main/list`
      );
      setServerList(res.data);
      setServerIp(res.data[0].ip);
    };
    init();
  }, []);

  return (
    <>
      <Modal
        open={open}
        style={modalStyle}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        <Box className="modal-content oauth-modal">
          <img
            src={closeIcon}
            alt="close icon"
            className="close-icon"
            onClick={() => setOpen(false)}
          />
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <InputText
              id="server"
              label={"server"}
              type="text"
              name="server"
              value={serverIp}
              setValue={setServerIp}
              error={validateIPv4Address(serverIp)}
            />
            {validateIPv4Address(serverIp) && (
              <Box
                className={"fs-16-regular red t-left"}
                mb={"16px"}
                sx={{
                  width: "100%",
                }}
              >
                {"Invalid IP address format"}
              </Box>
            )}
            {serverList.map((server) =>
              server.visible ? (
                <Button
                  fullWidth
                  onClick={() => setServerIp(server.ip)}
                  sx={{
                    border: "1px solid #FFFFFF33",
                    borderRadius: "0px",
                    marginTop: "-1px",
                  }}
                >
                  <Box
                    className={"fs-16-regular white"}
                  >{`${server.display_name}`}</Box>
                </Button>
              ) : (
                <></>
              )
            )}
            <Button
              fullWidth
              onClick={handlePlayClick}
              className="red-button"
              sx={{
                mt: "8px",
              }}
            >
              <Box className={"fs-16-regular white"}>
                {t("hom-7_play-game")}
              </Box>
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default D53Modal;
