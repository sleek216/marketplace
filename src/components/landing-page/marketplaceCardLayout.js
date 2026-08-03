/**
 * Shared marketplace product card sizing so strip sections
 * (Recently Viewed, Flash Deals) match All Products grid cells.
 *
 * All Products grid:
 *  xs: 2 | sm: 3 | md: 4 | lg: 5 | xl: 6
 *  gap: xs 8px | sm 10px | md+ 12px
 */
export const marketplaceProductGridColumns = {
  xs: "repeat(2, minmax(0, 1fr))",
  sm: "repeat(3, minmax(0, 1fr))",
  md: "repeat(4, minmax(0, 1fr))",
  lg: "repeat(5, minmax(0, 1fr))",
  xl: "repeat(6, minmax(0, 1fr))",
};

export const marketplaceProductGridGap = {
  xs: 1, // 8px
  sm: 1.25, // 10px
  md: 1.5, // 12px
};

/** Flash Deals on ecommerce home — 5 columns × 5 rows (25) on desktop */
export const flashDealsGridColumns = {
  xs: "repeat(2, minmax(0, 1fr))",
  sm: "repeat(3, minmax(0, 1fr))",
  md: "repeat(5, minmax(0, 1fr))",
  lg: "repeat(5, minmax(0, 1fr))",
  xl: "repeat(5, minmax(0, 1fr))",
};

export const FLASH_DEALS_INITIAL_COUNT = 25;

/** Fixed flex basis for horizontal carousels — 1 grid column wide */
export const marketplaceStripCardSx = {
  flex: {
    xs: "0 0 calc((100% - 8px) / 2)",
    sm: "0 0 calc((100% - 20px) / 3)",
    md: "0 0 calc((100% - 36px) / 4)",
    lg: "0 0 calc((100% - 48px) / 5)",
    xl: "0 0 calc((100% - 60px) / 6)",
  },
  width: {
    xs: "calc((100% - 8px) / 2)",
    sm: "calc((100% - 20px) / 3)",
    md: "calc((100% - 36px) / 4)",
    lg: "calc((100% - 48px) / 5)",
    xl: "calc((100% - 60px) / 6)",
  },
  maxWidth: {
    xs: "calc((100% - 8px) / 2)",
    sm: "calc((100% - 20px) / 3)",
    md: "calc((100% - 36px) / 4)",
    lg: "calc((100% - 48px) / 5)",
    xl: "calc((100% - 60px) / 6)",
  },
  scrollSnapAlign: "start",
  boxSizing: "border-box",
};

export const marketplaceStripGapSx = {
  xs: 1,
  sm: 1.25,
  md: 1.5,
};
