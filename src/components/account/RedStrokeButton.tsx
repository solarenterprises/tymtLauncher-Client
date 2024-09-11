import { Button } from "@mui/material";

export interface IPropsRedStrokeButton {
  text: string;
  onClick?: () => void;
  isSubmit?: boolean;
}

const RedStrokeButton = ({ text, onClick, isSubmit }: IPropsRedStrokeButton) => {
  return (
    <Button onClick={onClick ? onClick : () => {}} className="red-border-button" type={isSubmit ? "submit" : undefined}>
      {text}
    </Button>
  );
};

export default RedStrokeButton;
