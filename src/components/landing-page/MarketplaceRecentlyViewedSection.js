import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import useMarketplaceRecentlyViewed from "api-manage/hooks/react-query/landing/useMarketplaceRecentlyViewed";
import LandingProductCard from "components/landing-page/LandingProductCard";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import CustomContainer from "components/container";
import RecentlyViewedViewAllModal from "components/home/RecentlyViewedViewAllModal";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getToken, hasValidAuthToken } from "helper-functions/getToken";
import { RECENTLY_VIEWED_UPDATED_EVENT } from "helper-functions/recentlyViewedGuest";
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
        <Skeleton
          variant="rectangular"
          width="100%"
          height={30}
          sx={{ borderRadius: "2px" }}
        />
      </Stack>
    </Box>
  );
};

/**
 * Landing Recently Viewed — GET /api/v1/marketplace/recently-viewed
 * Auth + zoneId required. Placed above Flash Deals.
 */
const MarketplaceRecentlyViewedSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const scrollRef = useRef(null);
  const { configData } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);

  const [mounted, setMounted] = useState(false);
  const [zoneKey, setZoneKey] = useState("");
  const [tokenKey, setTokenKey] = useState("");
  const [modalPayload, setModalPayload] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isStripHovered, setIsStripHovered] = useState(false);
  const [openViewAll, setOpenViewAll] = useState(false);
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const syncKeys = useCallback(() => {
    if (typeof window === "undefined") return;
    setZoneKey(localStorage.getItem("zoneid") || "");
    const token = getToken() || localStorage.getItem("token") || "";
    setTokenKey(hasValidAuthToken(token) ? token : "");
  }, []);

  useEffect(() => {
    setMounted(true);
    syncKeys();
  }, [syncKeys]);

  useEffect(() => {
    if (!mounted) return undefined;
    const onStorage = (e) => {
      if (
        !e.key ||
        e.key === "zoneid" ||
        e.key === "location" ||
        e.key === "token"
      ) {
        syncKeys();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", syncKeys);
    const interval = window.setInterval(syncKeys, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", syncKeys);
      window.clearInterval(interval);
    };
  }, [mounted, syncKeys]);

  const { data, isLoading, isFetching, refetch } = useMarketplaceRecentlyViewed({
    // Auth OR guest local history — zone helps API, not required for guest.
    enabled: mounted,
    zoneKey: `${zoneKey || "no-zone"}|${tokenKey ? "auth" : "guest"}`,
    limit: 20,
  });

  useEffect(() => {
    const onUpdated = () => {
      refetch();
    };
    window.addEventListener(RECENTLY_VIEWED_UPDATED_EVENT, onUpdated);
    return () =>
      window.removeEventListener(RECENTLY_VIEWED_UPDATED_EVENT, onUpdated);
  }, [refetch]);

  const products = useMemo(() => data?.products || [], [data]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return undefined;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products, isLoading, updateScrollState]);

  const scrollStrip = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.7, 220);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

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

  // Hide only when empty (no recently viewed for auth or guest)
  if (!mounted) return null;
  if (!isLoading && !isFetching && products.length === 0) return null;

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
                {t("Recently Viewed")}
              </Typography>
              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: { xs: "11px", sm: "12px" },
                  color: "text.secondary",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {t("Continue from where you left off")}
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
                  aria-label="Previous recently viewed"
                  onClick={() => scrollStrip(-1)}
                  sx={{ ...navSx(canScrollLeft), left: 0 }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  aria-label="Next recently viewed"
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
                    <CardSkeleton key={`rv-skel-${i}`} />
                  ))
                : products.map((item) => (
                    <Box
                      key={`rv-${item?.id}-${item?.module_id || ""}-${item?.viewed_at || ""}`}
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

      <RecentlyViewedViewAllModal
        open={openViewAll}
        onClose={() => setOpenViewAll(false)}
        products={products}
        onRequestDetail={handleRequestDetail}
      />
    </>
  );
};

export default MarketplaceRecentlyViewedSection;
