import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import D53Modal from "./D53Modal";

import { Grid, Box, Stack, Tooltip } from "@mui/material";

import InstallButton from "../store/InstallButton";

import "../../fonts/Cobe/Cobe-Regular.ttf";

import homeStyles from "../../styles/homeStyles";
import districteffect from "../../assets/main/districteffect.svg";
import districteffect1 from "../../assets/main/districteffect1.svg";
import districteffect2 from "../../assets/main/districteffect2.svg";

import { District53 } from "../../lib/game/district 53/District53";

interface props {
  setImage?: (image: any) => void;
}

const District53intro = ({ setImage }: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const homeclasses = homeStyles();
  const [selected, setSelected] = useState(0);
  const [d53Open, setD53Open] = useState<boolean>(false);

  return (
    <div style={{ width: "320px" }}>
      <Grid className={homeclasses.district_content} item xs={12}>
        <img
          src={districteffect}
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
            zIndex: -1,
          }}
        />
        <img
          src={districteffect1}
          style={{
            position: "absolute",
            left: "0px",
            bottom: "0px",
            zIndex: -1,
          }}
        />
        <img
          src={districteffect2}
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            zIndex: -1,
          }}
        />
        <Tooltip
          placement="top"
          title={
            <Stack
              spacing={"10px"}
              sx={{
                marginBottom: "-20px",
                backgroundColor: "rgb(49, 53, 53)",
                padding: "6px 8px",
                borderRadius: "32px",
                border: "1px solid rgb(71, 76, 76)",
              }}
            >
              <Box className="fs-12-regular white">{t("hom-25_click-to-learn")}</Box>
            </Stack>
          }
          PopperProps={{
            sx: {
              [`& .MuiTooltip-tooltip`]: {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            },
          }}
        >
          <Box
            className={"fs-38-bold"}
            sx={{
              color: "white",
              zIndex: 10,
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(`/coming/${District53?._id}`);
            }}
          >
            {t("hom-5_district53")}
          </Box>
        </Tooltip>
        <Box
          className={"fs-16-regular"}
          sx={{
            color: "white",
            textOverflow: "ellipsis",
            overflow: "hidden",
            WebkitLineClamp: 7,
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
          }}
        >
          {t("hom-6_intro")}
        </Box>
        <Grid item xs={12}>
          <Stack direction={"row"} alignItems={"start"} spacing={2} marginTop={"16px"}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <InstallButton game={District53} />
            </Grid>
          </Stack>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "left",
          overflow: "hidden",
        }}
      >
        <Swiper spaceBetween={15} slidesPerView={"auto"} loop={true}>
          {District53?.projectMeta?.gallery?.map((item, index) => (
            <SwiperSlide key={index} style={{ width: "150px" }}>
              {item.type === "image" && (
                <img
                  key={`district53-${index}`}
                  src={item?.src}
                  width={`150px`}
                  height={`120px`}
                  onClick={() => {
                    setSelected(index);
                    setImage(item?.src);
                  }}
                  style={{
                    cursor: "pointer",
                    opacity: selected === index ? 1 : 0.7,
                    border: selected === index ? "2px solid #52e1f2" : "none",
                    borderRadius: "16px",
                    marginRight: "10px",
                  }}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
      <D53Modal open={d53Open} setOpen={setD53Open} />
    </div>
  );
};

export default District53intro;
