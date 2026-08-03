import { Stack, alpha, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import CustomContainer from "../container";
import NextImage from "components/NextImage";

const Banners = ({ promotionalBanner, isSmall, feature }) => {
  const theme = useTheme();
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTabletView = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const isDesktopStackedPreview =
    !isSmall && isLargeDesktop && promotionalBanner?.length > 2;

  const getBannerSrc = (bannerItem) =>
    typeof bannerItem === "string" ? bannerItem : bannerItem?.img;

  useEffect(() => {
    if (!isDesktopStackedPreview || !promotionalBanner?.length) return undefined;
    const intervalId = setInterval(() => {
      setActiveStackIndex((prev) => (prev + 1) % promotionalBanner.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isDesktopStackedPreview, promotionalBanner?.length]);

  const getStackLayer = (index) => {
    const total = promotionalBanner?.length || 0;
    if (!total) return "hidden";

    const prevIndex = (activeStackIndex - 1 + total) % total;
    const nextIndex = (activeStackIndex + 1) % total;

    if (index === activeStackIndex) return "front";
    if (index === prevIndex) return "back-left";
    if (index === nextIndex) return "back-right";
    return "hidden";
  };
  const infiniteManage = () => {
    if (isSmall) {
      if (promotionalBanner?.length === 1) {
        return false;
      } else {
        return true;
      }
    } else if (isTabletView) {
      return promotionalBanner?.length > 1;
    } else {
      if (promotionalBanner?.length > 3) {
        return true;
      } else {
        return false;
      }
    }
  };

  const slidesToShowManage = () => {
    if (isSmall) {
      return 1;
    } else if (isTabletView) {
      return promotionalBanner?.length > 1 ? 2 : 1;
    } else {
      if (isDesktopStackedPreview) {
        return 3;
      }
      if (promotionalBanner?.length > 2) {
        return 2;
      } else if (promotionalBanner?.length === 2) {
        return 2;
      } else {
        return 1;
      }
    }
  };
  const twoItemManage = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        flexDirection="row"
        gap="20px"
      >
        {/* <Grid container spacing={2}> */}
        {promotionalBanner?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                border: (theme) =>
                  `0.828571px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                position: "relative",

                width: { sm: "100%", md: "590px" },
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "3/1",
                "img": {
                  height: "100%",
                  maxWidth: "100%",
                  width: "100%",


                  // border: "1px solid"
                }
              }}
            >
              <NextImage
                src={item}
                alt="banners"
                height={173}
                width={590}
                objectFit="cover"
                borderRadius="20px"
                aspectRatio="3/1"
              />
            </Box>
          );
        })}
      </CustomStackFullWidth>
    );
  };
  const sliderManage = () => {
    return (
      <SliderCustom
        sx={{
          "& .slick-slider": {
            ...(isDesktopStackedPreview && {
              overflow: "visible",
              padding: "10px 0",
            }),
            "& .slick-slide": {
              ...(isDesktopStackedPreview && {
                transition: "transform 0.35s ease, opacity 0.35s ease",
                opacity: 0.6,
                transform: "scale(0.9)",
              }),
              "img": {
                width: "100%",
              }
            },
            ...(isDesktopStackedPreview && {
              "& .slick-current": {
                opacity: 1,
                transform: "scale(1)",
                zIndex: 2,
              },
            }),
          },
        }}
      >
        <Slider {...settings}>
          {promotionalBanner?.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  border: (theme) =>
                    `0.828571px solid ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  position: "relative",

                  width: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  aspectRatio: "3/1",
                  "img": {
                    height: "100%",
                    maxWidth: "100%",
                    width: "100%",


                    // border: "1px solid"
                  }
                }}
              >
                <NextImage
                  src={item}
                  alt="banners"
                  height={200}
                  width={590}
                  objectFit="cover"
                  borderRadius="20px"

                />
              </Box>
            );
          })}
        </Slider>
      </SliderCustom>
    );
  };

  const desktopStackedManage = () => {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "980px",
          mx: "auto",
          height: { md: 235, lg: 265 },
          position: "relative",
          overflow: "visible",
        }}
      >
        {promotionalBanner?.map((item, index) => {
          const layer = getStackLayer(index);
          const src = getBannerSrc(item);
          const isFront = layer === "front";
          const isClickableLayer = layer === "back-left" || layer === "back-right";
          const layerSx =
            layer === "back-left"
              ? {
                  top: 12,
                  left: "50%",
                  transform: "translateX(-94%) scale(0.88)",
                  opacity: 0.72,
                  zIndex: 1,
                  filter: "brightness(0.96)",
                }
              : layer === "back-right"
                ? {
                    top: 12,
                    left: "50%",
                    transform: "translateX(-6%) scale(0.88)",
                    opacity: 0.72,
                    zIndex: 1,
                    filter: "brightness(0.96)",
                  }
                : layer === "front"
                  ? {
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%) scale(1)",
                      opacity: 1,
                      zIndex: 3,
                      filter: "none",
                    }
                  : {
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%) scale(0.84)",
                      opacity: 0,
                      zIndex: 0,
                      filter: "brightness(0.95)",
                    };

          return (
            <Box
              key={`stacked-banner-${index}`}
              onClick={() => {
                if (layer !== "hidden") {
                  setActiveStackIndex(index);
                }
              }}
              sx={{
                position: "absolute",
                width: { md: "72%", lg: "74%" },
                border: (theme) =>
                  `0.828571px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "3/1",
                boxShadow: isFront
                  ? "0 16px 34px rgba(15, 23, 42, 0.22)"
                  : "0 8px 22px rgba(15, 23, 42, 0.12)",
                transition:
                  "transform 850ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease, top 850ms ease, box-shadow 850ms ease, filter 850ms ease",
                pointerEvents: layer === "hidden" ? "none" : "auto",
                cursor: isClickableLayer ? "pointer" : isFront ? "default" : "pointer",
                ...layerSx,
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              }}
            >
              <NextImage
                src={src}
                alt={`banner-${index}`}
                height={220}
                width={740}
                objectFit="cover"
                borderRadius="20px"
              />
            </Box>
          );
        })}
      </Box>
    );
  };
  const settings = {
    dots: false,
    infinite: infiniteManage(),
    slidesToShow: slidesToShowManage(),
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    ...(isDesktopStackedPreview && {
      centerMode: true,
      centerPadding: "0px",
    }),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const singleImageManage = () => {
    return (
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            position: "relative",

            borderRadius: "5px",
            width: "100%",
            aspectRatio: "3/1",
            "img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // border: "1px solid"
            }
          }}
        >
          <NextImage
            src={promotionalBanner[0]?.img}
            alt="banners"
            height={175}
            width={1250}
            objectFit="cover"
            borderRadius="5px"

          />
        </Box>
      </Stack>
    );
  };
  const handleContent = () => {
    if (isSmall) {
      if (promotionalBanner?.length === 1) {
        return <>{singleImageManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    } else {
      if (promotionalBanner?.length === 1) {
        return <>{singleImageManage()}</>;
      } else if (promotionalBanner?.length === 2) {
        return <>{twoItemManage()}</>;
      } else if (isDesktopStackedPreview) {
        return <>{desktopStackedManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    }
  };
  return (
    <CustomContainer>
      <Stack sx={{ marginY: isSmall ? "22px" : "40px" }}>
        {handleContent()}
      </Stack>
    </CustomContainer>
  );
};

export default Banners;
