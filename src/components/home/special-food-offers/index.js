import { useState } from "react";
import { useRouter } from "next/router";
import { alpha, Box, Button, Skeleton, Stack, useTheme } from "@mui/material";
import useGetDiscountedItems from "../../../api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import { getModuleId } from "helper-functions/getModuleId";
import MarketplaceSectionHeader from "../MarketplaceSectionHeader";
import ModuleMarketplaceProductCard from "../ModuleMarketplaceProductCard";
import ProductCardSimmer from "../../Shimmer/ProductCardSimmer";
import {
  flashDealsGridColumns,
  FLASH_DEALS_INITIAL_COUNT,
  marketplaceProductGridGap,
  marketplaceStripCardSx,
  marketplaceStripGapSx,
} from "components/landing-page/marketplaceCardLayout";

const StripCardSkeleton = () => {
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

const GridCardSkeleton = () => (
  <Box sx={{ display: "flex", minWidth: 0 }}>
    <ProductCardSimmer marginBottom="0" />
  </Box>
);

/**
 * Flash Deals / Special Offers
 * - layout="grid" → 5×5 grid + Load more (ecommerce)
 * - layout="strip" → horizontal scroll (food / default)
 */
const SpecialFoodOffers = ({ title, layout = "strip" }) => {
  const router = useRouter();
  const theme = useTheme();
  const isGrid = layout === "grid";
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, isFetching } = useGetDiscountedItems({
    offset: 1,
    limit: isGrid ? 100 : 15,
  });

  const products = data?.products || [];
  const resolvedTitle = title || "Flash Deals";
  const resolvedSubtitle =
    {
      "Flash Deals": "Limited-time deals across the marketplace",
      "Special Food Offers": "Fresh picks from top restaurants near you",
    }[resolvedTitle] || "Best offers picked for you";

  const visibleProducts = isGrid
    ? showAll
      ? products
      : products.slice(0, FLASH_DEALS_INITIAL_COUNT)
    : products;

  const hasMore =
    isGrid &&
    !showAll &&
    products.length > FLASH_DEALS_INITIAL_COUNT;

  const navigateToHome = () => {
    router
      .push({
        pathname: "/home",
        query: {
          search: "special-offer",
          module_id: getModuleId(),
          data_type: "discounted",
        },
      })
      .then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  if (!isLoading && !isFetching && products.length === 0) return null;

  const showLoading = isLoading && products.length === 0;

  return (
    <Box sx={{ width: "100%" }}>
      <MarketplaceSectionHeader
        title={resolvedTitle}
        subtitle={resolvedSubtitle}
        onSeeAll={navigateToHome}
      />

      {isGrid ? (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: flashDealsGridColumns,
              gap: marketplaceProductGridGap,
              minWidth: 0,
              width: "100%",
            }}
          >
            {showLoading
              ? Array.from({ length: FLASH_DEALS_INITIAL_COUNT }).map((_, i) => (
                  <GridCardSkeleton key={`offer-grid-skel-${i}`} />
                ))
              : visibleProducts.map((item) => (
                  <Box key={item?.id} sx={{ display: "flex", minWidth: 0 }}>
                    <ModuleMarketplaceProductCard item={item} />
                  </Box>
                ))}
          </Box>

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
              <Button
                onClick={() => setShowAll(true)}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "13px", md: "14px" },
                  borderRadius: "2px",
                  px: 3,
                  py: 1,
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                  },
                }}
              >
                Load more
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box
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
                <StripCardSkeleton key={`offer-strip-skel-${i}`} />
              ))
            : products.map((item) => (
                <Box key={item?.id} sx={marketplaceStripCardSx}>
                  <ModuleMarketplaceProductCard item={item} />
                </Box>
              ))}
        </Box>
      )}
    </Box>
  );
};

export default SpecialFoodOffers;
