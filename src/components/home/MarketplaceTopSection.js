import React from "react";
import { Box } from "@mui/material";
import FeaturedCategories from "./featured-categories";
import LandingTrustStrip from "./LandingTrustStrip";

/**
 * Landing-parity top block: Shop by Category → Banners → Trust strip.
 * Used on all module home pages (Ecommerce, Food, Grocery, Pharmacy).
 */
const MarketplaceTopSection = ({ children }) => (
  <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
    <FeaturedCategories />
    {children}
    <LandingTrustStrip />
  </Box>
);

export default MarketplaceTopSection;
