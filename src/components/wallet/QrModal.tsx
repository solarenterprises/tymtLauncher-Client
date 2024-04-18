import { Box, Stack, Modal, Tooltip, Button } from "@mui/material";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import closeIcon from "../../assets/settings/x-icon.svg";
import copyIcon from "../../assets/settings/copy-icon.svg";

import { qrModalType } from "../../types/walletTypes";
import SettingStyle from "../../styles/SettingStyle";

const QrModal = ({ data, open, setOpen }: qrModalType) => {
  const { t } = useTranslation();
  const classnames = SettingStyle();
  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <Stack
        direction={"column"}
        alignItems={"center"}
        textAlign={"center"}
        className="modal-content qr-modal"
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ width: "100%" }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            className=""
            gap={"10px"}
          >
            <Box
              component={"img"}
              src={data?.chain.logo}
              width={"32px"}
              height={"32px"}
            />
            <Box className="fs-h3 white">{data?.chain.name}</Box>
          </Stack>
          <Stack
            className="center-align"
            onClick={() => setOpen(false)}
            sx={{ cursor: "pointer" }}
          >
            <img src={closeIcon} />
          </Stack>
        </Stack>
        <Stack
          className="qr-container"
          direction={"column"}
          alignItems={"center"}
          textAlign={"center"}
        >
          <Box className="center-align" sx={{ width: "150px" }}>
            <QRCode
              size={50}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={data?.chain.wallet}
              viewBox={`transparent`}
            />
          </Box>
          <Stack direction={"row"} className="qr-container" gap={"10px"}>
            <Stack direction={"column"} textAlign={"left"}>
              <Box className="fs-14-light light">{t("set-67_address")}</Box>
              <Box className="fs-14-regular qr-address">
                {data?.chain.wallet}
              </Box>
            </Stack>

            <Button
              className="center-align tooltip-btn"
              sx={{ cursor: "pointer", display: "flex" }}
              onClick={() => navigator.clipboard.writeText(data?.chain.wallet)}
            >
              <Tooltip
                title={t("set-79_copy-address")}
                classes={{ tooltip: classnames.tooltip }}
              >
                <img src={copyIcon} />
              </Tooltip>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default QrModal;
