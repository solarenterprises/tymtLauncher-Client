import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { Box, Grid, Stack, Button, Divider, InputAdornment, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import nocontact from "../../assets/chat/nocontact.png";
import settingicon from "../../assets/chat/settings.svg";
import searchlg from "../../assets/searchlg.svg";
import BlockModal from "../../components/chat/BlockModal";
import DeleteModal from "../../components/chat/DeleteModal";
// import RequestModal from "../../components/chat/RequestModal";
import ChatStyle from "../../styles/ChatStyles";
import { IContactList, propsType, userType } from "../../types/chatTypes";
import { getSelectedUser } from "../../features/chat/Chat-selecteduserSlice";
import { selecteduserType } from "../../types/chatTypes";
// import { setChatHistory } from "../../features/chat/Chat-historySlice";
import { debounce } from "lodash";
import { IAlertList } from "../../types/alertTypes";
import FRcontextmenu from "../../components/chat/FRcontextmenu";
import Userlist from "../../components/chat/Userlist";
import { deleteContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { AppDispatch } from "../../store";
import { searchUsers } from "../../features/chat/ContactListApi";
import { getAlertList } from "../../features/alert/AlertListSlice";

const ChatuserlistinRoom = ({ view, setView }: propsType) => {
  const classes = ChatStyle();

  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const contactListStore: IContactList = useSelector(getContactList);
  const selectedUserToDelete: selecteduserType = useSelector(getSelectedUser);
  const alertListStore: IAlertList = useSelector(getAlertList);

  const [searchedresult, setSearchedresult] = useState<userType[]>([]);
  const [searchvalue, setSearchValue] = useState<string>("");

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isClickedBlock, setIsClickedBlock] = useState(false);
  const [isClickedDelete, setIsClickedDelete] = useState(false);
  const [isClickedRequest, setIsClickedRequest] = useState(false);

  /***Modals of Userlist ***/
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // const [openRequestModal, setOpenRequestModal] = useState(false);

  const debouncedFilterUsers = debounce(async (value) => {
    setSearchedresult(await searchUsers(value));
  }, 1000);

  const filterUsers = (value) => {
    debouncedFilterUsers(value);
  };

  const deleteSelectedUser = useCallback(async () => {
    dispatch(deleteContactAsync(selectedUserToDelete.id));
    setOpenDeleteModal(false);
  }, [selectedUserToDelete]);

  // const sendRequest = useCallback(async () => {
  //   const data = {
  //     alertType: "friend-request",
  //     note: {
  //       sender: `${accountStore.uid}`,
  //       status: "pending",
  //     },
  //     receivers: [selectedUserToDelete.id],
  //   };
  //   socket.current.emit("post-alert", JSON.stringify(data));
  //   setOpenRequestModal(false);
  //   dispatch(createContactAsync(selectedUserToDelete.id));
  // }, [accountStore, selectedUserToDelete]);

  return (
    <>
      {view === "chatroom-chatuserlist" && (
        <Box
          sx={{
            display: "flex",
            padding: "16px 8px 16px 8px",
            flexDirection: "column",
            margin: "10px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              paddingRight: "8px",
              position: "relative",
            }}
          >
            <Box className={"fs-24-bold white"} marginTop={"0px"}>
              {t("cha-1_chat")}
            </Box>
            <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} marginTop={"30px"}>
              <TextField
                className={classes.search_bar}
                color="secondary"
                value={searchvalue}
                placeholder={t("cha-3_you-search-user")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={searchlg} />
                    </InputAdornment>
                  ),
                  style: { color: "#FFFFFF" },
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchvalue !== "" && (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => setSearchValue("")}
                          style={{ cursor: "pointer" }}
                        >
                          <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  if (!e.target.value) {
                    filterUsers(e.target.value);
                  }
                }}
              />
              <Button className={"common-btn"}>
                <Box
                  className={"center-align"}
                  onClick={() => {
                    setView("chatroom-chatsetting");
                  }}
                >
                  <img src={settingicon} style={{ cursor: "pointer" }} />
                </Box>
              </Button>
            </Stack>
          </Box>
          <Divider
            sx={{
              backgroundColor: "#FFFFFF1A",
              marginTop: "24px",
              marginBottom: "22px",
            }}
          />
          <Box className={classes.userlist_container}>
            {contactListStore.contacts?.length === 0 && searchvalue === "" ? (
              <>
                <Grid container sx={{ justifyContent: "center" }}>
                  <img
                    src={nocontact}
                    style={{
                      marginTop: "40%",
                      display: "block",
                      marginRight: "10%",
                    }}
                  ></img>
                </Grid>
                <Box className={"fs-20-regular white"} textAlign={"center"} marginRight={"10%"}>
                  {t("cha-2_you-havenot-friends")}
                </Box>
              </>
            ) : (
              <>
                {(searchvalue === "" ? contactListStore.contacts : searchedresult)?.map((user, index) => {
                  const count =
                    searchvalue === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === user._id && alert.alertType === "chat").length : 0;
                  const numberofunreadmessages = count;
                  return (
                    <Userlist
                      user={user}
                      index={index}
                      numberofunreadmessages={numberofunreadmessages}
                      setShowContextMenu={setShowContextMenu}
                      setContextMenuPosition={setContextMenuPosition}
                      // setView={setView}
                    />
                  );
                })}
                {showContextMenu && (
                  <FRcontextmenu
                    value={searchvalue}
                    isClickedBlock={isClickedBlock}
                    isClickedDelete={isClickedDelete}
                    isClickedRequest={isClickedRequest}
                    setIsClickedBlock={setIsClickedBlock}
                    setOpenBlockModal={setOpenBlockModal}
                    setShowContextMenu={setShowContextMenu}
                    setIsClickedDelete={setIsClickedDelete}
                    setOpenDeleteModal={setOpenDeleteModal}
                    // setOpenRequestModal={setOpenRequestModal}
                    setIsClickedRequest={setIsClickedRequest}
                    contextMenuPosition={contextMenuPosition}
                  />
                )}
                <BlockModal openBlockModal={openBlockModal} setOpenBlockModal={setOpenBlockModal} roommode={true} />
                <DeleteModal
                  openDeleteModal={openDeleteModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                  deleteSelectedUser={deleteSelectedUser}
                  roommode={true}
                />
                {/* <RequestModal
                  openRequestModal={openRequestModal}
                  setOpenRequestModal={setOpenRequestModal}
                  sendFriendRequest={sendRequest}
                  roommode={true}
                /> */}
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatuserlistinRoom;
