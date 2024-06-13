import { Box, Stack, Modal, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import closeIcon from "../../assets/settings/x-icon.svg";
import logoImg from "../../assets/main/logo-header.svg";
import arrowIcon from "../../assets/account/blue-arrow-right.svg";
import { oauthModalType } from "../../types/accountTypes";

const OAuthModal = ({ src, title, open, setOpen }: oauthModalType) => {
  const { t } = useTranslation();
  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Modal
      open={open}
      style={modalStyle}
      sx={{
        backdropFilter: "blur(2px)",
      }}
      onClose={() => setOpen(false)}
    >
      <Fade in={open}>
        <Box
          className="modal-content oauth-modal"
          sx={{
            backdropFilter: "blur(10px)",
            maxHeight: "80%",
          }}
        >
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Box className="fs-h3 gray">{t("wc-18_connecting-you-to")} </Box>
            <Box className="fs-h3 white">{title}</Box>
            <Stack direction={"row"} className="oauth-container m-tb-20">
              <Box className="center-align">
                <img width={48} src={logoImg} />
              </Box>
              <Box className="center-align">
                <img src={arrowIcon} />
              </Box>
              <Box className="center-align">
                <img width={48} src={src} />
              </Box>
            </Stack>
            <Box className="fs-14-light gray">{t("wc-19_check-your-browser")}</Box>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default OAuthModal;
