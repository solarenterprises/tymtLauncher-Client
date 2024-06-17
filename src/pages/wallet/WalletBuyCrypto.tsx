import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Box, Stack, Button } from "@mui/material";
import InputBox from "../../components/wallet/InputBox";
import walletIcon from "../../assets/wallet.svg";
import usdIcon from "../../assets/wallet/usd-icon.svg";
import ChooseChainDrawer from "../../components/wallet/ChooseChainDrawer";
import { useState } from "react";
import { getChain } from "../../features/wallet/ChainSlice";

const WalletBuyCrypto = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const chain = useSelector(getChain);
  const [usd, setUsd] = useState("");
  const [sxp, setSxp] = useState("");
  const [chooseChainView, setChooseChainView] = useState<boolean>(false);
  return (
    <>
      <Grid container mb={"30px"}>
        <Grid item xs={12} container justifyContent={"center"}>
          <Box className="wallet-form-card br-16" padding="32px 56px" width="596px">
            <Box className="fs-h2 white" mb={"32px"}>
              {t("wal-30_buy-crypto")}
            </Box>
            <Box className={"wallet-form-card-hover p-24-16 br-16"} mb={"32px"} onClick={() => setChooseChainView(true)}>
              <Stack direction="row" alignItems={"center"} spacing={"16px"}>
                <Box component={"img"} src={chain.icon} width={"36px"} height={"36px"} />
                <Stack>
                  <Stack direction={"row"} spacing={"10px"}>
                    <Box className={"fs-18-regular light"}>{t("wal-8_from")}</Box>
                    <Box className={"fs-18-regular white"}>{chain.name}</Box>
                  </Stack>
                  <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                    <Box component={"img"} src={walletIcon} width={"12px"} height={"12px"} />
                    <Box className={"fs-14-regular light"}>{chain.address}</Box>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box className={"wallet-form-card p-16-16 br-16 blur"} mb={"32px"}>
              <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mb={"16px"}>
                <Box className={"fs-18-regular light"}>{t("wal-31_you-spend")}</Box>
                <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                  <Box component={"img"} src={walletIcon} width={"18px"} height={"18px"} />
                  <Box className={"fs-12-light light"}>{chain.count}</Box>
                  <Box className={"fs-14-bold blue"}>{t("wal-10_max")}</Box>
                </Stack>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack width={"100%"}>
                  <InputBox id={"send-amount"} label="" placeholder="0.0" align="left" value={usd} onChange={(value: string) => setUsd(value)}></InputBox>
                  <Box className={"fs-12-light light"}>~${chain.value * chain.count}</Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} padding={"4px 8px"} spacing={"8px"}>
                  <Box component={"img"} src={usdIcon} />
                  <Box className={"fs-18-regular white"}>USD</Box>
                </Stack>
              </Stack>
            </Box>
            <Box className={"wallet-form-card p-16-16 br-16 blur"} mb={"32px"}>
              <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mb={"16px"}>
                <Box className={"fs-18-regular light"}>{t("wal-32_you-get")}</Box>
                <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                  <Box component={"img"} src={walletIcon} width={"18px"} height={"18px"} />
                  <Box className={"fs-12-light light"}>123,000.00</Box>
                  <Box className={"fs-14-bold blue"}>{t("wal-10_max")}</Box>
                </Stack>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack width={"100%"}>
                  <InputBox id={"send-amount"} label="" placeholder="0.0" align="left" value={sxp} onChange={(value: string) => setSxp(value)}></InputBox>
                  <Box className={"fs-12-light light"}>~$1.00</Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} padding={"4px 8px"} spacing={"8px"}>
                  <Box component={"img"} src={chain.icon} />
                  <Box className={"fs-18-regular white"}>{chain.token}</Box>
                </Stack>
              </Stack>
            </Box>
            <Box className={"wallet-form-card p-16-16 br-16"} mb={"32px"}>
              <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Box className={"fs-16-regular light"}>{t("wal-33_exchange-rate")}</Box>
                <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                  <Box className={"fs-16-regular white"}>
                    1 {chain.token} ~ {chain.value} USD
                  </Box>
                </Stack>
              </Stack>
            </Box>
            <Button className={"red-button fw"} onClick={() => navigate("/wallet/payment-method")}>
              {t("wal-34_approve")}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ChooseChainDrawer view={chooseChainView} setView={setChooseChainView} />
    </>
  );
};

export default WalletBuyCrypto;
