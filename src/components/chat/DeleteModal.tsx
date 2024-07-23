// import { Modal, Box, Stack, Button, Fade } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { propsDeleteModalType } from "../../types/chatTypes";

// const DeleteModal = ({ openDeleteModal, setOpenDeleteModal, deleteSelectedUser, roommode }: propsDeleteModalType) => {
//   const { t } = useTranslation();

//   return (
//     <Modal open={openDeleteModal}>
//       <Fade in={openDeleteModal}>
//         <Box className={roommode ? "modal_content_chatroom" : "modal_content"}>
//           <Box className={"fs-18-bold white"} textAlign={"center"}>
//             {t("cha-6_are-you-sure-delete")}
//           </Box>
//           <Stack marginTop={"20px"} width={"100%"} flexDirection={"row"} alignSelf={"center"} justifyContent={"space-around"}>
//             <Button className="modal_btn_left" onClick={() => setOpenDeleteModal(false)}>
//               <Box className={"fs-18-bold white"} color={"var(--Main-Blue, #52E1F2)"}>
//                 {t("cha-7_cancel")}
//               </Box>
//             </Button>
//             <Button
//               className="modal_btn_right"
//               onClick={() => {
//                 deleteSelectedUser();
//               }}
//             >
//               <Box className={"fs-18-bold white"}>{t("cha-8_delete")}</Box>
//             </Button>
//           </Stack>
//         </Box>
//       </Fade>
//     </Modal>
//   );
// };

// export default DeleteModal;
