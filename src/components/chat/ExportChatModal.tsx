import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import dayjs, { Dayjs } from "dayjs";
import { saveAs } from "file-saver";

import { Modal, Box, Stack, Button, Fade } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";

import { getAccount } from "../../features/account/AccountSlice";

import ChatroomAPI from "../../lib/api/ChatroomAPI";

import { IChatroom, IReqChatroomExportMessageHistory } from "../../types/ChatroomAPITypes";
import { accountType } from "../../types/accountTypes";
import { getSKeyList, ISKeyList } from "../../features/chat/SKeyListSlice";

export interface IPropsExportChatModal {
  view: boolean;
  setView: (_: boolean) => void;
  group: IChatroom;
}

const ExportChatModal = ({ view, setView, group }: IPropsExportChatModal) => {
  const { t } = useTranslation();

  const accountStore: accountType = useSelector(getAccount);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);

  const currentSKey = sKeyListStore.sKeys.find((element) => element.roomId === group._id)?.sKey;

  const [fromDate, setFromDate] = useState<Dayjs>();
  const [toDate, setToDate] = useState<Dayjs>();

  const handleExportClick = useCallback(async () => {
    try {
      const body: IReqChatroomExportMessageHistory = {
        userId: accountStore.uid,
        chatroomId: group._id,
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
        chunkIndex: 0,
      };
      const res = await ChatroomAPI.exportMessageHistoryStream(body);
      if (res?.status !== 200 || !res?.data) {
        console.error("Failed to handleExportClick:", res);
        return;
      }
      const dataToFile = {
        userId: accountStore.uid,
        chatroomId: group._id,
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
        userKey: currentSKey ? currentSKey : "",
        isPrivate: group.isPrivate,
        roomName: group.room_name,
        messages: res.data,
      };
      const blob = new Blob([JSON.stringify(dataToFile)], { type: "application/octet-stream" });
      saveAs(blob, `export_${dayjs().format("YYYY-MM-DD")}.json`);

      console.log("handleExportClick", res);
      setView(false);
    } catch (err) {
      console.error("Failed to handleExportClick: ", err);
    }
  }, [accountStore, group, fromDate, toDate]);

  const handleCancelClick = () => {
    setView(false);
  };

  return (
    <Modal open={view} onClose={handleCancelClick} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <Fade in={view}>
        <Box className={"modal_content_center"}>
          <Box className={"fs-18-light white"} textAlign={"center"}>
            {t("cha-62_export_modal_instruction")}
          </Box>
          <Stack mt={"30px"} direction={"row"} alignItems={"center"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField", "DateField"]}>
                <DateField
                  className={"date_field"}
                  label="From"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  format="YYYY-MM-DD"
                  variant="standard"
                />
                <DateField
                  className={"date_field"}
                  label="To"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  format="YYYY-MM-DD"
                  variant="standard"
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
          <Stack marginTop={"20px"} width={"100%"} flexDirection={"row"} alignSelf={"center"} justifyContent={"space-around"}>
            <Button className="modal_btn_left" onClick={handleCancelClick}>
              <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
                {t("cha-7_cancel")}
              </Box>
            </Button>
            <Button className="modal_btn_right" onClick={handleExportClick}>
              <Box className={"fs-18-bold white"}>{t("cha-60_export")}</Box>
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ExportChatModal;
