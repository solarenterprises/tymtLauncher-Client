import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken, ITymt } from "../../types/accountTypes";
import Tymtshow from "../../components/home/Tymtshow";
import Bottom from "../../components/home/Bottom";
import ComingsoonD53 from "../../components/home/ComingSoon-D53";
import District53intro from "../../components/home/District53intro";
import RecentlyAddedD53 from "../../components/home/RecentlyAdded";
import UpdateModal from "../../components/home/UpdateModal";
import { getTymt } from "../../features/account/TymtSlice";
import { getSaltToken } from "../../features/account/SaltTokenSlice";
import AnimatedComponent from "../../components/AnimatedComponent";
import { District53 } from "../../lib/game/district 53/District53";

const Homepage = () => {
  const [image, setImage] = useState<string>(District53?.imageUrl);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const tymtStore: ITymt = useSelector(getTymt);
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const result = await axios.get(`${tymt_backend_url}/releases`, {
        headers: {
          "x-token": saltTokenStore.token,
        },
      });
      if (Number(result.data.result.data[0].versionNumber) > Number(tymtStore.version)) {
        setUpdateModal(true);
      }
    };
    init();
  }, []);

  return (
    <>
      <AnimatedComponent>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Tymtshow image={image} />
          <District53intro setImage={setImage} />
        </Grid>
      </AnimatedComponent>
      <Grid container sx={{ marginTop: "80px" }}>
        <AnimatedComponent>
          <RecentlyAddedD53 />
        </AnimatedComponent>
        <AnimatedComponent>
          <ComingsoonD53 />
        </AnimatedComponent>
        <AnimatedComponent>
          <Bottom />
        </AnimatedComponent>
      </Grid>
      <UpdateModal open={updateModal} setOpen={setUpdateModal} />
    </>
  );
};

export default Homepage;
