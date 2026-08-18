import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useGetRecommendProductsForHome } from "api-manage/hooks/react-query/useGetRecommendProductsForHome";
import { useDispatch, useSelector } from "react-redux";
import { setYouWillLoveItems } from "redux/slices/storedData";
import { HomeComponentsWrapper } from "../HomePageComponents";
import MarketplaceSectionHeader from "../MarketplaceSectionHeader";
import ModuleMarketplaceProductCard from "../ModuleMarketplaceProductCard";
import RecentlyViewedViewAllModal from "../RecentlyViewedViewAllModal";
import Menus from "./Menus";
import {
  marketplaceStripCardSx,
  marketplaceStripGapSx,
} from "components/landing-page/marketplaceCardLayout";

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

const getProductList = (payload) =>
  payload?.items || payload?.products || [];

const LoveItem = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { youWillLoveItems } = useSelector((state) => state.storedData);

  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [openSeeAll, setOpenSeeAll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isStripHovered, setIsStripHovered] = useState(false);

  const { data, refetch, isLoading, isFetched } =
    useGetRecommendProductsForHome({
      offset: 1,
      limit: 50,
    });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) dispatch(setYouWillLoveItems(data));
  }, [data, dispatch]);

  const allProducts = useMemo(
    () => getProductList(data) || getProductList(youWillLoveItems) || [],
    [data, youWillLoveItems]
  );

  const uniqueCategories = useMemo(() => {
    const categoryIds = [];
    allProducts.forEach((product) => {
      product?.category_ids?.forEach((categoryId) => {
        categoryIds.push(categoryId);
      });
    });
    return [
      ...new Set(categoryIds.map((item) => JSON.stringify(item))),
    ].map(JSON.parse);
  }, [allProducts]);

  const menus = useMemo(
    () =>
      uniqueCategories.length > 0
        ? ["Recommended", ...uniqueCategories.map((item) => item.name)]
        : [],
    [uniqueCategories]
  );

  const filteredProducts = useMemo(() => {
    if (selectedMenuIndex === 0 || uniqueCategories.length === 0) {
      return allProducts;
    }
    const selectedCategory = uniqueCategories[selectedMenuIndex - 1];
    return allProducts.filter((item) =>
      item?.category_ids?.some(
        (categoryId) => selectedCategory?.id === categoryId?.id
      )
    );
  }, [allProducts, selectedMenuIndex, uniqueCategories]);

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
  }, [filteredProducts, isLoading, updateScrollState]);

  const scrollStrip = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.7, 220);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (isFetched && allProducts.length === 0) return null;

  const showLoading = !isFetched || (isLoading && allProducts.length === 0);
  const showNav =
    isDesktop &&
    filteredProducts.length > 0 &&
    (canScrollLeft || canScrollRight);

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
    <HomeComponentsWrapper>
      {showLoading ? (
        <Skeleton variant="text" width="240px" height={28} sx={{ mb: 1.5 }} />
      ) : (
        <MarketplaceSectionHeader
          title="Item That You’ll Love"
          subtitle="Recommended picks chosen just for you"
          onSeeAll={() => setOpenSeeAll(true)}
          seeAllLabel="See all"
          mb={menus.length > 1 ? 1 : 1.5}
        />
      )}

      {menus.length > 1 ? (
        <Box sx={{ mb: 1.25, width: "100%", overflow: "hidden" }}>
          <Menus
            selectedMenuIndex={selectedMenuIndex}
            setSelectedMenuIndex={setSelectedMenuIndex}
            menus={menus}
          />
        </Box>
      ) : null}

      <Box
        onMouseEnter={() => setIsStripHovered(true)}
        onMouseLeave={() => setIsStripHovered(false)}
        sx={{ position: "relative", width: "100%" }}
      >
        {showNav && (
          <>
            <IconButton
              aria-label="Previous products"
              onClick={() => scrollStrip(-1)}
              sx={{ ...navSx(canScrollLeft), left: 0 }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              aria-label="Next products"
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
                <CardSkeleton key={`love-skel-${i}`} />
              ))
            : filteredProducts.map((item) => (
                <Box key={item?.id} sx={marketplaceStripCardSx}>
                  <ModuleMarketplaceProductCard item={item} />
                </Box>
              ))}
        </Box>
      </Box>

      <RecentlyViewedViewAllModal
        open={openSeeAll}
        onClose={() => setOpenSeeAll(false)}
        products={allProducts}
        title="Item That You’ll Love"
        subTitle="Browse all recommended products"
        emptyLabel="No recommended items found"
      />
    </HomeComponentsWrapper>
  );
};

export default LoveItem;
