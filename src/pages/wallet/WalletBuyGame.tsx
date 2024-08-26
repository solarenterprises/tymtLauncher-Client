import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";

import { Chains } from "../../consts/Chains";

import { Box, Grid, Stack, IconButton, Button, Tooltip, Divider } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { getChain } from "../../features/wallet/ChainSlice";
import { selectWallet } from "../../features/settings/WalletSlice";

import InputText from "../../components/account/InputText";
import ChooseChainDrawer from "../../components/wallet/ChooseChainDrawer";
import TransactionFeeDrawer from "../../components/wallet/TransactionFeeDrawer";

import walletIcon from "../../assets/wallet.svg";
import gameIcon from "../../assets/wallet/game.png";

import WalletStyle from "../../styles/WalletStyles";

import { IChain } from "../../types/walletTypes";
import { walletType } from "../../types/settingTypes";

const WalletBuyGame = () => {
  const { t } = useTranslation();
  const classname = WalletStyle();

  const chainStore: IChain = useSelector(getChain);
  const data: walletType = useSelector(selectWallet);

  const [chooseChainView, setChooseChainView] = useState<boolean>(false);
  const [transactionFeeView, setTransactionFeeView] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState("");

  return (
    <>
      <Grid container spacing={"32px"}>
        <Grid item xs={12} md={7}>
          <Grid container justifyContent={"right"}>
            <Box className="wallet-form-card br-16" padding={"32px 56px"} width={"592px"}>
              <Box className="fs-h2 white" mb="32px">
                {t("wal-38_payment")}
              </Box>
              <Stack height={"145px"}>
                <Box className={"wallet-form-card-hover p-24-16 br-16"} mb={"32px"} onClick={() => setChooseChainView(true)}>
                  <Stack direction="row" alignItems={"center"} spacing={"16px"}>
                    <Box component={"img"} src={chainStore.chain.logo} width={"36px"} height={"36px"} />
                    <Stack>
                      <Stack direction={"row"} spacing={"10px"}>
                        <Box className={"fs-18-regular light"}>{t("wal-8_from")}</Box>
                        <Box className={"fs-18-regular white"}>{chainStore.chain.name}</Box>
                      </Stack>
                      <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                        <Box component={"img"} src={walletIcon} width={"12px"} height={"12px"} />
                        <Box className={"fs-16-regular light"}>{chainStore.chain.wallet}</Box>
                      </Stack>
                      <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                        <Box className="fs-14-regular light">{t("wal-39_balance")}</Box>
                        <Box className="fs-14-regular light">{chainStore.chain.balance.toString()}</Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>

              <Box className={"wallet-form-card p-16-16 br-16"} mb={"32px"}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box className={"fs-16-regular light"}>{t("wal-13_trans-fee")}</Box>
                  <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                    <Box className={"fs-16-regular white"}>{data.fee}</Box>
                    <IconButton className="icon-button">
                      <EditOutlinedIcon className="icon-button" onClick={() => setTransactionFeeView(true)} />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
              <Box mb={"32px"}>
                <InputText
                  id="paste-mnemonic"
                  type="mnemonic"
                  label={t("ncl-13_paste-mnemonic")}
                  value={mnemonic}
                  setValue={setMnemonic}
                  onIconButtonClick={() => {
                    navigator.clipboard.writeText(mnemonic);
                  }}
                />
              </Box>
              <Button className="red-button fw">{t("wal-34_approve")}</Button>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container justifyContent={"left"}>
            <Box className="wallet-form-card br-16" padding={"24px 16px"} width={"426px"}>
              <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mb={"15px"}>
                <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                  <Box component={"img"} src={gameIcon} width="90px" height="56px" />
                  <Stack spacing={"8px"}>
                    <Box className="fs-20-regular white">Starlight Odyssey</Box>
                    <Box>
                      {Chains.map((item, index) => (
                        <Tooltip title={<Box className="fs-18-regular">{item.name}</Box>} placement="top">
                          <img
                            src={item.icon}
                            key={index}
                            className={classname.wrap_imgs}
                            style={{
                              cursor: "pointer",
                              width: "16px",
                              height: "16px",
                              marginLeft: index === 0 ? "0px" : "-5px",
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Stack>
                </Stack>
                <IconButton className="icon-button">
                  <DeleteOutlineIcon className="icon-button" />
                </IconButton>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"} mb={"15px"}>
                <Box className="fs-14-regular light">{t("wal-40_price")}</Box>
                <Stack spacing={"8px"}>
                  <Box className="fs-14-regular white t-left">12 SXP</Box>
                  <Box className="fs-14-regular light t-left">$ 123.00</Box>
                </Stack>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={"15px"}>
                <Box className="fs-14-regular light">{t("wal-41_sale-discount")}</Box>
                <Box
                  className="fs-14-regular white"
                  sx={{
                    backgroundColor: "rgba(255, 0, 0, 0.40)",
                    borderRadius: "8px",
                    padding: "4px 4px",
                  }}
                >
                  -10%
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={"15px"}>
                <Box className="fs-14-regular light">{t("set-55_transaction-fee")}</Box>
                <Box className="fs-14-regular white">0.05%</Box>
              </Stack>
              <Divider
                sx={{
                  backgroundColor: "#FFFFFF1A",
                  marginBottom: "15px",
                }}
              />
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Box className="fs-14-regular white">{t("wal-42_subtotal")}</Box>
                <Box className="fs-14-regular white">11.04 SXP</Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <ChooseChainDrawer view={chooseChainView} setView={setChooseChainView} />
      <TransactionFeeDrawer view={transactionFeeView} setView={setTransactionFeeView} />
    </>
  );
};

export default WalletBuyGame;
