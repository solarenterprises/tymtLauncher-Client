import { Box, Stack, Modal } from "@mui/material";
import closeIcon from "../assets/settings/x-icon.svg";
import logo from "../assets/main/foxhead-comingsoon.png";
import { tymt_version } from "../configs";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}
const ComingModal = ({ open, setOpen }: props) => {
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
        <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
          <Box className="center-align">
            <img width={200} src={logo} />
          </Box>
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Box className="fs-h3 white">{`tymtLauncher v${tymt_version}`}</Box>
            <Box className="fs-h3 white">{`(June 10th, 2024 released)`}</Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ComingModal;
