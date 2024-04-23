import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Grid,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Box,
  Tooltip,
} from "@mui/material";
import Chatindex from "../../pages/chat";

import newlogo from "../../assets/main/newlogo.png";
import newlogohead from "../../assets/main/newlogohead.png";
import searchlg from "../../assets/main/searchlg.svg";
import Settings from "../../pages/settings";
import Back from "./Back";
import Avatar from "./Avatar";
// import ComingModal from "../ComingModal";

import { chatType, notificationType } from "../../types/settingTypes";
import { ChatnotificationType } from "../../types/chatTypes";
import { PaginationType } from "../../types/homeTypes";
import { TymtlogoType } from "../../types/homeTypes";
import {
  accountType,
  custodialType,
  nonCustodialType,
  walletEnum,
} from "../../types/accountTypes";
import { IChain } from "../../types/walletTypes";
import {
  selectNotification,
  setNotification,
} from "../../features/settings/NotificationSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { getCustodial } from "../../features/account/CustodialSlice";
import { getCurrentLogo } from "../../features/home/Tymtlogo";
import { getchatNotification } from "../../features/chat/Chat-notificationSlice";
import { getCurrentPage, setCurrentPage } from "../../features/home/Navigation";
import { getChain } from "../../features/wallet/ChainSlice";
import { selectChat } from "../../features/settings/ChatSlice";
import CardModal from "../CardModal";
import Alertindex from "../../pages/alert";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5733",
    },
    secondary: {
      main: "#9e9e9e",
      light: "#F5EBFF",
      contrastText: "#47008F",
    },
  },
});

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const homeclasses = homeStyles();
  const notification: notificationType = useSelector(selectNotification);
  const currentpage: PaginationType = useSelector(getCurrentPage);
  const currentlogo: TymtlogoType = useSelector(getCurrentLogo);
  const account: accountType = useSelector(getAccount);
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const custodialStore: custodialType = useSelector(getCustodial);
  const data: chatType = useSelector(selectChat);
  const chain: IChain = useSelector(getChain);
  const chatnotification: ChatnotificationType =
    useSelector(getchatNotification);
  const userStore =
    account.wallet === walletEnum.noncustodial
      ? nonCustodialStore
      : custodialStore;
  const { t } = useTranslation();
  const [showSetting, setShowSetting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [value, setValue] = useState<string>("");
  // const [coming, setComing] = useState<boolean>(false);
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);

 
  const setView = useCallback(
    (view: boolean) => {
      setShowSetting(view);
    },
    [showSetting]
  );
  const setChat = useCallback(
    (viewChat: boolean) => {
      setShowChat(viewChat);
    },
    [showChat]
  );
  const setAlert = useCallback(
    (viewAlert: boolean) => {
      setShowAlert(viewAlert);
    },
    [showAlert]
  );

  const handleCardEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleCardLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };
  const handleWalletEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleWalletLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };
  const handleAlarmEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleAlarmLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };
  const handleMessageEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleMessageLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };

  return (
    <>
      <Grid
        item
        width={"95%"}
        className="navbar"
        container
        sx={{ backdropFilter: "blur(30px)" }}
      >
        {currentlogo.isDrawerExpanded === true && (
          <img
            src={newlogo}
            alt={"tymtlogo-1"}
            loading="lazy"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          />
        )}
        {currentlogo.isDrawerExpanded === false && (
          <img
            src={newlogohead}
            alt={"tymtlogo-2"}
            loading="lazy"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          />
        )}

        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          sx={{ position: "fixed", left: "20%" }}
        >
          {location.pathname.indexOf("home") === -1 && (
            <Back
              onClick={() => {
                navigate(-1);
              }}
            />
          )}
          <ThemeProvider theme={theme}>
            <TextField
              disabled
              className="searchbar"
              color="secondary"
              placeholder={t("hom-4_search")}
              value={value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={searchlg} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {value !== "" && (
                      <Button
                        className={"clear_filter"}
                        onClick={() => setValue("")}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17 7L7 17M7 7L17 17"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    )}
                  </InputAdornment>
                ),
                style: { color: "#FFFFFF" },
              }}
              onChange={(e) => {
                if (setValue) setValue(e.target.value);
              }}
            />
          </ThemeProvider>
        </Stack>
        <Grid item className="button_group">
          <Tooltip
            placement="top"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginBottom: "-20px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-16-regular white">
                  {t("tol-8_solar-card")}
                </Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => {
                setCardModalOpen(true);
              }}
            >
              <svg
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 10H2M2 8.2L2 15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.07989 19 5.2 19L18.8 19C19.9201 19 20.4802 19 20.908 18.782C21.2843 18.5903 21.5903 18.2843 21.782 17.908C22 17.4802 22 16.9201 22 15.8V8.2C22 7.0799 22 6.51984 21.782 6.09202C21.5903 5.7157 21.2843 5.40974 20.908 5.21799C20.4802 5 19.9201 5 18.8 5L5.2 5C4.0799 5 3.51984 5 3.09202 5.21799C2.7157 5.40973 2.40973 5.71569 2.21799 6.09202C2 6.51984 2 7.07989 2 8.2Z"
                  stroke="#AFAFAF"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginBottom: "-20px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-16-regular white">{t("tol-1_wallet")}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => {
                navigate("/wallet");
                dispatch(
                  setCurrentPage({ ...currentpage, index: 3, page: "wallet" })
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                viewBox="0 0 24 20"
                fill="none"
                onMouseEnter={handleWalletEnter}
                onMouseLeave={handleWalletLeave}
              >
                <path
                  d="M0.859375 2.4V17.6C0.859375 18.1039 1.06093 18.5872 1.41969 18.9435C1.77846 19.2998 2.26505 19.5 2.77242 19.5H21.9029C22.1565 19.5 22.3998 19.3999 22.5792 19.2218C22.7586 19.0436 22.8594 18.802 22.8594 18.55V5.25C22.8594 4.99804 22.7586 4.75641 22.5792 4.57825C22.3998 4.40009 22.1565 4.3 21.9029 4.3H2.77242C2.26505 4.3 1.77846 4.09982 1.41969 3.7435C1.06093 3.38718 0.859375 2.90391 0.859375 2.4ZM0.859375 2.4C0.859375 1.89609 1.06093 1.41282 1.41969 1.0565C1.77846 0.700178 2.26505 0.5 2.77242 0.5H19.0333"
                  stroke="#AFAFAF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.3594 13.5C18.1878 13.5 18.8594 12.8284 18.8594 12C18.8594 11.1716 18.1878 10.5 17.3594 10.5C16.5309 10.5 15.8594 11.1716 15.8594 12C15.8594 12.8284 16.5309 13.5 17.3594 13.5Z"
                  fill="#AFAFAF"
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginBottom: "-20px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-16-regular white">{t("tol-2_alert")}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              sx={{ position: "relative" }}
              onClick={() => {
                dispatch(setNotification({ ...notification, alert: false }));
                setShowAlert(!showAlert);
              }}
            >
              {notification.alert == true && (
                <span className={"notification_dot"}></span>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onMouseEnter={handleAlarmEnter}
                onMouseLeave={handleAlarmLeave}
              >
                <path
                  d="M14.0008 21H10.0008M18.0008 8C18.0008 6.4087 17.3686 4.88258 16.2434 3.75736C15.1182 2.63214 13.5921 2 12.0008 2C10.4095 2 8.88333 2.63214 7.75811 3.75736C6.63289 4.88258 6.00075 6.4087 6.00075 8C6.00075 11.0902 5.22122 13.206 4.35042 14.6054C3.61588 15.7859 3.24861 16.3761 3.26208 16.5408C3.27699 16.7231 3.31561 16.7926 3.46253 16.9016C3.59521 17 4.19334 17 5.38961 17H18.6119C19.8082 17 20.4063 17 20.539 16.9016C20.6859 16.7926 20.7245 16.7231 20.7394 16.5408C20.7529 16.3761 20.3856 15.7859 19.6511 14.6054C18.7803 13.206 18.0008 11.0902 18.0008 8Z"
                  stroke="#AFAFAF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginBottom: "-20px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-16-regular white">{t("tol-3_chat")}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => setShowChat(!showChat)}
              sx={{ position: "relative" }}
            >
              {chatnotification.alert === true && (
                <>
                  <Box
                    className={"fs-12-light"}
                    sx={{
                      color: "#52E1F2",
                      border:
                        "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.10))",
                      borderRadius: "var(--Angle-Small, 16px)",
                      background:
                        "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
                      position: "absolute",
                      bottom: "0px",
                      right: "-15.5px",
                      padding: "2px 3px 2px 3px",
                      backdropFilter: "blur(50px)",
                    }}
                  >
                    124
                  </Box>
                </>
              )}

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={handleMessageEnter}
                onMouseLeave={handleMessageLeave}
              >
                <path
                  d="M7.5 12H7.51M12 12H12.01M16.5 12H16.51M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.1971 3.23374 14.3397 3.65806 15.3845C3.73927 15.5845 3.77988 15.6845 3.798 15.7653C3.81572 15.8443 3.8222 15.9028 3.82221 15.9839C3.82222 16.0667 3.80718 16.1569 3.77711 16.3374L3.18413 19.8952C3.12203 20.2678 3.09098 20.4541 3.14876 20.5888C3.19933 20.7067 3.29328 20.8007 3.41118 20.8512C3.54589 20.909 3.73218 20.878 4.10476 20.8159L7.66265 20.2229C7.84309 20.1928 7.9333 20.1778 8.01613 20.1778C8.09715 20.1778 8.15566 20.1843 8.23472 20.202C8.31554 20.2201 8.41552 20.2607 8.61549 20.3419C9.6603 20.7663 10.8029 21 12 21ZM8 12C8 12.2761 7.77614 12.5 7.5 12.5C7.22386 12.5 7 12.2761 7 12C7 11.7239 7.22386 11.5 7.5 11.5C7.77614 11.5 8 11.7239 8 12ZM12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12ZM17 12C17 12.2761 16.7761 12.5 16.5 12.5C16.2239 12.5 16 12.2761 16 12C16 11.7239 16.2239 11.5 16.5 11.5C16.7761 11.5 17 11.7239 17 12Z"
                  stroke="#AFAFAF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Tooltip>
          <Button
            className="button_navbar_profile"
            onClick={() => setShowSetting(!showSetting)}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              marginLeft={"0px"}
              justifyContent={"left"}
              spacing={"8px"}
              height={"32px"}
            >
              <Avatar
                userid={account.uid}
                size={32}
                ischain={true}
                onlineStatus={true}
                status={data.disturb ? "donotdisturb" : "online"}
              />
              <Stack
                direction={"column"}
                width={"110px"}
                alignItems={"flex-start"}
              >
                <Box className={"fs-16-regular white"}>
                  {userStore.nickname.length > 11
                    ? `${userStore.nickname.substring(0, 10)}...`
                    : userStore.nickname}
                </Box>
                <Box className={"fs-14-regular light"}>
                  {`${chain?.chain.wallet.substring(
                    0,
                    5
                  )}...${chain?.chain.wallet.substring(
                    chain?.chain.wallet.length - 4
                  )}`}
                </Box>
              </Stack>
            </Stack>
          </Button>
        </Grid>
        <Settings view={showSetting} setView={setView} />
        <Chatindex viewChat={showChat} setViewChat={setChat} />
        <Alertindex viewAlert={showAlert} setViewAlert={setAlert} />
      </Grid>
      {/* <ComingModal open={coming} setOpen={setComing} /> */}
      <CardModal open={cardModalOpen} setOpen={setCardModalOpen} />
    </>
  );
};

export default Navbar;
