import React, { useRef } from "react";
import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useGetFeaturedCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import CustomContainer from "../../container";
import LandingCategoryTile from "../LandingCategoryTile";
import {
  categorySectionHeaderRowSx,
  headerToCategoryBandSx,
} from "../homeSectionRhythm";
import {
  CategoryScrollItem,
  CategoryScrollStrip,
  scrollCategoryStrip,
  useCategoryAutoScroll,
} from "../CategoryHorizontalStrip";

const CategoryStripShimmer = () => (
  <CategoryScrollStrip>
    {[...Array(8)].map((_, index) => (
      <CategoryScrollItem key={index}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            width: "100%",
          }}
        >
          <Skeleton variant="circular" width={68} height={68} />
          <Skeleton variant="text" width={56} sx={{ mt: 1.2 }} />
        </Box>
      </CategoryScrollItem>
    ))}
  </CategoryScrollStrip>
);

/** Landing-parity Shop by Category strip — all modules (Grocery, Food, Pharmacy, Ecommerce) */
const FeaturedCategories = () => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedCategories();
  const { data: allData, isLoading: allLoading } = useGetAllModulesCategories();

  const categories =
    featuredData?.data && featuredData?.data?.length > 0
      ? featuredData?.data
      : allData?.data || [];
  const isLoading = (featuredLoading || allLoading) && categories.length === 0;

  useCategoryAutoScroll(scrollRef, {
    enabled: categories.length > 1,
    intervalMs: 3000,
    pauseOnHover: true,
  });

  const handleScroll = (direction) => {
    scrollCategoryStrip(scrollRef, direction);
  };

  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <Box sx={{ ...headerToCategoryBandSx, width: "100%" }}>
      <CustomContainer>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={categorySectionHeaderRowSx}
        >
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: "0.02em",
            }}
          >
            Shop by Category
          </Typography>

          {!isLoading && categories.length > 0 && (
            <Stack direction="row" gap={1}>
              <IconButton
                aria-label="Previous categories"
                onClick={() => handleScroll("left")}
                size="small"
                sx={{
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                  color: theme.palette.text.primary,
                  p: 0.8,
                  "&:hover": { background: "rgba(0,0,0,0.04)" },
                }}
              >
                <ArrowBackIosIcon sx={{ fontSize: 12, pl: "4px" }} />
              </IconButton>
              <IconButton
                aria-label="Next categories"
                onClick={() => handleScroll("right")}
                size="small"
                sx={{
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                  color: theme.palette.text.primary,
                  p: 0.8,
                  "&:hover": { background: "rgba(0,0,0,0.04)" },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 12, pl: "2px" }} />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </CustomContainer>

      <CustomContainer>
        {isLoading ? (
          <CategoryStripShimmer />
        ) : (
          <CategoryScrollStrip ref={scrollRef}>
            {categories.map((cat, index) => (
              <CategoryScrollItem key={cat?.id || cat?.name || index}>
                <LandingCategoryTile category={cat} />
              </CategoryScrollItem>
            ))}
          </CategoryScrollStrip>
        )}
      </CustomContainer>
    </Box>
  );
};

export default FeaturedCategories;
