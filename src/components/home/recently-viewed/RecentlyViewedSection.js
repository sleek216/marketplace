import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  alpha,
  Box,
  IconButton,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MainApi from "api-manage/MainApi";
import { item_details_api } from "api-manage/ApiRoutes";
import useRecentlyViewedList from "api-manage/hooks/react-query/recently-viewed/useRecentlyViewedList";
import LandingProductCard from "components/landing-page/LandingProductCard";
import {
  marketplaceStripCardSx,
  marketplaceStripGapSx,
} from "components/landing-page/marketplaceCardLayout";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import MarketplaceSectionHeader from "components/home/MarketplaceSectionHeader";
import RecentlyViewedViewAllModal from "components/home/RecentlyViewedViewAllModal";
import { getCurrentModuleType, getCurrentModuleId } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  filterHistoriesForModule,
  itemBelongsToModule,
} from "helper-functions/recentlyViewedModuleFilter";
import { RECENTLY_VIEWED_UPDATED_EVENT } from "helper-functions/recentlyViewedGuest";

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
 * Module home Recently Viewed — same layout/design as landing page strip.
 */
const RecentlyViewedSection = () => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [openViewAllModal, setOpenViewAllModal] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isStripHovered, setIsStripHovered] = useState(false);
  const [rvModalPayload, setRvModalPayload] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hadItemsRef = useRef(false);
  const currentModuleType = getCurrentModuleType();
  const currentModuleId = getCurrentModuleId();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { refetch } = useRecentlyViewedList({
    module: currentModuleType,
    limit: 20,
    offset: 1,
    token,
  });
  const { refetch: refetchAllRecentlyViewed } = useRecentlyViewedList({
    module: currentModuleType,
    limit: 100,
    offset: 1,
    token,
  });
  const { configData } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);

  const closeRvModal = useCallback(() => {
    setRvModalPayload(null);
  }, []);

  const getIsWishlisted = useCallback(
    (itemId) =>
      Boolean(wishLists?.item?.some((wishItem) => wishItem?.id === itemId)),
    [wishLists]
  );

  const handleRequestRvDetail = useCallback((bundle) => {
    setRvModalPayload(bundle);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  const scrollStrip = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.7, 220);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const getDetailedItems = useCallback(
    async (histories = []) => {
      if (!histories?.length) return [];

      const scopedHistories = filterHistoriesForModule(
        histories,
        currentModuleType
      );
      if (!scopedHistories.length) return [];

      const limited = scopedHistories.slice(0, 20);
      const details = await Promise.all(
        limited.map(async (history) => {
          try {
            const { data } = await MainApi.get(
              `${item_details_api}/${history?.entity_id}`,
              {
                omitModuleId: !currentModuleId,
                ...(currentModuleId
                  ? { moduleIdOverride: currentModuleId }
                  : {}),
              }
            );
            return data;
          } catch {
            return null;
          }
        })
      );

      return details
        .filter(Boolean)
        .filter((item) =>
          itemBelongsToModule(item, currentModuleType, currentModuleId)
        );
    },
    [currentModuleType, currentModuleId]
  );

  const loadItems = useCallback(async () => {
    if (!currentModuleType) return;
    if (!hadItemsRef.current) {
      setIsLoadingItems(true);
    }
    try {
      const res = await refetch();
      const histories = filterHistoriesForModule(
        Array.isArray(res?.data) ? res.data : [],
        currentModuleType
      );
      if (!histories.length) {
        setItems([]);
        hadItemsRef.current = false;
        return;
      }
      const next = await getDetailedItems(histories);
      setItems(next);
      hadItemsRef.current = next.length > 0;
    } finally {
      setIsLoadingItems(false);
    }
  }, [getDetailedItems, currentModuleType, refetch]);

  const loadAllItems = useCallback(async () => {
    if (!currentModuleType) return;
    try {
      const res = await refetchAllRecentlyViewed();
      const histories = filterHistoriesForModule(
        Array.isArray(res?.data) ? res.data : [],
        currentModuleType
      );
      const next = await getDetailedItems(histories);
      setAllItems(next);
    } catch {
      setAllItems([]);
    }
  }, [getDetailedItems, currentModuleType, refetchAllRecentlyViewed]);

  const handleViewAll = async () => {
    setOpenViewAllModal(true);
    await loadAllItems();
  };

  useEffect(() => {
    hadItemsRef.current = false;
    setItems([]);
    setAllItems([]);
  }, [currentModuleType]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    const onRecentlyViewedUpdated = () => {
      loadItems();
    };
    window.addEventListener(
      RECENTLY_VIEWED_UPDATED_EVENT,
      onRecentlyViewedUpdated
    );
    return () =>
      window.removeEventListener(
        RECENTLY_VIEWED_UPDATED_EVENT,
        onRecentlyViewedUpdated
      );
  }, [loadItems]);

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
  }, [items, isLoadingItems, updateScrollState]);

  if (!mounted) return null;
  if (!isLoadingItems && items.length === 0) return null;

  const showNav =
    isDesktop && items.length > 0 && (canScrollLeft || canScrollRight);

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

  const viewAllProducts = allItems.length > 0 ? allItems : items;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <MarketplaceSectionHeader
          title="Recently Viewed"
          subtitle="Continue from where you left off"
          onSeeAll={handleViewAll}
        />

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
            {isLoadingItems
              ? Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={`rv-skel-${i}`} />
                ))
              : items.map((item) => (
                  <Box
                    key={`rv-${item?.id}`}
                    sx={marketplaceStripCardSx}
                  >
                    <LandingProductCard
                      item={item}
                      onRequestDetail={handleRequestRvDetail}
                    />
                  </Box>
                ))}
          </Box>
        </Box>
      </Box>

      <RecentlyViewedViewAllModal
        open={openViewAllModal}
        onClose={() => setOpenViewAllModal(false)}
        products={viewAllProducts}
        onRequestDetail={handleRequestRvDetail}
      />

      {rvModalPayload && currentModuleType === ModuleTypes.FOOD && (
        <FoodDetailModal
          product={rvModalPayload.item}
          imageBaseUrl={rvModalPayload.imageBaseUrl}
          open
          handleModalClose={closeRvModal}
          setOpen={(value) => {
            if (!value) closeRvModal();
          }}
          addToWishlistHandler={rvModalPayload.addToWishlistHandler}
          removeFromWishlistHandler={rvModalPayload.removeFromWishlistHandler}
          isWishlisted={getIsWishlisted(rvModalPayload?.item?.id)}
        />
      )}
      {rvModalPayload &&
        currentModuleType !== ModuleTypes.FOOD &&
        (rvModalPayload.cardFor === "flashSale" ? (
          rvModalPayload.stock !== 0 && (
            <ModuleModal
              open
              handleModalClose={closeRvModal}
              configData={configData}
              productDetailsData={rvModalPayload.item}
              addToWishlistHandler={rvModalPayload.addToWishlistHandler}
              removeFromWishlistHandler={
                rvModalPayload.removeFromWishlistHandler
              }
              isWishlisted={getIsWishlisted(rvModalPayload?.item?.id)}
            />
          )
        ) : (
          <ModuleModal
            open
            handleModalClose={closeRvModal}
            configData={configData}
            productDetailsData={rvModalPayload.item}
            addToWishlistHandler={rvModalPayload.addToWishlistHandler}
            removeFromWishlistHandler={
              rvModalPayload.removeFromWishlistHandler
            }
            isWishlisted={getIsWishlisted(rvModalPayload?.item?.id)}
          />
        ))}
    </>
  );
};

export default RecentlyViewedSection;
