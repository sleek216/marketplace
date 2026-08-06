import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { latest_items_api } from "api-manage/ApiRoutes";
import LandingProductCard from "components/landing-page/LandingProductCard";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import CustomContainer from "components/container";
import RecentlyViewedViewAllModal from "components/home/RecentlyViewedViewAllModal";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { useRouter } from "next/router";
import {
  marketplaceStripCardSx,
  marketplaceStripGapSx,
} from "./marketplaceCardLayout";

const CardSkeleton = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...marketplaceStripCardSx,
        borderRadius: "2px",
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
        bgcolor: "background.paper",
      }}
    >
      <Skeleton variant="rectangular" sx={{ pt: "85%" }} />
      <Stack spacing={0.4} sx={{ px: 1, pt: 0.6, pb: 0.85 }}>
        <Skeleton variant="text" width="40%" height={10} />
        <Skeleton variant="text" width="90%" height={13} />
        <Skeleton variant="text" width="55%" height={16} />
      </Stack>
    </Box>
  );
};

const fetchCrossModuleNewArrivals = async (limit = 12) => {
  try {
    const { data } = await MainApi.get(
      `/api/v1/marketplace/items?sort=latest&limit=${limit}&offset=1`,
      { omitModuleId: true }
    );
    const items = Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
      ? data
      : [];
    if (items.length > 0) return items;
  } catch (err) {
    try {
      const { data: fallbackData } = await MainApi.get(
        `${latest_items_api}?limit=${limit}&offset=1&type=all`,
        { omitModuleId: true }
      );
      return Array.isArray(fallbackData?.products)
        ? fallbackData.products
        : Array.isArray(fallbackData)
        ? fallbackData
        : [];
    } catch {
      return [];
    }
  }
  return [];
};

const LandingNewArrivalsSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { configData } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);

  const [openViewAll, setOpenViewAll] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);
  const [isStripHovered, setIsStripHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef(null);

  const { data: products = [], isLoading } = useQuery(
    ["cross-module-new-arrivals-strip"],
    () => fetchCrossModuleNewArrivals(12),
    {
      staleTime: 1000 * 60 * 3,
      cacheTime: 1000 * 60 * 10,
    }
  );

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setCanScrollLeft(left);
    setCanScrollRight(right);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [products, updateScrollButtons]);

  const scrollStrip = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 500);
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const getIsWishlisted = useCallback(
    (id) => {
      if (!id || !wishLists?.item) return false;
      return wishLists.item.some((w) => w?.id === id);
    },
    [wishLists]
  );

  const handleRequestDetail = useCallback((itemData) => {
    setModalPayload({ item: itemData });
  }, []);

  const closeModal = () => {
    setModalPayload(null);
  };

  const isFoodItem = (item) =>
    item?.module_type === ModuleTypes.FOOD ||
    item?.module?.module_type === ModuleTypes.FOOD;

  const showLoading = isLoading && products.length === 0;

  if (!showLoading && (!products || products.length === 0)) {
    return null;
  }

  const showNav =
    isDesktop && products.length > 0 && (canScrollLeft || canScrollRight);

  const navSx = (visible) => ({
    position: "absolute",
    top: "40%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: 36,
    height: 36,
    borderRadius: "2px",
    bgcolor: "background.paper",
    border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
    boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.1)}`,
    opacity: visible && isStripHovered ? 1 : 0,
    pointerEvents: visible && isStripHovered ? "auto" : "none",
    transition: "opacity 0.2s ease",
    "&:hover": {
      bgcolor: "primary.main",
      color: "primary.contrastText",
      borderColor: "primary.main",
    },
  });

  return (
    <>
      <Box
        component="section"
        sx={{
          bgcolor: "background.paper",
          pt: { xs: 2, md: 2.5 },
          pb: { xs: 1.5, md: 2 },
        }}
      >
        <CustomContainer>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
            mb={1.5}
          >
            <Box minWidth={0}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "16px", md: "18px" },
                  lineHeight: 1.2,
                  color: "text.primary",
                }}
              >
                {t("Newly Added Products")}
              </Typography>
              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: { xs: "11px", sm: "12px" },
                  color: "text.secondary",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {t("Explore the latest items freshly added across all categories")}
              </Typography>
            </Box>
            {products.length > 0 && (
              <Button
                onClick={() => setOpenViewAll(true)}
                endIcon={
                  <ChevronRightIcon sx={{ fontSize: "18px !important" }} />
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "12px", md: "13px" },
                  color: "primary.main",
                  px: { xs: 0.75, sm: 1 },
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                  },
                }}
              >
                {t("See all")}
              </Button>
            )}
          </Stack>

          <Box
            onMouseEnter={() => setIsStripHovered(true)}
            onMouseLeave={() => setIsStripHovered(false)}
            sx={{ position: "relative" }}
          >
            {showNav && (
              <>
                <IconButton
                  aria-label="Previous newly added"
                  onClick={() => scrollStrip(-1)}
                  sx={{ ...navSx(canScrollLeft), left: 0 }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  aria-label="Next newly added"
                  onClick={() => scrollStrip(1)}
                  sx={{ ...navSx(canScrollRight), right: 0 }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}

            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                gap: marketplaceStripGapSx,
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
                pb: 0.5,
              }}
            >
              {showLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={`new-skel-${i}`} />
                  ))
                : products.map((item) => (
                    <Box
                      key={`new-${item?.id}-${item?.module_id || ""}`}
                      sx={marketplaceStripCardSx}
                    >
                      <LandingProductCard
                        item={item}
                        onRequestDetail={handleRequestDetail}
                      />
                    </Box>
                  ))}
            </Box>
          </Box>
        </CustomContainer>
      </Box>

      {modalPayload && isFoodItem(modalPayload.item) && (
        <FoodDetailModal
          product={modalPayload.item}
          imageBaseUrl={configData?.base_urls?.item_image_url}
          open
          handleModalClose={closeModal}
          setOpen={(value) => {
            if (!value) closeModal();
          }}
          isWishlisted={getIsWishlisted(modalPayload?.item?.id)}
        />
      )}
      {modalPayload && !isFoodItem(modalPayload.item) && (
        <ModuleModal
          open
          handleModalClose={closeModal}
          configData={configData}
          productDetailsData={modalPayload.item}
          isWishlisted={getIsWishlisted(modalPayload?.item?.id)}
        />
      )}

      <RecentlyViewedViewAllModal
        open={openViewAll}
        onClose={() => setOpenViewAll(false)}
        products={products}
        onRequestDetail={handleRequestDetail}
        title={t("Newly Added Products")}
        subTitle={t("Explore the latest items freshly added across all categories")}
      />
    </>
  );
};

export default LandingNewArrivalsSection;
