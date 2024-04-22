import { Box, Stack, Modal } from "@mui/material";

import closeIcon from "../assets/settings/x-icon.svg";
import cardImg from "../assets/main/card.png";
import { useTranslation } from "react-i18next";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

const CardModal = ({ open, setOpen }: props) => {
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
          gap={"10px"}
        >
          <Box className="center-align">
            <img width={400} src={cardImg} />
          </Box>
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
            gap={"10px"}
          >
            <Box className="fs-h2 white">{t("tol-8_solar-card")}</Box>
            <Box className="fs-h3 white">{t("hom-16_coming-soon")}</Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CardModal;
