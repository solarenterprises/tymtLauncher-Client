import { Box, Stack, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import closeIcon from "../../assets/settings/x-icon.svg";
import { adviceModalType } from "../../types/storeTypes";
import adviceimg from "../../assets/main/adviceimg.png";

const AdviceModal = ({ open, setOpen }: adviceModalType) => {
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
      <Box
        className="modal-content benefit-modal"
        sx={{
          backdropFilter: "blur(10px)",
          position: "relative",
        }}
      >
        <img src={closeIcon} alt="close icon" style={{ left: 0, top: 0, cursor: "pointer" }} onClick={() => setOpen(false)} />
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
          <Box>
            <img src={adviceimg} alt="advice" />
          </Box>
          <Box className="fs-h3 white">{t("Device not supported")} </Box>
          <Box className="fs-16-light white" width={"80%"}>
            {t("This product is not compatible with your current device")}
          </Box>
          <Stack direction={"row"} width={"100%"} justifyContent={"space-between"}>
            <Box onClick={() => setOpen(false)} className="action-btn fs-18-light blue center-align" sx={{ minWidth: "40%" }}>
              {t("cha-7_cancel")}
            </Box>
            <Box onClick={() => setOpen(false)} className="continue-btn fs-18-light white center-align" sx={{ minWidth: "40%" }}>
              {t("ga-25_continue")}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AdviceModal;
