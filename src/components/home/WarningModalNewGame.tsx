import { useTranslation } from "react-i18next";

import { Box, Stack, Modal, Fade } from "@mui/material";

import { runNewGame } from "../../lib/helper/DownloadHelper";

import { IGame } from "../../types/GameTypes";

import closeIcon from "../../assets/settings/x-icon.svg";
import logo from "../../assets/main/foxhead-comingsoon.png";
import { emit } from "@tauri-apps/api/event";
import { TauriEventNames } from "../../consts/TauriEventNames";
import { INotificationParams } from "../../types/NotificationTypes";

export interface IPropsWarningModalNewGame {
  open: boolean;
  setOpen: (status: boolean) => void;
  game: IGame;
}

const WarningModalNewGame = ({ open, setOpen, game }: IPropsWarningModalNewGame) => {
  const { t } = useTranslation();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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
        <Fade in={open}>
          <Box className="modal-content oauth-modal">
            <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
              <Box className="center-align">
                <img width={200} src={logo} />
              </Box>
              <Box className="fs-h3 white">{t("ga-29_not-related-solar")}</Box>
              <Box
                onClick={async () => {
                  //   setOpen(false);
                  const res = await runNewGame(game);
                  if (res) {
                    setOpen(false);
                    return;
                  }

                  const noti: INotificationParams = {
                    status: "failed",
                    title: t("alt-9_run-failed"),
                    message: t("alt-10_run-failed-intro"),
                    link: null,
                    translate: false,
                  };
                  emit(TauriEventNames.NOTIFICATION, noti);
                }}
                className="action-btn fs-18-light blue center-align"
                sx={{ minWidth: "100%" }}
              >
                {t("hom-7_play-game")}
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default WarningModalNewGame;
