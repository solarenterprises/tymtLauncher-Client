import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Grid, Box, Stack } from "@mui/material";
import tymt1 from "../../assets/account/tymt1.png";
import wallet from "../../assets/account/wallet.png";
import mail from "../../assets/account/mail.png";
import facebookIcon from "../../assets/account/facebook-icon.svg";
import googleIcon from "../../assets/account/google-icon.svg";
import discordIcon from "../../assets/account/discord-icon.svg";
import binanceIcon from "../../assets/account/binance-icon.svg";
import Back from "../../components/account/Back";
import AccountButton from "../../components/account/AccountButton";
import SwitchButton from "../../components/account/SwitchButton";
import OrLine from "../../components/account/OrLine";
import { getAccount, setAccount } from "../../features/account/AccountSlice";
import { loginEnum, walletEnum, accountType } from "../../types/accountTypes";
import ComingModal from "../../components/ComingModal";
import { setMnemonic } from "../../features/account/MnemonicSlice";

const Start = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const accountStore: accountType = useSelector(getAccount);
  const [coming, setComing] = useState<boolean>(false);

  // set all sensitive variables as empty Sign out here
  useEffect(() => {
    dispatch(
      setAccount({
        ...accountStore,
        mode: loginEnum.login,
        isLoggedIn: false,
      })
    );
    dispatch(setMnemonic({ mnemonic: "" }));
  }, []);

  const handleBackClick = () => {
    navigate("/get-started");
  };

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
            <Stack alignItems={"center"} justifyContent={"center"}>
              <Grid container justifyContent={"center"}>
                <Grid
                  item
                  container
                  sx={{
                    width: "520px",
                    padding: "10px 0px",
                  }}
                >
                  <Grid item xs={12}>
                    <Back onClick={handleBackClick} />
                  </Grid>
                  <Grid item xs={12} mt={"80px"}>
                    <SwitchButton />
                  </Grid>
                  <Grid item xs={12} mt={"24px"}>
                    <Box className="fs-h1 white">{t("wc-1_welcome-player")}</Box>
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountButton
                      src={wallet}
                      text={t("wc-12_non-custodial-wallet")}
                      onClick={() => {
                        dispatch(
                          setAccount({
                            ...accountStore,
                            wallet: walletEnum.noncustodial,
                          })
                        );
                        if (accountStore.mode === loginEnum.login) navigate("/non-custodial/login/1");
                        else navigate("/non-custodial/signup/1");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"24px"}>
                    <AccountButton
                      src={mail}
                      text={t("wc-13_custodial-wallet")}
                      onClick={() => {
                        setComing(true);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"40px"}>
                    <OrLine />
                  </Grid>
                  <Grid item xs={12} container mt={"24px"} spacing={"16px"}>
                    <Grid item xs={12}>
                      <AccountButton
                        src={facebookIcon}
                        text={t("wc-14_facebook")}
                        onClick={() => {
                          setComing(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AccountButton
                        src={googleIcon}
                        text={t("wc-15_google")}
                        onClick={() => {
                          setComing(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AccountButton
                        src={discordIcon}
                        text={t("wc-16_discord")}
                        onClick={() => {
                          setComing(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AccountButton
                        src={binanceIcon}
                        text={t("wc-17_binance-id")}
                        onClick={() => {
                          setComing(true);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
            <Box
              component={"img"}
              src={tymt1}
              sx={{
                height: "calc(100vh - 64px)",
              }}
            />
          </Stack>
        </Grid>
      </Grid>
      {/* <OAuthModal title={title} src={src} setOpen={setOpen} open={open} /> */}
      <ComingModal open={coming} setOpen={setComing} />
    </>
  );
};

export default Start;
