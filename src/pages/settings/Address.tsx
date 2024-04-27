import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/settings/back-icon.svg";
import editIcon from "../../assets/settings/edit-icon.svg";
import deleteIcon from "../../assets/settings/trash-icon.svg";
import InputText from "../../components/account/InputText";
import emptyImg from "../../assets/settings/empty-address.svg";
import {
  selectAddress,
  setAddress,
} from "../../features/settings/AddressSlice";
import { useCallback, useState } from "react";
import { propsType, addressType } from "../../types/settingTypes";

import { useNotification } from "../../providers/NotificationProvider";

const Address = ({ view, setView }: propsType) => {
  const dispatch = useDispatch();
  const data: addressType[] = useSelector(selectAddress);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [status, setStatus] = useState("normal");
  const [seq, setSeq] = useState(-1);
  const classname = SettingStyle();
  const { t } = useTranslation();

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const updateAddress = useCallback(() => {
    setStatus("normal");
    if (seq == -1) {
      const updatedData = [...data, { name: name, address: info }];
      dispatch(setAddress(updatedData));
      setNotificationTitle(t("set-85_success"));
      setNotificationDetail(t("set-86_wallet-successfully-added"));
    } else {
      const updateData = [...data];
      updateData[seq] = { name: name, address: info };
      dispatch(setAddress(updateData));
      setNotificationTitle(t("set-85_success"));
      setNotificationDetail(t("set-87_wallet-successfully-updated"));
    }
    setNotificationStatus("success");
    setNotificationOpen(true);
    setNotificationLink(null);
  }, [data, dispatch, name, info, seq]);

  const editAddress = useCallback(
    (index: number) => {
      setStatus("edit");
      const { name, address } = data[index];
      setName(name), setInfo(address);
      setSeq(index);
    },
    [data, name, info, seq]
  );

  const deleteAddress = useCallback(
    (deleteId: number) => {
      const updatedData = data.filter((_, index) => index !== deleteId);
      dispatch(setAddress(updatedData));
      setNotificationStatus("success");
      setNotificationTitle(t("alt-13_delete-wallet"));
      setNotificationDetail(t("alt-14_delete-wallet-intro"));
      setNotificationOpen(true);
      setNotificationLink(null);
    },
    [data, dispatch, name, info, seq]
  );

  return (
    <>
      {view === "address" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack
            flexDirection={"row"}
            justifyContent={"flex-start"}
            gap={"10px"}
            alignItems={"center"}
            textAlign={"center"}
            sx={{ padding: "20px" }}
          >
            <Button className="common-btn">
              {status === "normal" && (
                <Button
                  className={"setting-back-button"}
                  onClick={() => setView("wallet")}
                >
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
              )}
              {status === "add" && (
                <Button
                  className={"setting-back-button"}
                  onClick={() => setStatus("normal")}
                >
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
              )}
              {status === "edit" && (
                <Button
                  className={"setting-back-button"}
                  onClick={() => setStatus("normal")}
                >
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
              )}
            </Button>
            <Box className="fs-h3 white">
              {status === "normal" && t("set-61_address-book")}
              {status === "add" && t("set-62_add-address")}
              {status === "edit" && t("set-78_edit-address")}
            </Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          {status === "normal" && (
            <>
              {data.length === 0 && (
                <Stack
                  direction={"column"}
                  justifyContent={"center"}
                  textAlign={"center"}
                  alignItems={"center"}
                  paddingTop={"20%"}
                >
                  <Box>
                    <img src={emptyImg} />
                  </Box>
                  <Box className="fs-h4 white">
                    {t("set-63_address-book-empty")}
                  </Box>
                  <Box
                    padding={"20px"}
                    width={"90%"}
                    sx={{ position: "absolute", bottom: "30px" }}
                  >
                    <Button
                      fullWidth
                      className={classname.action_button}
                      onClick={() => setStatus("add")}
                    >
                      {t("set-62_add-address")}
                    </Button>
                  </Box>
                </Stack>
              )}
              {data.length !== 0 && (
                <Stack direction={"column"} key={0}>
                  {data.map((item, index) => (
                    <>
                      <Box key={index}>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          textAlign={"center"}
                          padding={"30px"}
                        >
                          <Stack
                            direction={"column"}
                            justifyContent={"flex-start"}
                            gap={1}
                            textAlign={"left"}
                          >
                            <Box className="fs-h4 white">{item.name}</Box>
                            <Box className="fs-16-regular gray">
                              {item.address}
                            </Box>
                          </Stack>
                          <Stack
                            className="center-align"
                            direction={"row"}
                            gap={1}
                          >
                            <Box
                              sx={{ display: "flex" }}
                              className="common-btn"
                              onClick={() => editAddress(index)}
                            >
                              <Tooltip
                                title={t("set-82_edit")}
                                classes={{ tooltip: classname.tooltip }}
                              >
                                <img src={editIcon} />
                              </Tooltip>
                            </Box>
                            <Box
                              sx={{ display: "flex" }}
                              className="common-btn"
                              onClick={() => deleteAddress(index)}
                            >
                              <Tooltip
                                title={t("set-83_delete")}
                                classes={{ tooltip: classname.tooltip }}
                              >
                                <img src={deleteIcon} />
                              </Tooltip>
                            </Box>
                          </Stack>
                        </Stack>
                        <Divider
                          variant="middle"
                          sx={{ backgroundColor: "#FFFFFF1A" }}
                        />
                      </Box>
                    </>
                  ))}
                  <Box
                    padding={"20px"}
                    width={"90%"}
                    sx={{ position: "absolute", bottom: "30px" }}
                    onClick={() => setStatus("add")}
                  >
                    <Button fullWidth className={classname.action_button}>
                      {t("set-62_add-address")}
                    </Button>
                  </Box>
                </Stack>
              )}
            </>
          )}
          {status === "add" && (
            <>
              <Stack className={classname.border_container} margin={"20px"}>
                <Box padding={"10px"}>
                  <InputText
                    setValue={setName}
                    id="address-name"
                    type="text"
                    label={t("set-64_name-for-wallet")}
                  />
                </Box>
                <Box padding={"10px"}>
                  <InputText
                    setValue={setInfo}
                    id="address-wallet"
                    type="mnemonic"
                    label={t("set-65_recipient-address")}
                  />
                </Box>
              </Stack>
              <Box
                padding={"20px"}
                width={"90%"}
                sx={{ position: "absolute", bottom: "30px" }}
              >
                <Button
                  fullWidth
                  className={classname.action_button}
                  onClick={() => {
                    setSeq(-1);
                    updateAddress();
                  }}
                >
                  {t("set-57_save")}
                </Button>
              </Box>
            </>
          )}
          {status === "edit" && (
            <>
              <Stack className={classname.border_container} margin={"20px"}>
                <Box padding={"10px"}>
                  <InputText
                    setValue={setName}
                    id="address-name"
                    type="text"
                    label={t("set-64_name-for-wallet")}
                    value={name}
                  />
                </Box>
                <Box padding={"10px"}>
                  <InputText
                    setValue={setInfo}
                    id="address-wallet"
                    type="mnemonic"
                    label={t("set-65_recipient-address")}
                    value={info}
                  />
                </Box>
              </Stack>
              <Box
                padding={"20px"}
                width={"90%"}
                sx={{ position: "absolute", bottom: "30px" }}
              >
                <Button
                  fullWidth
                  className={classname.action_button}
                  onClick={() => updateAddress()}
                >
                  {t("set-57_save")}
                </Button>
              </Box>
            </>
          )}
        </Stack>
      )}
    </>
  );
};

export default Address;
