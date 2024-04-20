import { Modal, Box, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { propsRequestModalType } from "../../types/chatTypes";

const RequestModal = ({
  openRequestModal,
  setOpenRequestModal,
  sendFriendRequest,
  roommode,
}: propsRequestModalType) => {
  const { t } = useTranslation();

  return (
    <Modal open={openRequestModal}>
      <Box className={roommode ? "modal_content_chatroom" : "modal_content"}>
        <Box className={"fs-18-bold white"} textAlign={"center"}>
          {t("cha-20_send-request")}?
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
            onClick={() => setOpenRequestModal(false)}
          >
            <Box
              className={"fs-18-bold white"}
              color={"var(--Main-Blue, #52E1F2)"}
            >
              {t("cha-7_cancel")}
            </Box>
          </Button>
          <Button
            className="modal_btn_right"
            onClick={() => {
              sendFriendRequest();
            }}
          >
            <Box className={"fs-18-bold white"}>{t("cha-27_request")}</Box>
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RequestModal;
