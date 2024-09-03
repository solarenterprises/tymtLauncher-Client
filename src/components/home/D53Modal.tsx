import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { fetch as tauriFetch, ResponseType } from "@tauri-apps/api/http";

import { production_version } from "../../configs";

import { Box, Stack, Modal, Button, Fade } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";

import InputText from "../account/InputText";

import closeIcon from "../../assets/settings/x-icon.svg";
import { runD53 } from "../../lib/helper/DownloadHelper";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

interface IServer {
  display_name: string;
  name: string;
  ip: string;
  visible: boolean;
  status: string;
  clients: number;
  clients_max: number;
}

const D53Modal = ({ open, setOpen }: props) => {
  const { t } = useTranslation();
  const [serverList, setServerList] = useState<IServer[]>([]);
  const [serverIp, setServerIp] = useState<string>("");

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handlePlayClick = async (autoMode: boolean) => {
    if (!serverIp) {
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-36_server-required"));
      setNotificationDetail(t("alt-37_please-fill-server"));
      setNotificationOpen(true);
      setNotificationLink(null);
    } else {
      const selectedServer = serverList?.find((server) => server.ip === serverIp);
      if (!selectedServer) {
        // await runGame("district53", serverIp, autoMode);
      } else {
        if (selectedServer?.clients >= selectedServer?.clients_max) {
          setNotificationStatus("failed");
          setNotificationTitle(t("alt-9_run-failed"));
          setNotificationDetail(t("alt-38_sorry-server-full"));
          setNotificationOpen(true);
          setNotificationLink(null);
        } else {
          const res = await runD53(serverIp, autoMode);
          if (!res) {
            setNotificationStatus("failed");
            setNotificationTitle(t("alt-9_run-failed"));
            setNotificationDetail(t("alt-10_run-failed-intro"));
            setNotificationOpen(true);
            setNotificationLink(null);
          }
        }
      }
    }
    setOpen(false);
  };

  function validateIPv4Address(value: string): boolean {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    return !pattern.test(value) || value === "";
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (open) {
      const init = async () => {
        const apiURL = production_version === "prod" ? `https://serverlist.district53.io/` : `http://dev.game.district53.io:5000/`;
        const res: any = await tauriFetch(apiURL, {
          method: "GET",
          timeout: 30,
          responseType: ResponseType.JSON,
        });
        setServerList(res.data);
        setServerIp(res.data[0].ip);
      };

      init();
      intervalId = setInterval(init, 30 * 1e3);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [open]);

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <Fade in={open}>
        <Box className="d53-modal-content oauth-modal">
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
            <InputText id="server" label={"server"} type="text" name="server" value={serverIp} setValue={setServerIp} error={validateIPv4Address(serverIp)} />
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
                    textTransform: "none",
                    border: "1px solid #FFFFFF33",
                    borderRadius: "0px",
                    marginTop: "-1px",
                    filter: server.status !== "online" ? "grayscale(100%)" : null,
                  }}
                  disabled={server.status !== "online"}
                >
                  <Stack direction={"row"} width={"100%"} gap={"4px"} alignItems={"center"}>
                    <Box className={server.clients < server.clients_max ? "fs-16-regular white" : "fs-16-regular red"}>{`${server.display_name}`}</Box>
                    <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                      <Box className={"fs-12-regular"} color={server.clients < server.clients_max ? "#52E1F2" : "#EF4444"}>{`(${server.clients ?? "0"}/${
                        server.clients_max ?? "0"
                      }`}</Box>
                      <Stack direction={"row"} alignItems={"center"}>
                        <Box className={"fs-10-light"} color={server.clients < server.clients_max ? "#52E1F2" : "#EF4444"}>{`Joined`}</Box>
                        <Box className={"fs-12-regular"} color={server.clients < server.clients_max ? "#52E1F2" : "#EF4444"}>{`)`}</Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Button>
              ) : (
                <></>
              )
            )}
            <Button
              fullWidth
              onClick={() => handlePlayClick(true)}
              className="red-border-button"
              sx={{
                mt: "16px",
              }}
            >
              <Box className={"fs-16-regular"}>{t("hom-27_play-now")}</Box>
            </Button>
            <Button
              fullWidth
              onClick={() => handlePlayClick(false)}
              className="red-button"
              sx={{
                mt: "8px",
              }}
            >
              <Box className={"fs-16-regular white"}>{t("hom-28_advanced-settings")}</Box>
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default D53Modal;
