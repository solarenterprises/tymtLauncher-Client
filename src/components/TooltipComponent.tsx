import { Tooltip, Stack, Box } from "@mui/material";
import { ReactElement } from "react";

export interface IPropsTooltipComponent {
  children: ReactElement<any, any>;
  text: string;
}

const TooltipComponent = ({ children, text }: IPropsTooltipComponent) => {
  return (
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
          <Box className="fs-12-regular white">{text}</Box>
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
      {children}
    </Tooltip>
  );
};

export default TooltipComponent;
