import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  alpha,
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Slider from "react-slick";
import useLandingProductsSection, {
  fetchAllLandingProducts,
} from "api-manage/hooks/react-query/landing/useLandingProductsSection";
import LandingProductCard from "components/landing-page/LandingProductCard";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import CustomContainer from "components/container";
import CustomModal from "components/modal";
import { createEnhancedArrows } from "components/common/EnhancedSliderArrows";
import { RECENTLY_VIEWED_UPDATED_EVENT } from "helper-functions/recentlyViewedGuest";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { SliderCustom } from "styled-components/CustomStyles.style";

const SECTION_BG = "#f9fafc";
const MOBILE_CARD_WIDTH = 190;

const LandingRecentlyViewedSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);
  const [mounted, setMounted] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);
  const [openViewAllModal, setOpenViewAllModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const { data, isLoading, refetch, isFetching } = useLandingProductsSection(
    mounted
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const products = data?.products || [];
  const isRecentlyViewed = data?.source === "recently-viewed";
  const showLoading = isLoading || (isFetching && products.length === 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onRecentlyViewedUpdated = () => refetch();
    window.addEventListener(RECENTLY_VIEWED_UPDATED_EVENT, onRecentlyViewedUpdated);
    return () =>
      window.removeEventListener(
        RECENTLY_VIEWED_UPDATED_EVENT,
        onRecentlyViewedUpdated
      );
  }, [refetch]);

  const handleRequestDetail = useCallback((bundle) => {
    setModalPayload(bundle);
  }, []);

  const closeModal = useCallback(() => {
    setModalPayload(null);
  }, []);

  const getIsWishlisted = useCallback(
    (itemId) =>
      Boolean(wishLists?.item?.some((wishItem) => wishItem?.id === itemId)),
    [wishLists]
  );

  const isFoodItem = (item) =>
    item?.module?.module_type === ModuleTypes.FOOD ||
    item?.module_type === ModuleTypes.FOOD;

  const handleViewAll = async () => {
    setOpenViewAllModal(true);
    setIsLoadingAll(true);
    try {
      const result = await fetchAllLandingProducts();
      setAllProducts(result?.products || []);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      infinite: products.length > 5,
      speed: 400,
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: products.length > 5,
      ...createEnhancedArrows(isHover, {
        noBackground: true,
        variant: "primary",
      }),
      responsive: [
        {
          breakpoint: 1300,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: products.length > 4,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: products.length > 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: products.length > 2,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            infinite: false,
          },
        },
      ],
    }),
    [products.length, isHover]
  );

  const sliderSx = {
    width: "100%",
    minWidth: 0,
    position: "relative",
    "& .slick-list": { margin: "0 -8px", overflow: "hidden" },
    "& .slick-slide": {
      padding: "0 8px",
      height: "auto",
      display: "flex !important",
      "& > div": {
        height: "100%",
        width: "100%",
        display: "flex",
      },
    },
    "& .slick-track": {
      display: "flex !important",
      alignItems: "stretch",
    },
  };

  if (!mounted) return null;

  const title = isRecentlyViewed
    ? t("Recently Viewed")
    : t("Popular Products");
  const subtitle = isRecentlyViewed
    ? t("Recently viewed subtitle landing")
    : t("Popular products subtitle landing");

  const renderSkeletonCard = (key) => (
    <Box
      key={key}
      sx={{
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        bgcolor: "background.paper",
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
      }}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <Box sx={{ pt: "100%" }} />
        <Skeleton
          variant="rectangular"
          sx={{ position: "absolute", inset: 0, bgcolor: "#f5f3ef" }}
        />
      </Box>
      <Stack spacing={0.75} sx={{ p: 1.25 }}>
        <Skeleton variant="text" width="55%" height={10} />
        <Skeleton variant="text" width="92%" height={14} />
        <Skeleton variant="text" width="92%" height={14} />
        <Skeleton variant="text" width="70%" height={12} />
        <Skeleton variant="text" width="50%" height={16} />
        <Skeleton variant="rounded" width="45%" height={18} />
        <Skeleton variant="rounded" width="100%" height={34} sx={{ mt: 0.5 }} />
      </Stack>
    </Box>
  );

  return (
    <>
      <Box
        component="section"
        aria-label={title}
        sx={{
          width: "100vw",
          maxWidth: "100vw",
          ml: "calc(50% - 50vw)",
          mr: "calc(50% - 50vw)",
          bgcolor: SECTION_BG,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: { xs: 2.5, sm: 3, md: 3.25 },
        }}
      >
        <CustomContainer sx={{ minWidth: 0 }}>
          <Box
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            sx={{ width: "100%", minWidth: 0 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mb: { xs: 1.75, md: 2.25 } }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.6}>
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: "15px", md: "17px" },
                      fontWeight: 700,
                      letterSpacing: "0.01em",
                      color: "text.primary",
                      lineHeight: 1.25,
                    }}
                  >
                    {title}
                  </Typography>
                  {isRecentlyViewed && (
                    <AccessTimeIcon
                      sx={{
                        fontSize: { xs: 17, md: 18 },
                        color: "warning.main",
                      }}
                    />
                  )}
                </Stack>
                <Typography
                  component="p"
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: "11px", sm: "12px" },
                    color: "text.secondary",
                    lineHeight: 1.4,
                    maxWidth: 480,
                  }}
                >
                  {subtitle}
                </Typography>
              </Box>

              {!showLoading && products.length > 0 && (
                <Button
                  onClick={handleViewAll}
                  variant="text"
                  endIcon={
                    <ChevronRightIcon sx={{ fontSize: 18, ml: -0.25 }} />
                  }
                  sx={{
                    flexShrink: 0,
                    alignSelf: "center",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "12px", md: "13px" },
                    color: "text.primary",
                    px: { xs: 0.5, sm: 1 },
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  {t("View All")}
                </Button>
              )}
            </Stack>

            {!showLoading && products.length === 0 ? (
              <Box
                sx={{
                  border: `1px dashed ${alpha(theme.palette.divider, 0.55)}`,
                  borderRadius: "8px",
                  py: 3,
                  px: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.75),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    fontSize: { xs: "12px", sm: "13px" },
                  }}
                >
                  {t("No recently viewed items found")}
                </Typography>
              </Box>
            ) : isMobile ? (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  overflowX: "auto",
                  width: "100%",
                  minWidth: 0,
                  mx: { xs: -0.5, sm: 0 },
                  px: { xs: 0.5, sm: 0 },
                  pb: 0.25,
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {showLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: `0 0 ${MOBILE_CARD_WIDTH}px`,
                          scrollSnapAlign: "start",
                        }}
                      >
                        {renderSkeletonCard(`mob-sk-${i}`)}
                      </Box>
                    ))
                  : products.map((item) => (
                      <Box
                        key={item?.id}
                        sx={{
                          flex: `0 0 ${MOBILE_CARD_WIDTH}px`,
                          scrollSnapAlign: "start",
                        }}
                      >
                        <LandingProductCard
                          item={item}
                          onRequestDetail={handleRequestDetail}
                        />
                      </Box>
                    ))}
              </Box>
            ) : (
              <SliderCustom nopadding="true" sx={sliderSx}>
                {showLoading ? (
                  <Stack direction="row" sx={{ px: 0.5 }}>
                    {Array.from({ length: isTablet ? 3 : 5 }).map((_, i) => (
                      <Box key={i} sx={{ flex: "1 1 0", px: "8px" }}>
                        {renderSkeletonCard(`desk-sk-${i}`)}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Slider {...sliderSettings}>
                    {products.map((item) => (
                      <Box key={item?.id} sx={{ height: "100%" }}>
                        <LandingProductCard
                          item={item}
                          onRequestDetail={handleRequestDetail}
                        />
                      </Box>
                    ))}
                  </Slider>
                )}
              </SliderCustom>
            )}
          </Box>
        </CustomContainer>
      </Box>

      <CustomModal
        openModal={openViewAllModal}
        handleClose={() => setOpenViewAllModal(false)}
        closeButton
        maxWidth="980px"
      >
        <Box sx={{ p: { xs: 2, sm: 2.5 }, minWidth: { xs: "78vw", sm: "840px" } }}>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: { xs: "12px", sm: "13px" } }}
          >
            {t("View all recently viewed items")}
          </Typography>
          {isLoadingAll ? (
            <Grid container spacing={1.5}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`landing-rv-sk-${index}`}>
                  {renderSkeletonCard(`modal-sk-${index}`)}
                </Grid>
              ))}
            </Grid>
          ) : allProducts?.length > 0 ? (
            <Grid
              container
              spacing={1.5}
              sx={{ maxHeight: "65vh", overflowY: "auto", pr: 0.5 }}
            >
              {allProducts.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={`landing-rv-all-${item?.id}`}>
                  <LandingProductCard
                    item={item}
                    onRequestDetail={handleRequestDetail}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("No recently viewed items found")}
            </Typography>
          )}
        </Box>
      </CustomModal>

      {modalPayload && isFoodItem(modalPayload.item) && (
        <FoodDetailModal
          product={modalPayload.item}
          imageBaseUrl={modalPayload.imageBaseUrl}
          open
          handleModalClose={closeModal}
          setOpen={(value) => {
            if (!value) closeModal();
          }}
          addToWishlistHandler={modalPayload.addToWishlistHandler}
          removeFromWishlistHandler={modalPayload.removeFromWishlistHandler}
          isWishlisted={getIsWishlisted(modalPayload?.item?.id)}
        />
      )}
      {modalPayload && !isFoodItem(modalPayload.item) && (
        <ModuleModal
          open
          handleModalClose={closeModal}
          configData={configData}
          productDetailsData={modalPayload.item}
          addToWishlistHandler={modalPayload.addToWishlistHandler}
          removeFromWishlistHandler={modalPayload.removeFromWishlistHandler}
          isWishlisted={getIsWishlisted(modalPayload?.item?.id)}
        />
      )}
    </>
  );
};

export default LandingRecentlyViewedSection;
