import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Box, Stack, Modal, CircularProgress, Button, Tooltip, Fade } from "@mui/material";

import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";

import TransactionProviderAPI from "../../lib/api/TransactionProviderAPI";

import { getSupportChainByName } from "../../lib/helper/WalletHelper";

import arrowIcon from "../../assets/account/blue-arrow-right.svg";
import closeIcon from "../../assets/settings/x-icon.svg";

import { ICurrentChain, ISupportChain } from "../../types/walletTypes";

export interface IPropsSwitchChainModal {
  open: boolean;
  setOpen: (status: boolean) => void;
  handleRejectClick: () => void;
  switchChain: () => Promise<void>;
  chain: string;
}

const SwitchChainModal = ({ open, setOpen, handleRejectClick, switchChain, chain }: IPropsSwitchChainModal) => {
  const { t } = useTranslation();

  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);

  const currentSupportChain: ISupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);

  const [loading, setLoading] = useState<boolean>(false);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => {
        setOpen(false);
        handleRejectClick();
      }}
      sx={{
        backdropFilter: "blur(4px)",
        zIndex: "200",
      }}
    >
      <Fade in={open}>
        <Box className="modal-content oauth-modal">
          <img
            src={closeIcon}
            alt="close icon"
            className="close-icon"
            onClick={() => {
              setOpen(false);
              handleRejectClick();
            }}
          />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Stack direction={"row"} className="oauth-container m-tb-20">
              <Tooltip
                placement="bottom"
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
                    <Box className="fs-12-regular white">{currentSupportChain?.chain?.name}</Box>
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
                <Box className="center-align">
                  <img width={48} src={currentSupportChain?.chain?.logo} />
                </Box>
              </Tooltip>
              <Box className="center-align">
                <img src={arrowIcon} />
              </Box>
              <Tooltip
                placement="bottom"
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
                    <Box className="fs-12-regular white">{TransactionProviderAPI.getChainName(chain)}</Box>
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
                <Box className="center-align">
                  <img width={48} src={TransactionProviderAPI.getChainIcon(chain)} />
                </Box>
              </Tooltip>
            </Stack>
            <Button
              fullWidth
              type="submit"
              className="red-button"
              onClick={async () => {
                setLoading(true);
                await switchChain();
                setLoading(false);
                setOpen(false);
              }}
            >
              {!loading && <Box className={"fs-16-regular"}>{t("wal-70_switch-network")}</Box>}
              {loading && (
                <CircularProgress
                  sx={{
                    color: "#F5EBFF",
                  }}
                />
              )}
            </Button>
            <Button
              fullWidth
              onClick={() => {
                setOpen(false);
                handleRejectClick();
              }}
              className="red-border-button"
            >
              <Box className={"fs-16-regular"}>{t("wal-65_reject")}</Box>
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SwitchChainModal;
