import { Skeleton, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useGetBanners from "../../../../api-manage/hooks/react-query/useGetBanners";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { setBanners } from "../../../../redux/slices/storedData";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "../../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../../CustomImageContainer";
import FoodDetailModal from "../../../food-details/foodDetail-modal/FoodDetailModal";
import { getImageUrl } from "utils/CustomFunctions";

const MAIN_HEIGHT = {
  xs: 160,
  sm: 210,
  md: 280,
  lg: 320,
};

const SIDE_GAP = 12;

const BannerTile = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "12px",
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  "& img": {
    display: "block",
  },
}));

const CampaignBanners = () => {
  const router = useRouter();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { banners } = useSelector((state) => state.storedData);
  const { data, isLoading, isFetched } = useGetBanners();
  const [bannersData, setBannersData] = useState([]);
  const [foodBanner, setFoodBanner] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { configData } = useSelector((state) => state.configData);

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(setBanners(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const source = data || banners;
    handleBannersData(source);
  }, [banners, data]);

  const handleBannersData = (source) => {
    let mergedBannerData = [];
    if (source?.banners?.length > 0) {
      source.banners.forEach((item) => mergedBannerData.push(item));
    }
    setBannersData(mergedBannerData);
  };

  const { mainSlides, sideBanners } = useMemo(() => {
    if (!bannersData?.length) {
      return { mainSlides: [], sideBanners: [] };
    }
    // Large left carousel + up to 2 stacked right tiles (avoid duplicating every slide)
    if (bannersData.length === 1) {
      return { mainSlides: bannersData, sideBanners: [] };
    }
    if (bannersData.length === 2) {
      return {
        mainSlides: [bannersData[0]],
        sideBanners: [bannersData[1]],
      };
    }
    return {
      mainSlides: [bannersData[0], ...bannersData.slice(3)],
      sideBanners: [bannersData[1], bannersData[2]],
    };
  }, [bannersData]);

  const handleBannerClick = (banner) => {
    if (banner?.type === "default") {
      router.push(banner?.link);
    }
    if (banner?.type === "store_wise") {
      router.push(
        {
          pathname: "/store/[id]",
          query: {
            id: `${
              banner?.store?.slug ? banner?.store?.slug : banner?.store?.id
            }`,
            module_id: `${getModuleId()}`,
            store_zone_id: `${banner?.store?.zone_id}`,
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      if (banner?.type === "item_wise") {
        if (selectedModule?.module_type === "food") {
          setFoodBanner(banner?.item);
          setOpenModal(true);
        } else {
          router.push(
            {
              pathname: "/product/[id]",
              query: {
                id: `${
                  banner?.item?.slug ? banner?.item?.slug : banner?.item?.id
                }`,
                module_id: `${getModuleId()}`,
              },
            },
            undefined,
            { shallow: true }
          );
        }
      }
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const settings = {
    dots: true,
    infinite: mainSlides.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: mainSlides.length > 1,
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    arrows: false,
  };

  const sliderSx = {
    mt: 0,
    height: "100%",
    "& .slick-list, & .slick-track, & .slick-slide > div": {
      height: "100%",
    },
    "& .slick-slide": { padding: "0" },
    "& .slick-dots": {
      bottom: "14px",
      "& li": { margin: "0 2px" },
      "& li button:before": {
        color: "white",
        opacity: 0.5,
        fontSize: "10px",
      },
      "& li.slick-active button:before": {
        color: "primary.main",
        opacity: 1,
        fontSize: "12px",
      },
    },
  };

  const renderBannerImage = (item) => (
    <CustomImageContainer
      src={item?.image_full_url}
      alt={item?.title}
      height="100%"
      width="100%"
      objectfit="cover"
      borderRadius="0px"
    />
  );

  const renderMainCarousel = (slides, loading = false) => (
    <BannerTile
      sx={{
        height: {
          xs: MAIN_HEIGHT.xs,
          sm: MAIN_HEIGHT.sm,
          md: MAIN_HEIGHT.md,
          lg: MAIN_HEIGHT.lg,
        },
      }}
    >
      <CustomStackFullWidth sx={{ ...sliderSx, height: "100%" }}>
        <SliderCustom sx={{ height: "100%" }}>
          <Slider {...settings}>
            {loading
              ? [...Array(1)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{ height: { xs: MAIN_HEIGHT.xs, md: MAIN_HEIGHT.md } }}
                  >
                    <Skeleton variant="rectangular" height="100%" width="100%" />
                  </Box>
                ))
              : slides.map((item, index) => (
                  <Box
                    key={item?.id || index}
                    onClick={() => handleBannerClick(item)}
                    sx={{
                      height: {
                        xs: MAIN_HEIGHT.xs,
                        sm: MAIN_HEIGHT.sm,
                        md: MAIN_HEIGHT.md,
                        lg: MAIN_HEIGHT.lg,
                      },
                      cursor: "pointer",
                    }}
                  >
                    {renderBannerImage(item)}
                  </Box>
                ))}
          </Slider>
        </SliderCustom>
      </CustomStackFullWidth>
    </BannerTile>
  );

  const sideColumnHeight = {
    xs: MAIN_HEIGHT.xs,
    sm: MAIN_HEIGHT.sm,
    md: MAIN_HEIGHT.md,
    lg: MAIN_HEIGHT.lg,
  };

  const renderSideStack = (sides, loading = false) => {
    if (!loading && (!sides || sides.length === 0)) return null;

    const items = loading ? [0, 1] : sides;
    const count = items.length;
    const tileFlex = count === 1 ? 1 : 1;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: `${SIDE_GAP}px`,
          height: { xs: "auto", md: sideColumnHeight.md, lg: sideColumnHeight.lg },
          minHeight: { md: sideColumnHeight.md, lg: sideColumnHeight.lg },
        }}
      >
        {items.map((item, index) => (
          <BannerTile
            key={loading ? index : item?.id || index}
            onClick={loading ? undefined : () => handleBannerClick(item)}
            sx={{
              flex: tileFlex,
              height: {
                xs: count === 1 ? MAIN_HEIGHT.xs : MAIN_HEIGHT.xs / 2 + 20,
                sm: count === 1 ? MAIN_HEIGHT.sm : (MAIN_HEIGHT.sm - SIDE_GAP) / 2,
                md: "auto",
                minHeight: {
                  md:
                    count === 1
                      ? sideColumnHeight.md
                      : (sideColumnHeight.md - SIDE_GAP) / 2,
                },
              },
            }}
          >
            {loading ? (
              <Skeleton variant="rectangular" height="100%" width="100%" />
            ) : (
              renderBannerImage(item)
            )}
          </BannerTile>
        ))}
      </Box>
    );
  };

  const showSide = isLoading || sideBanners.length > 0;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: showSide && (sideBanners.length > 0 || isLoading) ? "2fr 1fr" : "1fr",
          },
          gap: `${SIDE_GAP}px`,
          width: "100%",
        }}
      >
        {!isFetched && isLoading ? (
          <>
            {renderMainCarousel([], true)}
            {renderSideStack([], true)}
          </>
        ) : bannersData?.length > 0 ? (
          <>
            {renderMainCarousel(mainSlides)}
            {renderSideStack(sideBanners)}
          </>
        ) : null}
      </Box>

      {openModal && foodBanner && (
        <FoodDetailModal
          product={foodBanner}
          image={`${getImageUrl(
            foodBanner?.storage,
            "item_image_url",
            configData
          )}/${foodBanner?.image}`}
          open={openModal}
          handleModalClose={handleModalClose}
          setOpen={setOpenModal}
        />
      )}
    </>
  );
};

CampaignBanners.propTypes = {};

export default CampaignBanners;
