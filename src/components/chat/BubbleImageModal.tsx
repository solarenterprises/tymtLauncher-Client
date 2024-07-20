import { Modal, Fade, Box } from "@mui/material";

export interface IParamsBubbleImageModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  url: string;
}

const BubbleImageModal = ({ open, setOpen, url }: IParamsBubbleImageModal) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={open}>
          <Box
            component={"img"}
            src={url}
            sx={{
              maxWidth: "70vw",
              maxHeight: "70vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </Fade>
      </Modal>
    </>
  );
};

export default BubbleImageModal;
