import { Box } from "@mui/material";

interface props {
  word?: string;
  focus?: boolean;
}

const MnemonicWord = ({ word, focus }: props) => {
  return (
    <Box className={focus ? "mnemonic-word-box-focus" : "mnemonic-word-box"}>
      <Box className={"fs-18-regular white"}>{word}</Box>
    </Box>
  );
};

export default MnemonicWord;
