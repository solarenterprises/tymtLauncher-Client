import { useCallback } from "react";
import { save } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { emit } from "@tauri-apps/api/event";

import { TauriEventNames } from "../../consts/TauriEventNames";

import CopyIconButton from "../home/CopyIconButton";
import ExportIconButton from "../home/ExportIconButton";
import MnemonicWord from "./MnemonicWord";

import { INotificationParams } from "../../types/NotificationTypes";

export interface IPropsMnemonicRevealPad {
  passphrase: string;
  blur?: boolean;
  setBlur?: (_: boolean) => void;
}

const MnemonicRevealPad = ({ passphrase, blur, setBlur }: IPropsMnemonicRevealPad) => {
  const mnemonic = passphrase?.split(" ");

  const copyMnemonicToClipboard = useCallback(() => {
    navigator.clipboard.writeText(passphrase);
  }, [passphrase]);

  const saveFile = async () => {
    if (passphrase) {
      const filepath = await save({
        defaultPath: "tymt_passphrase.txt",
        filters: [{ name: "Text Files", extensions: ["txt"] }],
      });
      if (filepath) {
        const content = passphrase;
        console.log(filepath);
        try {
          await invoke("write_file", { content, filepath });
          console.log("File saved at:", filepath);
          const noti_0: INotificationParams = {
            status: "success",
            title: `Success`,
            message: `Passphrase has been exported!`,
            link: null,
            translate: true,
          };
          emit(TauriEventNames.NOTIFICATION, noti_0);
        } catch (error) {
          console.error("Error saving file:", error);
          const noti_0: INotificationParams = {
            status: "failed",
            title: `Error`,
            message: error.toString(),
            link: null,
            translate: true,
          };
          emit(TauriEventNames.NOTIFICATION, noti_0);
        }
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgb(23, 32, 33)",
        borderRadius: "16px",
        padding: "8px",
        margin: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "4px",
        }}
      >
        <ExportIconButton onClick={saveFile} />
        <CopyIconButton onClick={copyMnemonicToClipboard} />
      </div>
      <div
        style={{
          filter: blur ? "blur(5px)" : "none",
        }}
        onClick={() => {
          if (passphrase && blur) {
            setBlur(false);
            setTimeout(() => {
              setBlur(true);
            }, 10 * 1e3);
          }
        }}
      >
        <div
          style={{
            width: "436px",
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
            width: "436px",
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
            width: "436px",
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
            width: "436px",
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
        {mnemonic.length === 24 && (
          <>
            <div
              style={{
                width: "436px",
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
                width: "436px",
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
                width: "436px",
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
                width: "436px",
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
    </div>
  );
};

export default MnemonicRevealPad;
