import { Box, Stack } from "@mui/material";
import disableStep from "../../assets/account/disable-step.svg";
import enableStep from "../../assets/account/enable-step.svg";

interface props {
  all: number;
  now: number;
  text: string;
}

const Stepper = ({ all, now, text }: props) => {
  const items = Array.from({ length: all });

  return (
    <Stack direction={"row"} alignItems={"center"} padding={"10px"} spacing={"8px"}>
      {all === 0 && (
        <Box
          className={"fs-14-regular white"}
          sx={{
            height: "18px",
            fontFeatureSettings: "'calt' off",
          }}
        >
          {text}
        </Box>
      )}
      {all !== 0 && (
        <>
          <Stack direction={"row"}>
            <Box
              className={"fs-14-regular white"}
              sx={{
                height: "18px",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {now}
            </Box>
            <Box
              className={"fs-14-regular light"}
              sx={{
                height: "18px",
                fontFeatureSettings: "'calt' off",
              }}
            >
              /{all}
            </Box>
          </Stack>
          <Stack direction={"row"}>
            <Box
              className={"fs-14-regular white"}
              sx={{
                height: "18px",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {text}
            </Box>
          </Stack>
          <Stack direction={"row"}>
            {items.map((_value, index) =>
              index === now - 1 ? (
                <Box component={"img"} src={enableStep} width={"20px"} height={"5px"} key={index} />
              ) : (
                <Box component={"img"} src={disableStep} width={"5px"} height={"5px"} key={index} />
              )
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Stepper;
