import { Box, Stack } from "@mui/material";

interface props {
  number?: string;
  word?: string;
  focus?: boolean;
}

const MnemonicWord = ({ number, word, focus }: props) => {
  return (
    <Box
      className={focus ? "mnemonic-word-box-focus" : "mnemonic-word-box"}
      sx={{
        transition: "all 0.3s ease",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          width: "100%",
          padding: "8px 16px",
        }}
        spacing={"8px"}
      >
        <Box className={"fs-16-regular light"}>{number}</Box>
        <Box className={"fs-14-regular white"}>{word}</Box>
      </Stack>
    </Box>
  );
};

export default MnemonicWord;
