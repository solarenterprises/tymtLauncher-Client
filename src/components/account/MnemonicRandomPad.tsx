import { useSelector } from "react-redux";
import { getTempNonCustodial } from "../../features/account/TempNonCustodialSlice";
import MnemonicRandomWord from "./MnemonicRandomWord";
import { nonCustodialType } from "../../types/accountTypes";
import { shuffleArray } from "../../consts/mnemonics";

export interface IPropsMnemonicRandomPad {
  passphrase: string;
}

const MnemonicRandomPad = ({ passphrase }: IPropsMnemonicRandomPad) => {
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);

  const temp = passphrase.split(" ");
  const mnemonic = shuffleArray(temp);

  return (
    <div
      style={{
        border: "1px solid rgb(23, 32, 33)",
        borderRadius: "16px",
        padding: "8px",
      }}
    >
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"1"} word={mnemonic[0]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"2"} word={mnemonic[1]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"3"} word={mnemonic[2]} />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"4"} word={mnemonic[3]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"5"} word={mnemonic[4]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"6"} word={mnemonic[5]} />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"7"} word={mnemonic[6]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"8"} word={mnemonic[7]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"9"} word={mnemonic[8]} />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"10"} word={mnemonic[9]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"11"} word={mnemonic[10]} />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord number={"12"} word={mnemonic[11]} />
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
              <MnemonicRandomWord number={"13"} word={mnemonic[12]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"14"} word={mnemonic[13]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"15"} word={mnemonic[14]} />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"16"} word={mnemonic[15]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"17"} word={mnemonic[16]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"18"} word={mnemonic[17]} />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"19"} word={mnemonic[18]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"20"} word={mnemonic[19]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"21"} word={mnemonic[20]} />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"22"} word={mnemonic[21]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"23"} word={mnemonic[22]} />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord number={"24"} word={mnemonic[23]} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MnemonicRandomPad;
