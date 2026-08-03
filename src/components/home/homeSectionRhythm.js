/**
 * Shared vertical rhythm: fixed header → Shop by Category (and matching bands).
 * Keep landing + ecommerce module home in sync.
 */
export const headerToCategoryBandSx = {
  mt: { xs: "20px", sm: "24px", md: "28px" },
  pt: { xs: 1.5, md: 2 },
  pb: { xs: 1.5, sm: 2, md: 2.5 },
  bgcolor: "background.paper",
};

export const categorySectionHeaderRowSx = {
  pt: { xs: 2, md: 2.5 },
  pb: 1.2,
};

/** Uniform vertical padding for module home sections below hero */
export const sectionBandPySx = {
  py: { xs: 1, sm: 1.25, md: 1.5 },
};

/** Landing + module banner grid — keep heights/widths identical */
export const bannerMainHeightSx = {
  xs: "160px",
  sm: "210px",
  md: "240px",
  lg: "260px",
};

export const bannerSideTileMinSx = {
  xs: "75px",
  sm: "100px",
  md: "115px",
  lg: "123px",
};

export const bannerSectionPySx = {
  py: { xs: "12px", sm: "16px", md: "20px" },
};

export const BANNER_SIDE_STACK_GAP_PX = 12;

/** Left-aligned module home section headers (ecommerce + marketplace). */
export const moduleSectionStackSx = {
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  textAlign: "left",
};

export const moduleSectionTitleSx = {
  textAlign: "left",
  alignSelf: "flex-start",
};
