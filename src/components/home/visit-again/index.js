import { alpha, useMediaQuery, useTheme, Card, Skeleton, Box, Grid, Typography } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import React, { useState } from "react";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
  CustomBoxFullWidth,
} from "styled-components/CustomStyles.style";
import VisitAgainCard from "../../cards/VisitAgainCard";
import CustomContainer from "../../container";
import MarketplaceSectionHeader from "../MarketplaceSectionHeader";
import { moduleSectionStackSx } from "../homeSectionRhythm";
import { createEnhancedArrows } from "../../common/EnhancedSliderArrows";

const VisitAgainShimmerCard = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        background: theme.palette.neutral[100],
        padding: "10px",
        width: "100%",
        maxWidth: { md: "280px" },
      }}
    >
      <Box
        sx={{
          borderRadius: "2px",
          position: "relative",
          height: { xs: "100px", md: "132px" },
          width: "100%",
        }}
      >
        <Skeleton
          variant="rectangular"
          height="100%"
          width="100%"
          sx={{ borderRadius: "2px" }}
        />
      </Box>
      <CustomBoxFullWidth sx={{ mt: "10px" }}>
        <Grid container spacing={1.5}>
          <Grid item xs={8.5} md={9}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="100%" height={40} />
          </Grid>
          <Grid item xs={3.5} md={3}>
            <Skeleton variant="text" width="100%" height={20} />
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </Card>
  );
};

const VisitAgain = ({ configData, visitedStores, isVisited, isLoading, isFetching }) => {
  const theme = useTheme();
  const token = getToken();
  const isSmallScreen = useMediaQuery('(min-width:600px)');
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const loading = isLoading || isFetching;

  const stripBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.neutral[400], 0.22);

  const getModuleWiseData = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent purchase from the shop you recently ordered",
          bgColor: stripBg,
        };
      case ModuleTypes.PHARMACY:
        return {
          mainPosition: !isVisited ? "flex-start" : "center",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent medicine from the store you recently ordered",
          bgColor: stripBg,
        };
      case ModuleTypes.ECOMMERCE:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent purchase from the shop you recently ordered",
          bgColor: theme.palette.background.paper,
        };
      case ModuleTypes.FOOD:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Wanna Try  Again!!" : "Whats New",
          subHeading:
            "Get your recent food from the restaurant you recently ordered",
          bgColor: stripBg,
        };
    }
  };
  // Don't render the section if not loading and no visited stores
  if (!loading && (!visitedStores || visitedStores.length === 0) && !token) {
    return null;
  }

  // Enhanced slider settings with hover arrows
  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: true,
      variant: "white"
    }),
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2.7,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.15,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.05,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  return (
    <>
      <CustomStackFullWidth
        sx={moduleSectionStackSx}
        mt={isSmallScreen ? "2px" : "16px"}
        spacing={{ xs: 2, md: 1 }}
        paddingX={{ xs: 2, md: 0 }}
      >
        {isSmallScreen ? (
          <CustomContainer>
            <MarketplaceSectionHeader
              title={getModuleWiseData?.()?.heading}
              subtitle={isVisited ? getModuleWiseData?.()?.subHeading : undefined}
              mb={0}
            />
          </CustomContainer>
        ) : (
          <MarketplaceSectionHeader
            title={getModuleWiseData?.()?.heading}
            subtitle={isVisited ? getModuleWiseData?.()?.subHeading : undefined}
            mb={0}
          />
        )}
        <SliderCustom
          nopadding="true"
          sx={{
            backgroundColor: getModuleWiseData?.()?.bgColor,
            borderRadius: "2px",
            border: (th) =>
              `1px solid ${alpha(th.palette.divider, th.palette.mode === "dark" ? 0.12 : 0.18)}`,
            padding: { xs: "12px 8px", md: "20px 16px" },
            minHeight: "200px",
            boxShadow:
              theme.palette.mode === "light"
                ? `0 1px 3px ${alpha(theme.palette.neutral[900], 0.06)}`
                : "none",
          }}
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
        >
          <Slider {...enhancedSettings}>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <VisitAgainShimmerCard key={index} />
              ))
            ) : (
              visitedStores?.map((item, index) => {
                return (
                  <Box key={item?.id ?? index} sx={{ height: "100%" }}>
                    <VisitAgainCard
                      item={item}
                      configData={configData}
                      isVisited={isVisited}
                    />
                  </Box>
                );
              })
            )}
          </Slider>
        </SliderCustom>
      </CustomStackFullWidth>
    </>
  );
};

VisitAgain.propTypes = {};

export default VisitAgain;
