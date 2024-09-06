import { Button } from "@mui/material";

export interface IPropsRedStrokeButton {
  text: string;
  onClick: () => void;
}

const RedFullButton = ({ text, onClick }: IPropsRedStrokeButton) => {
  return (
    <Button className={"red-button"} onClick={onClick}>
      {text}
    </Button>
  );
};

export default RedFullButton;
