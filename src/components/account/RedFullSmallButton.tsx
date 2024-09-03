import { Button } from "@mui/material";

export interface IPropsRedStrokeButton {
  text: string;
  onClick: () => void;
}

const RedFullSmallButton = ({ text, onClick }: IPropsRedStrokeButton) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        padding: "5px 6px",
        color: "white",
        fontFamily: "Cobe",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        borderRadius: "12px",
        backgroundColor: "#ef4444",
        textTransform: "none",
        alignSelf: "flex-end",
        "&:hover": {
          backgroundColor: "#992727",
        },
        "&.Mui-disabled": {
          backgroundColor: "#2a2525",
          color: "#7c7c7c",
        },
      }}
    >
      {text}
    </Button>
  );
};

export default RedFullSmallButton;
