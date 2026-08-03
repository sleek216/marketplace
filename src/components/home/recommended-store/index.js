import { useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Skeleton, styled, alpha, Box, Typography, Stack, Chip } from "@mui/material";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import SpecialOfferCardShimmer from "../../Shimmer/SpecialOfferCardSimmer";
import { HomeComponentsWrapper } from "../HomePageComponents";
import { createEnhancedArrows } from "../../common/EnhancedSliderArrows";
import StoreCard from "components/cards/StoreCard";
import { useGetRecommendStores } from "api-manage/hooks/react-query/store/useGetRecommendStores";
import { Store, ChevronRight, Sparkles } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";


const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-slide": {
    padding: "0 10px",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      padding: "0px",
    },
  },
}));

const SectionHeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "12px",
  paddingBottom: "8px",
  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
}));

const TitleStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
}));

const IconBadge = styled(Box)(({ theme }) => ({
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  flexShrink: 0,
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
}));

const ViewAllLink = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: theme.palette.primary.main,
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
  padding: "6px 12px",
  borderRadius: "20px",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.palette.primary.main,
  },
}));

const RecommendedStore = () => {
  const slider = useRef(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const theme = useTheme();
  const {
    data: popularData,
    isLoading: popularIsLoading,
  } = useGetRecommendStores();

  // Enhanced slider settings
  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: true,
      variant: "primary"
    }),
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 695,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.4,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 340,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: false,
        },
      },
    ],
  };

  const sliderItems = (
    <SliderWrapper
      sx={{
        "& .slick-slide": {
          paddingRight: { xs: "10px", sm: "20px" },
          paddingY: "10px",
        },
      }}
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => setIsSliderHovered(false)}
    >
      {popularIsLoading ? (
        <Slider {...enhancedSettings}>
          {[...Array(6)].map((_, index) => {
            return <SpecialOfferCardShimmer key={index} width={290} />;
          })}
        </Slider>
      ) : (
        <>
          {popularData?.stores?.length > 0 && (
            <Slider {...enhancedSettings} ref={slider}>
              {popularData?.stores?.map((item, index) => {
                return (
                  <StoreCard
                    key={index}
                    imageUrl={item?.cover_photo_full_url}
                    item={item}
                  />
                );
              })}
            </Slider>
          )}
        </>
      )}
    </SliderWrapper>
  );

  const getLayout = () => {
    return (
      <>
        {sliderItems}
      </>
    );
  };

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      {getLayout()}
    </HomeComponentsWrapper>
  );
};

export default RecommendedStore;
