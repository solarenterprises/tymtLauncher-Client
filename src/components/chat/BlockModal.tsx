// import { Modal, Box, Stack, Button, Fade } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { IContactList, propsBlockModalType, selecteduserType } from "../../types/chatTypes";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "../../store";
// import { createBlockAsync, deleteBlockAsync, getBlockList } from "../../features/chat/BlockListSlice";
// import { useCallback } from "react";
// import { deleteFriendAsync } from "../../features/chat/FriendListSlice";
// import { createContactAsync, deleteContactAsync } from "../../features/chat/ContactListSlice";

// const BlockModal = ({ block, openBlockModal, setOpenBlockModal, roommode }: propsBlockModalType) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch<AppDispatch>();
//   const blockListStore: IContactList = useSelector(getBlockList);

//   const handleBlockClick = useCallback(async () => {
//     try {
//       if (blockListStore.contacts.find((element) => element._id === selectedUserStore.id)) {
//         console.log("handleBlockClick: Already in the block list!");
//         setOpenBlockModal(false);
//         return;
//       }
//       dispatch(deleteFriendAsync(selectedUserStore.id)).then(() => {
//         dispatch(deleteContactAsync(selectedUserStore.id)).then(() => {
//           dispatch(createBlockAsync(selectedUserStore.id));
//         });
//       });
//       console.log("handleBlockClick");
//     } catch (err) {
//       console.error("Failed to handleBlockClick: ", err);
//     }
//     setOpenBlockModal(false);
//   }, [selectedUserStore, blockListStore]);

//   const handleUnblockClick = useCallback(async () => {
//     try {
//       if (!blockListStore.contacts.find((element) => element._id === selectedUserStore.id)) {
//         console.log("handleBlockClick: Not in the block list!");
//         setOpenBlockModal(false);
//         return;
//       }
//       dispatch(deleteBlockAsync(selectedUserStore.id)).then(() => {
//         dispatch(createContactAsync(selectedUserStore.id));
//       });
//       console.log("handleUnblockClick");
//     } catch (err) {
//       console.error("Failed to handleUnblockClick: ", err);
//     }
//     setOpenBlockModal(false);
//   }, [selectedUserStore, blockListStore]);

//   const handleCancelClick = () => {
//     setOpenBlockModal(false);
//   };

//   return (
//     <Modal open={openBlockModal}>
//       <Fade in={openBlockModal}>
//         <Box className={roommode ? "modal_content_chatroom" : "modal_content"}>
//           <Box className={"fs-18-light white"} textAlign={"center"}>
//             {block ? t("cha-9_are-you-sure-block") : t("cha-40_are-you-sure-unblock")}
//           </Box>
//           <Stack marginTop={"20px"} width={"100%"} flexDirection={"row"} alignSelf={"center"} justifyContent={"space-around"}>
//             <Button className="modal_btn_left" onClick={handleCancelClick}>
//               <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
//                 {t("cha-7_cancel")}
//               </Box>
//             </Button>
//             <Button className="modal_btn_right" onClick={block ? handleBlockClick : handleUnblockClick}>
//               <Box className={"fs-18-bold white"}>{block ? t("cha-4_block") : t("cha-39_unblock")}</Box>
//             </Button>
//           </Stack>
//         </Box>
//       </Fade>
//     </Modal>
//   );
// };

// export default BlockModal;
