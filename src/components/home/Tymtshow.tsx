import { useNavigate } from "react-router-dom";

import { Grid, Button, Box, Stack } from "@mui/material";

import Games from "../../lib/game/Game";

const Tymtshow = ({ image }: any) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={8} container>
      <Grid item xs={12}>
        <img
          className="District53"
          src={image}
          width={"100%"}
          style={{
            aspectRatio: "1.78",
            borderRadius: "16px",
            opacity: 0.8,
            flexShrink: 1,
          }}
          loading="lazy"
        />
      </Grid>
      <Grid item xs={12} container spacing={"32px"} mt={"0px"}>
        {Object.keys(Games).map((rowKey) => (
          <Grid item>
            <Button
              className="button_gamecontent"
              key={Games[rowKey].name}
              onClick={() => {
                navigate(`/store/${rowKey}`);
              }}
            >
              <Stack direction={"row"} alignItems={"center"} width={"100%"}>
                <img
                  src={Games[rowKey].card}
                  width={"60px"}
                  height={"60px"}
                  style={{
                    borderRadius: "16px",
                    marginLeft: "-2px",
                  }}
                  loading="lazy"
                />
                <Box
                  className={"fs-14-light white t-center"}
                  textTransform={"none"}
                  sx={{ whiteSpace: "nowrap", padding: "0px 20px" }}
                >
                  {Games[rowKey].name}
                </Box>
              </Stack>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Tymtshow;


