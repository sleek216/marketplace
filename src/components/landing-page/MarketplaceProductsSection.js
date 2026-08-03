import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import useMarketplaceItems from "api-manage/hooks/react-query/landing/useMarketplaceItems";
import LandingProductCard from "components/landing-page/LandingProductCard";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import CustomContainer from "components/container";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  marketplaceProductGridColumns,
  marketplaceProductGridGap,
} from "./marketplaceCardLayout";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "discounted", label: "Discounted" },
];

const ProductCardSkeleton = () => (
  <Box
    sx={{
      borderRadius: "2px",
      overflow: "hidden",
      border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.35)}`,
      bgcolor: "background.paper",
      boxShadow: (theme) =>
        `0 1px 4px ${alpha(theme.palette.common.black, 0.06)}`,
    }}
  >
    <Skeleton variant="rectangular" sx={{ pt: "85%", borderRadius: 0 }} />
    <Stack spacing={0.4} sx={{ px: 1, pt: 0.6, pb: 0.85 }}>
      <Skeleton variant="text" width="40%" height={10} />
      <Skeleton variant="text" width="95%" height={13} />
      <Skeleton variant="text" width="70%" height={13} />
      <Skeleton variant="text" width="45%" height={16} />
      <Skeleton variant="text" width="55%" height={12} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={30}
        sx={{ mt: 0.4, borderRadius: "2px" }}
      />
    </Stack>
  </Box>
);

/**
 * Landing marketplace catalog — all products across modules via
 * GET /api/v1/marketplace/items (zoneId only, no moduleId).
 */
const MarketplaceProductsSection = ({ onRequestLocation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);

  const [mounted, setMounted] = useState(false);
  const [zoneKey, setZoneKey] = useState("");
  const [sort, setSort] = useState("popular");
  const [modalPayload, setModalPayload] = useState(null);

  const syncZone = useCallback(() => {
    if (typeof window === "undefined") return;
    setZoneKey(localStorage.getItem("zoneid") || "");
  }, []);

  useEffect(() => {
    setMounted(true);
    syncZone();
  }, [syncZone]);

  useEffect(() => {
    if (!mounted) return undefined;
    const onStorage = (e) => {
      if (!e.key || e.key === "zoneid" || e.key === "location") syncZone();
    };
    const onFocus = () => syncZone();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    const interval = window.setInterval(syncZone, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
    };
  }, [mounted, syncZone]);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useMarketplaceItems({
    enabled: mounted && Boolean(zoneKey),
    sort,
    zoneKey,
  });

  const products = useMemo(
    () => data?.pages?.flatMap((page) => page?.products || []) || [],
    [data]
  );
  const totalSize = data?.pages?.[0]?.total_size || 0;
  const showInitialLoading = isLoading && products.length === 0;

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

  if (!mounted) return null;

  return (
    <Box
      component="section"
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? "background.default"
            : theme.palette.neutral?.[100] || "#f5f6f8",
        pt: { xs: 2, md: 3 },
        pb: { xs: 4, md: 6 },
        minHeight: { xs: "50vh", md: "60vh" },
      }}
    >
      <CustomContainer>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          mb={{ xs: 2, md: 2.5 }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "18px", md: "22px" },
                lineHeight: 1.25,
                color: "text.primary",
                letterSpacing: "-0.01em",
              }}
            >
              {t("All Products")}
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                fontSize: { xs: "12px", md: "13px" },
                color: "text.secondary",
              }}
            >
              {zoneKey && totalSize > 0
                ? `${totalSize} ${t("products across the marketplace")}`
                : t("Browse products from every module in your zone")}
            </Typography>
          </Box>

          {zoneKey && (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {SORT_OPTIONS.map((option) => {
                const active = sort === option.value;
                return (
                  <Button
                    key={option.value}
                    size="small"
                    onClick={() => setSort(option.value)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "12px",
                      px: 1.5,
                      py: 0.5,
                      minWidth: 0,
                      borderRadius: "8px",
                      color: active ? "primary.contrastText" : "text.secondary",
                      bgcolor: active
                        ? "primary.main"
                        : alpha(theme.palette.divider, 0.35),
                      "&:hover": {
                        bgcolor: active
                          ? "primary.dark"
                          : alpha(theme.palette.divider, 0.55),
                      },
                    }}
                  >
                    {t(option.label)}
                  </Button>
                );
              })}
            </Stack>
          )}
        </Stack>

        {!zoneKey ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 6, md: 8 },
              px: 2,
              borderRadius: "14px",
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography fontWeight={700} fontSize={{ xs: 16, md: 18 }} mb={0.75}>
              {t("Select location")}
            </Typography>
            <Typography
              color="text.secondary"
              fontSize={{ xs: 13, md: 14 }}
              maxWidth={420}
              mx="auto"
              mb={2.5}
            >
              {t(
                "Select location first to start exploring shops & restaurants near you"
              )}
            </Typography>
            {typeof onRequestLocation === "function" && (
              <Button
                variant="contained"
                onClick={onRequestLocation}
                sx={{ textTransform: "none", fontWeight: 700, px: 3 }}
              >
                {t("Select location")}
              </Button>
            )}
          </Box>
        ) : showInitialLoading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: marketplaceProductGridColumns,
              gap: marketplaceProductGridGap,
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={`mp-skel-${index}`} />
            ))}
          </Box>
        ) : isError ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: "14px",
              bgcolor: "background.paper",
            }}
          >
            <Typography color="text.secondary">
              {t("Could not load products. Please try again.")}
            </Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: "14px",
              bgcolor: "background.paper",
            }}
          >
            <Typography color="text.secondary">
              {t("No products found in your zone yet.")}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: marketplaceProductGridColumns,
                gap: marketplaceProductGridGap,
              }}
            >
              {products.map((item) => (
                <LandingProductCard
                  key={`marketplace-item-${item?.id}-${item?.module_id || ""}`}
                  item={item}
                  onRequestDetail={handleRequestDetail}
                />
              ))}
            </Box>

            {(hasNextPage || isFetchingNextPage) && (
              <Stack alignItems="center" mt={3.5}>
                <Button
                  variant="outlined"
                  disabled={isFetchingNextPage || isFetching}
                  onClick={() => fetchNextPage()}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1,
                    borderRadius: "10px",
                    minWidth: 160,
                  }}
                >
                  {isFetchingNextPage ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    t("Load More")
                  )}
                </Button>
              </Stack>
            )}
          </>
        )}
      </CustomContainer>

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
    </Box>
  );
};

export default MarketplaceProductsSection;
