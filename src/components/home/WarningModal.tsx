import { Box, Stack, Modal, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import closeIcon from "../../assets/settings/x-icon.svg";
import logo from "../../assets/main/foxhead-comingsoon.png";

import { useNotification } from "../../providers/NotificationProvider";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

const WarningModal = ({ open, setOpen }: props) => {
  const { t } = useTranslation();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

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
              {/* <Box className="fs-h3 white">{Games[id].warning[lang]}</Box> */}
              <Box
                className="fs-h3 blue"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  // openLink(Games[id].warningLink);
                }}
              >
                Click here
              </Box>
              <Box
                onClick={async () => {
                  setOpen(false);
                  // const isExisting = await runGame(id);
                  const isExisting = false;
                  if (!isExisting) {
                    setNotificationStatus("failed");
                    setNotificationTitle(t("alt-9_run-failed"));
                    setNotificationDetail(t("alt-10_run-failed-intro"));
                    setNotificationOpen(true);
                    setNotificationLink(null);
                  }
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

export default WarningModal;
