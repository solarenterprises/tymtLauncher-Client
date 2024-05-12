import { Modal, Box, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { propsBlockModalType } from "../../types/chatTypes";

const BlockModal = ({
  openBlockModal,
  setOpenBlockModal,
  roommode,
}: propsBlockModalType) => {
  const { t } = useTranslation();

  return (
    <Modal open={openBlockModal}>
      <Box className={roommode ? "modal_content_chatroom" : "modal_content"}>
        <Box className={"fs-18-light white"} textAlign={"center"}>
          {t("cha-9_are-you-sure-block")}
        </Box>
        <Stack
          marginTop={"20px"}
          width={"100%"}
          flexDirection={"row"}
          alignSelf={"center"}
          justifyContent={"space-around"}
        >
          <Button
            className="modal_btn_left"
            onClick={() => setOpenBlockModal(false)}
          >
            <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
              {t("cha-7_cancel")}
            </Box>
          </Button>
          <Button
            className="modal_btn_right"
            onClick={() => setOpenBlockModal(false)}
          >
            <Box className={"fs-18-bold white"}>{t("cha-4_block")}</Box>
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default BlockModal;
