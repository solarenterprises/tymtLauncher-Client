import { useDispatch, useSelector } from "react-redux";
import { getTempNonCustodial, setTempNonCustodial } from "../../features/account/TempNonCustodialSlice";
import { IconButton, Tooltip, Box, Stack } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MnemonicWord from "./MnemonicWord";
import { getMnemonic } from "../../consts/mnemonics";
import { nonCustodialType } from "../../types/accountTypes";
import { useTranslation } from "react-i18next";

interface props {
  editable: boolean;
}

const MnemonicPad = ({ editable }: props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);
  const mnemonicString = tempNonCustodialStore.mnemonic;
  const mnemonic = mnemonicString.toString().split(" ");

  const copyMnemonicToClipboard = () => {
    navigator.clipboard.writeText(tempNonCustodialStore.mnemonic);
  };

  return (
    <div
      style={{
        border: "1px solid rgb(23, 32, 33)",
        borderRadius: "16px",
        padding: "8px",
      }}
    >
      {editable && (
        <div
          style={{
            width: "488px",
            display: "flex",
            justifyContent: "flex-end",
            padding: "0px 16px",
          }}
        >
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
                <Box className="fs-16-regular white">{t("ncca-16_regenerate")}</Box>
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
            <IconButton
              className={"icon-button"}
              onClick={() => {
                dispatch(
                  setTempNonCustodial({
                    ...tempNonCustodialStore,
                    mnemonic: getMnemonic(tempNonCustodialStore.mnemonicLength),
                  })
                );
              }}
            >
              <LoopIcon className={"icon-button"} />
            </IconButton>
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
                <Box className="fs-16-regular white">{t("ncca-57_copy")}</Box>
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
            <IconButton className={"icon-button"} onClick={copyMnemonicToClipboard}>
              <ContentCopyIcon className={"icon-button"} />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"1"} word={mnemonic[0]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"2"} word={mnemonic[1]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"3"} word={mnemonic[2]} />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"4"} word={mnemonic[3]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"5"} word={mnemonic[4]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"6"} word={mnemonic[5]} />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"7"} word={mnemonic[6]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"8"} word={mnemonic[7]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"9"} word={mnemonic[8]} />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"10"} word={mnemonic[9]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"11"} word={mnemonic[10]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicWord number={"12"} word={mnemonic[11]} />
        </div>
      </div>
      {tempNonCustodialStore.mnemonicLength === 24 && (
        <>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"13"} word={mnemonic[12]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"14"} word={mnemonic[13]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"15"} word={mnemonic[14]} />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"16"} word={mnemonic[15]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"17"} word={mnemonic[16]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"18"} word={mnemonic[17]} />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"19"} word={mnemonic[18]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"20"} word={mnemonic[19]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"21"} word={mnemonic[20]} />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"22"} word={mnemonic[21]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"23"} word={mnemonic[22]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicWord number={"24"} word={mnemonic[23]} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MnemonicPad;
