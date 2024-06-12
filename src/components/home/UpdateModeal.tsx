import { Box, Stack, Modal } from "@mui/material";
import closeIcon from "../../assets/settings/x-icon.svg";
import logo from "../../assets/main/foxhead-comingsoon.png";
import { openLink } from "../../lib/api/Downloads";
import { useTranslation } from "react-i18next";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

const UpdateModal = ({ open, setOpen }: props) => {
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
        <Box className="modal-content oauth-modal">
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Box className="center-align">
              <img width={200} src={logo} />
            </Box>
            <Box className="fs-h3 white">{t("hom-24_tymt-updated")}</Box>
            <Box
              className="fs-h3 blue"
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                openLink("https://tymt.com");
              }}
            >
              https://tymt.com
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateModal;
