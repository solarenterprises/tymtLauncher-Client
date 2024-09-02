import { Button } from "@mui/material";

export interface IPropsRedStrokeButton {
  text: string;
  onClick: () => void;
}

const RedStrokeButton = ({ text, onClick }: IPropsRedStrokeButton) => {
  return (
    <Button onClick={onClick} className="red-border-button">
      {text}
    </Button>
  );
};

export default RedStrokeButton;
