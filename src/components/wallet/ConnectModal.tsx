import { Box, Stack, Modal, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";

import closeIcon from "../../assets/settings/x-icon.svg";
import arrowIcon from "../../assets/account/blue-arrow-right.svg";
import arrowsconnect from "../../assets/wallet/arrowsconnect.svg";

import { connectModalType } from "../../types/accountTypes";

const ConnectModal = ({ coin, src, title, open, setOpen }: connectModalType) => {
  const { t } = useTranslation();
  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Modal open={open} style={modalStyle}>
      <Fade in={open}>
        <Box className="modal-content oauth-modal">
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Box className="fs-h3 gray">{t("wc-18_connecting-you-to")} </Box>
            <Box className="fs-h3 white">{title}</Box>
            <Stack direction={"row"} className="oauth-container m-tb-20">
              <Box className="center-align">
                <img width={48} src={coin} />
              </Box>
              <Box className="center-align">
                <img src={arrowIcon} />
              </Box>
              <Box className="center-align">
                <img width={48} src={src} />
              </Box>
            </Stack>
            <Box
              className="fs-14-light gray"
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              {"1234USD"}
              <img src={arrowsconnect} />
              {"1234SOL"}
            </Box>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ConnectModal;
