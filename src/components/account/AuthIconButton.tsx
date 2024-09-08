import { Button, Box } from "@mui/material";

export interface IPropsAuthIconButton {
  icon: string;
}

const AuthIconButton = ({ icon }: IPropsAuthIconButton) => {
  return (
    <>
      <Button
        sx={{
          textTransform: "none",
          width: "56px",
          minWidth: "12px",
          height: "56px",
          border: "1px solid #52E1F233",
          padding: "16px",
          borderRadius: "50ch",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "var(--bg-stroke-white-10-stroke-default, #FFFFFF1A)",
            border: "1px solid #ffffff33",
          },
        }}
      >
        <Box component="img" src={icon} width={"24px"} height={"24px"} />
      </Button>
    </>
  );
};

export default AuthIconButton;
