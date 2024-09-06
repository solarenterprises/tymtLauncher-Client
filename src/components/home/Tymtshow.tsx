import { useNavigate } from "react-router-dom";
import { Grid, Button, Box, Stack } from "@mui/material";
import { BasicGameList } from "../../lib/game/BasicGameList";

const Tymtshow = ({ image }: any) => {
  const navigate = useNavigate();

  return (
    <div style={{ width: "calc(100% - 353px)" }}>
      <Grid item xs={12}>
        <img
          className="District53"
          src={image}
          width={"100%"}
          style={{
            aspectRatio: "1.78",
            borderRadius: "16px",
            opacity: 1.0,
            flexShrink: 1,
          }}
          loading="lazy"
        />
      </Grid>
      <Grid item xs={12} container spacing={"32px"} mt={"0px"}>
        {BasicGameList?.map((basicGame, index) => (
          <Grid item key={index}>
            <Button
              className="button_gamecontent"
              key={basicGame?.project_name}
              onClick={() => {
                navigate(`/coming/${basicGame?._id}`);
              }}
            >
              <Stack direction={"row"} alignItems={"center"} width={"100%"}>
                <img
                  src={basicGame?.imageUrl}
                  width={"60px"}
                  height={"60px"}
                  style={{
                    borderRadius: "16px",
                    marginLeft: "-2px",
                  }}
                  loading="lazy"
                />
                <Box className={"fs-14-light white t-center"} textTransform={"none"} sx={{ whiteSpace: "nowrap", padding: "0px 20px" }}>
                  {basicGame?.title}
                </Box>
              </Stack>
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Tymtshow;
