import { Modal, Box, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IContactList, propsBlockModalType, selecteduserType } from "../../types/chatTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { createBlockAsync, getBlockList } from "../../features/chat/BlockListSlice";
import { getSelectedUser } from "../../features/chat/Chat-selecteduserSlice";
import { useCallback } from "react";

const BlockModal = ({ openBlockModal, setOpenBlockModal, roommode }: propsBlockModalType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const selectedUserStore: selecteduserType = useSelector(getSelectedUser);
  const blockListStore: IContactList = useSelector(getBlockList);

  const handleBlockClick = useCallback(async () => {
    try {
      if (blockListStore.contacts.find((element) => element._id === selectedUserStore.id)) {
        console.log("handleBlockClick: Already in the block list!");
        return;
      }
      dispatch(createBlockAsync(selectedUserStore.id));
      console.log("handleBlockClick");
    } catch (err) {
      console.error("Failed to handleBlockClick: ", err);
    }
    setOpenBlockModal(false);
  }, [selectedUserStore, blockListStore]);

  const handleCancelClick = () => {
    setOpenBlockModal(false);
  };

  return (
    <Modal open={openBlockModal}>
      <Box className={roommode ? "modal_content_chatroom" : "modal_content"}>
        <Box className={"fs-18-light white"} textAlign={"center"}>
          {t("cha-9_are-you-sure-block")}
        </Box>
        <Stack marginTop={"20px"} width={"100%"} flexDirection={"row"} alignSelf={"center"} justifyContent={"space-around"}>
          <Button className="modal_btn_left" onClick={handleCancelClick}>
            <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
              {t("cha-7_cancel")}
            </Box>
          </Button>
          <Button className="modal_btn_right" onClick={handleBlockClick}>
            <Box className={"fs-18-bold white"}>{t("cha-4_block")}</Box>
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default BlockModal;
