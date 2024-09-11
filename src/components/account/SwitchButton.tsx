import { Stack, Box, Button } from "@mui/material";

import storeStyles from "../../styles/StoreStyles";

export interface IPropsSwitchButton {
  currentIndex: number;
  setCurrentIndex: (_: number) => void;
  texts: string[];
}

const SwitchButton = ({ currentIndex, setCurrentIndex, texts }: IPropsSwitchButton) => {
  const classes = storeStyles();

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"2px"}
      sx={{
        padding: "2px",
        borderRadius: "16px",
        gap: "2px",
        border: "1px solid",
        borderColor: "#FFFFFF1A",
        background: "#0B1718",
      }}
    >
      {texts?.map((text, index) => (
        <Button
          key={`${index}-${text}`}
          className={classes.library_switch_button}
          onClick={() => {
            setCurrentIndex(index);
          }}
          sx={{
            backgroundColor: currentIndex === index ? "rgba(82, 225, 242, 0.10)" : undefined,
            "&:hover": {
              backgroundColor: currentIndex === index ? "rgba(82, 225, 242, 0.10)" : undefined,
            },
          }}
        >
          <Box className={classes.switch_btn} sx={{ color: currentIndex === index ? "#52E1F2" : "white" }}>
            {text}
          </Box>
        </Button>
      ))}
    </Stack>
  );
};

export default SwitchButton;
