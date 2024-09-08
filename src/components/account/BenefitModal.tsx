import { Box, Stack, Modal, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import closeIcon from "../../assets/settings/x-icon.svg";
import encryptIcon from "../../assets/account/encrypt-icon.svg";
import benefitIcon from "../../assets/account/benefit-icon.svg";
import benefitImg from "../../assets/account/benefit.svg";

export interface IPropsBenefitModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  path: string;
}

const BenefitModal = ({ open, setOpen, path }: IPropsBenefitModal) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          className="modal-content benefit-modal"
          sx={{
            backdropFilter: "blur(10px)",
            maxHeight: "80%",
          }}
        >
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Box>
              <img src={benefitImg} alt="benefit" />
            </Box>
            <Box className="fs-h3 white">{t("wc-20_introduce-solar-card")} </Box>
            <Box className="fs-16-light white">{t("wc-21_introduce-detail")}</Box>
            <Stack direction={"row"} className="m-tb-10" gap={"15px"}>
              <Box className="center-align">
                <img src={encryptIcon} />
              </Box>
              <Stack direction={"column"} gap={"10px"} textAlign={"left"}>
                <Box className="fs-h4 white">{t("wc-22_creating-wallet")}:</Box>
                <Box className="fs-14-light white">{t("wc-23_creating-wallet-detail")}</Box>
              </Stack>
            </Stack>
            <Stack direction={"row"} className="m-tb-10" gap={"15px"}>
              <Box className="center-align">
                <img src={benefitIcon} />
              </Box>
              <Stack direction={"column"} gap={"10px"} textAlign={"left"}>
                <Box className="fs-h4 white">{t("wc-24_solar-card-benefits")}:</Box>
                <Box className="fs-14-light white">{t("wc-25_solar-card-benefits-detail")}</Box>
              </Stack>
            </Stack>
            <Box onClick={() => navigate(path)} className="action-btn fs-18-light blue center-align" sx={{ minWidth: "100%" }}>
              {t("wc-26_got-it")}
            </Box>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BenefitModal;
