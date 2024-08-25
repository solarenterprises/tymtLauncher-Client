import { Box, Stack } from "@mui/material";
import InputText from "./InputText";
import IAgreeTerms from "./IAgreeTerms";

const CreateAccountForm = () => {
  return (
    <>
      <Stack gap={"24px"}>
        <Box className="fs-24-regular white">Create account</Box>
        <InputText id="password" label="Password" type="password" />
        <InputText id="repeat-password" label="Repeat Password" type="password" />
        <IAgreeTerms />
      </Stack>
    </>
  );
};

export default CreateAccountForm;
