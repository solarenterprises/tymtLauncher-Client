import { Box, Stack, Modal, CircularProgress, Button, Tooltip, Fade } from "@mui/material";
import arrowIcon from "../../assets/account/blue-arrow-right.svg";
import closeIcon from "../../assets/settings/x-icon.svg";
import { IChain } from "../../types/walletTypes";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getChain } from "../../features/wallet/ChainSlice";
import TransactionProviderAPI from "../../lib/api/TransactionProviderAPI";
import { useTranslation } from "react-i18next";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
  handleRejectClick: () => void;
  switchChain: () => Promise<void>;
  chain: string;
}
const SwitchChainModal = ({ open, setOpen, handleRejectClick, switchChain, chain }: props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const chainStore: IChain = useSelector(getChain);

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
                    <Box className="fs-12-regular white">{chainStore.chain.name}</Box>
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
                  <img width={48} src={chainStore.chain.logo} />
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
