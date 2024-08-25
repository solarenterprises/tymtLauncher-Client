import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { Grid, Box, Stack, Divider } from "@mui/material";

import AccountNextButton from "../../components/account/AccountNextButton";
import AccountHeader from "../../components/account/AccountHeader";
import SignModeButton from "../../components/account/SignModeButton";

import tymt1 from "../../assets/account/tymt1.png";

import GuestIcon from "../../assets/account/Guest.svg";
import ImportIcon from "../../assets/account/Import.svg";
import CreateAccountForm from "../../components/account/CreateAccountForm";
import OrLine from "../../components/account/OrLine";
import AuthIconButtons from "../../components/account/AuthIconButtons";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignSelf: "center",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    container
                    sx={{
                      width: "520px",
                      padding: "10px 0px",
                    }}
                  >
                    <Grid item xs={12}>
                      <AccountHeader title={"Hello!"} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                        <SignModeButton icon={GuestIcon} text={"Play as a guest"} onClick={() => navigate("/home")} />
                        <SignModeButton icon={ImportIcon} text={"Import wallet"} onClick={() => navigate("/non-custodial/login/2")} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <CreateAccountForm />
                    </Grid>
                    <Grid item xs={12} mt={"24px"}>
                      <AccountNextButton
                        text={"Next"}
                        onClick={() => {
                          navigate("/non-custodial/signup/2");
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <OrLine />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <AuthIconButtons />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt1}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default Welcome;
