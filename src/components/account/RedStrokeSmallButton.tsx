import { Button } from "@mui/material";

export interface IPropsRedStrokeButton {
  text: string;
  onClick: () => void;
}

const RedStrokeSmallButton = ({ text, onClick }: IPropsRedStrokeButton) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        padding: "5px 6px",
        color: "#52e1f2",
        fontFamily: "Cobe",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        borderRadius: "12px",
        border: "1px solid #ef4444",
        backgroundColor: "transparent",
        textTransform: "none",
        alignSelf: "flex-end",
        "&:hover": {
          backgroundColor: "#992727",
          border: "1px solid #992727",
          color: "white",
        },
        "&.Mui-disabled": {
          border: "1px solid #2a2525",
          color: "#7c7c7c",
        },
      }}
    >
      {text}
    </Button>
  );
};

export default RedStrokeSmallButton;
