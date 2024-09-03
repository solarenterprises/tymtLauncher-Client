import { useSelector, useDispatch } from "react-redux";
import { getThreeConfirm, setThreeConfirm } from "../../features/account/ThreeConfirmSlice";
import { Box, Stack } from "@mui/material";
import { threeConfirmType } from "../../types/accountTypes";

interface props {
  number?: string;
  word?: string;
}

const MnemonicRandomWord = ({ number, word }: props) => {
  const dispatch = useDispatch();
  const threeConfirmStore: threeConfirmType = useSelector(getThreeConfirm);
  return (
    <Box
      className="mnemonic-word-box"
      onClick={() => {
        threeConfirmStore.focus === 1
          ? dispatch(
              setThreeConfirm({
                ...threeConfirmStore,
                first: word,
                focus: 2,
              })
            )
          : threeConfirmStore.focus === 2
          ? dispatch(
              setThreeConfirm({
                ...threeConfirmStore,
                second: word,
                focus: 3,
              })
            )
          : threeConfirmStore.focus === 3
          ? dispatch(
              setThreeConfirm({
                ...threeConfirmStore,
                third: word,
                focus: 0,
              })
            )
          : {};
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
        <Box className={"fs-18-regular white"}>{word}</Box>
      </Stack>
    </Box>
  );
};

export default MnemonicRandomWord;
