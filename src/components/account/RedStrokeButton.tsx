import { Button, CircularProgress } from "@mui/material";

export interface IPropsRedStrokeButton {
  text: string;
  onClick?: () => void;
  isSubmit?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const RedStrokeButton = ({ text, onClick, isSubmit, loading, disabled }: IPropsRedStrokeButton) => {
  return (
    <Button onClick={onClick ? onClick : () => {}} className="red-border-button" type={isSubmit ? "submit" : undefined} disabled={disabled || loading}>
      {loading ? (
        <CircularProgress
          size={"24px"}
          sx={{
            color: "#F5EBFF",
          }}
        />
      ) : (
        text
      )}
    </Button>
  );
};

export default RedStrokeButton;
