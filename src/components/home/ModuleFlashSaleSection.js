import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
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
import { useGetFlashSales } from "api-manage/hooks/react-query/useGetFlashSales";
import { getModuleId } from "helper-functions/getModuleId";
import MarketplaceSectionHeader from "./MarketplaceSectionHeader";
import ModuleMarketplaceProductCard from "./ModuleMarketplaceProductCard";
import CustomCountdown from "../countdown";
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

/**
 * Module-only Flash Sale strip.
 * Uses /api/v1/flash-sales (moduleId header) — only shows when this module
 * has an active flash sale. Not used on landing page.
 */
const ModuleFlashSaleSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const scrollRef = useRef(null);
  const moduleId = getModuleId();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isStripHovered, setIsStripHovered] = useState(false);
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { data, refetch, isLoading, isFetching } = useGetFlashSales({
    limit: 20,
    offset: 1,
  });

  useEffect(() => {
    refetch();
  }, [moduleId, refetch]);

  const products = useMemo(() => {
    const rows = data?.active_products || [];
    return rows
      .map((row) => {
        const product = row?.item;
        if (!product) return null;
        return {
          ...product,
          sold: row?.sold ?? product?.sold,
          available_stock: row?.available_stock,
          stock: row?.available_stock ?? product?.stock,
          flash_sale: 1,
          flash_sale_id: data?.id,
        };
      })
      .filter(Boolean);
  }, [data]);

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

  const handleSeeAll = () => {
    if (!data?.id) return;
    router.push({
      pathname: "/flash-sales",
      query: { id: data.id },
    });
  };

  // Hide when no active flash sale for this module
  if (!isLoading && !isFetching && products.length === 0) return null;
  if (
    !isLoading &&
    data &&
    typeof data === "object" &&
    Object.keys(data).length === 0
  ) {
    return null;
  }

  const showLoading = isLoading && products.length === 0;
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

  const title = data?.title || "Flash Sale";
  const subtitle = "Limited-time flash sale products in this module";

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        mb={1.5}
      >
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <MarketplaceSectionHeader
            title={title}
            subtitle={subtitle}
            onSeeAll={data?.id ? handleSeeAll : undefined}
            mb={0}
          />
        </Box>
        {products.length > 0 && data?.end_date && (
          <Box sx={{ flexShrink: 0, pl: { sm: 1 } }}>
            <CustomCountdown
              startDate={data?.start_date}
              endDate={data?.end_date}
              startTime={data?.start_time}
              endTime={data?.end_time}
            />
          </Box>
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
              aria-label="Previous flash sale products"
              onClick={() => scrollStrip(-1)}
              sx={{ ...navSx(canScrollLeft), left: 0 }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              aria-label="Next flash sale products"
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
                <CardSkeleton key={`flash-mod-skel-${i}`} />
              ))
            : products.map((item) => (
                <Box
                  key={`flash-${item?.id}-${item?.flash_sale_id || ""}`}
                  sx={marketplaceStripCardSx}
                >
                  <ModuleMarketplaceProductCard item={item} />
                </Box>
              ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ModuleFlashSaleSection;
