import { Button, CircularProgress } from "@mui/material";

interface props {
  isSubmit?: boolean;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const AccountNextButton = ({ isSubmit, text, onClick, disabled, loading }: props) => {
  return (
    <Button fullWidth className={"red-button"} onClick={onClick} type={isSubmit ? "submit" : undefined} disabled={disabled}>
      {loading && (
        <CircularProgress
          sx={{
            color: "#F5EBFF",
          }}
        />
      )}
      {!loading && text}
    </Button>
  );
};

export default AccountNextButton;
