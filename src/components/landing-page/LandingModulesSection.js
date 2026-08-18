import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  Stack,
  Fade,
  Skeleton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setSelectedModule } from "redux/slices/utils";
import { setResetStoredData } from "redux/slices/storedData";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import CustomContainer from "../container";
import CustomImageContainer from "../CustomImageContainer";

const MODULE_LIGHTER_SOLID_THEMES = {
  grocery: {
    bgColor: "#10B981", // Lighter Emerald
    hoverGlow: "rgba(16, 185, 129, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#047857",
    actionText: "Explore Grocery",
    icon: <LocalGroceryStoreOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
  food: {
    bgColor: "#F97316", // Lighter Coral Orange
    hoverGlow: "rgba(249, 115, 22, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#C2410C",
    actionText: "Order Food",
    icon: <RestaurantOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
  pharmacy: {
    bgColor: "#0284C7", // Lighter Sky Blue
    hoverGlow: "rgba(2, 132, 199, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#0369A1",
    actionText: "Get Medicines",
    icon: <LocalPharmacyOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
  ecommerce: {
    bgColor: "#8B5CF6", // Lighter Royal Purple
    hoverGlow: "rgba(139, 92, 246, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#6D28D9",
    actionText: "Shop Ecommerce",
    icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
  shop: {
    bgColor: "#7C3AED",
    hoverGlow: "rgba(124, 58, 237, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#5B21B6",
    actionText: "Explore Shops",
    icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
  rental: {
    bgColor: "#F59E0B",
    hoverGlow: "rgba(245, 158, 11, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#B45309",
    actionText: "Book Rental",
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
  parcel: {
    bgColor: "#3B82F6",
    hoverGlow: "rgba(59, 130, 246, 0.35)",
    btnBg: "#ffffff",
    btnColor: "#1D4ED8",
    actionText: "Send Parcel",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
  },
};

const DEFAULT_THEME = {
  bgColor: "#334155",
  hoverGlow: "rgba(51, 65, 85, 0.35)",
  btnBg: "#ffffff",
  btnColor: "#0F172A",
  actionText: "Start Shopping",
  icon: <StorefrontOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />,
};

const MODULE_DESCRIPTIONS = {
  grocery: "Fresh vegetables, fruits, groceries and daily home essentials.",
  food: "Delicious meals and dishes from top local restaurants.",
  pharmacy: "Prescription medicines, health supplements and personal care.",
  ecommerce: "Trending fashion, electronics, gadgets and lifestyle products.",
  shop: "Multi-category local retail stores and online shops.",
  rental: "Vehicles and equipment booking with instant confirmation.",
  parcel: "Send or receive packages across your city with live tracking.",
};

// Helper function to strip HTML tags from backend strings
const stripHtml = (htmlString) => {
  if (!htmlString) return "";
  return String(htmlString).replace(/<[^>]*>?/gm, "").trim();
};

const MODULE_TYPE_ALIASES = {
  grocery: "grocery",
  food: "food",
  restaurant: "food",
  pharmacy: "pharmacy",
  medicine: "pharmacy",
  ecommerce: "ecommerce",
  ecom: "ecommerce",
  shop: "ecommerce",
  rental: "rental",
  parcel: "parcel",
};

const inferModuleType = (item) => {
  // Prefer visible copy (title/button) so a copied admin card with the wrong
  // module_type/id still navigates to the module the user actually clicked.
  const visibleCopy = [
    item?.title,
    item?.module_name,
    item?.name,
    item?.button_text,
    item?.action_text,
    item?.btn_text,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/e-?commerce|shop now|mega ecom/.test(visibleCopy)) return "ecommerce";
  if (/pharm|medicine/.test(visibleCopy)) return "pharmacy";
  if (/food|dining|restaurant|menu/.test(visibleCopy)) return "food";
  if (/grocery/.test(visibleCopy)) return "grocery";
  if (/rental/.test(visibleCopy)) return "rental";
  if (/parcel/.test(visibleCopy)) return "parcel";

  const direct = String(item?.module_type || item?.type || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (MODULE_TYPE_ALIASES[direct]) return MODULE_TYPE_ALIASES[direct];
  return "";
};

const LandingModulesSection = ({ landingPageData: propLandingPageData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxLandingPageData = useSelector((state) => state.configData?.landingPageData);
  const landingPageData = propLandingPageData || reduxLandingPageData;

  const { data: modules = [], isLoading } = useGetModule();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionData =
    landingPageData?.modules_section ||
    landingPageData?.module_section ||
    landingPageData?.services_section ||
    landingPageData?.business_section;

  // Dynamic status check from Admin Panel (enabled by default unless explicitly disabled)
  const isEnabled =
    sectionData?.status !== 0 && sectionData?.status !== false && sectionData?.status !== "0";

  const sectionTag = sectionData?.tag || sectionData?.badge || sectionData?.section_tag;

  const sectionTitle =
    sectionData?.title?.trim() || "Marketplace Services & Modules";

  const sectionSubtitle =
    sectionData?.subtitle?.trim() ||
    sectionData?.sub_title?.trim() ||
    "Hover over a category card below to expand and discover top stores & products.";

  // Admin can provide custom cards in landingPageData OR fallback to standard modules API
  const adminCustomCards =
    sectionData?.cards ||
    sectionData?.modules ||
    landingPageData?.modules_list;

  const displayList =
    Array.isArray(adminCustomCards) && adminCustomCards.length > 0
      ? adminCustomCards
      : modules;

  const resolveApiModule = (item) => {
    const list = Array.isArray(modules) ? modules : [];
    const type = inferModuleType(item);
    const itemId = item?.id ?? item?.module_id ?? item?.moduleId;

    if (type) {
      const byType = list.find(
        (m) => String(m?.module_type || "").toLowerCase() === type
      );
      if (byType) return byType;
    }
    if (itemId != null && itemId !== "") {
      const byId = list.find((m) => String(m?.id) === String(itemId));
      if (byId) return byId;
    }
    return item;
  };

  const handleModuleClick = (item) => {
    const moduleItem = resolveApiModule(item);
    if (!moduleItem?.id) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("module", JSON.stringify(moduleItem));
      const moduleZoneIds = moduleItem?.zones?.map((zone) => zone.id) || [];
      let currentZone = null;
      try {
        currentZone = JSON.parse(localStorage.getItem("zoneid"));
      } catch (e) {
        currentZone = null;
      }
      const zoneServesModule =
        Array.isArray(currentZone) &&
        currentZone.length > 0 &&
        (moduleZoneIds.length === 0 ||
          currentZone.some((id) => moduleZoneIds.includes(id)));
      if (!zoneServesModule && moduleZoneIds.length > 0) {
        localStorage.setItem("zoneid", JSON.stringify(moduleZoneIds));
      }
    }
    dispatch(setResetStoredData());
    dispatch(setSelectedModule(moduleItem));
    router
      .push({
        pathname: "/home",
        query: { module_id: moduleItem.id },
      })
      .then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <Fade in={mounted} timeout={500}>
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          width: "100%",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.4)
              : "#F8FAFC",
        }}
      >
        <CustomContainer>
          {/* Section Header */}
          <Stack
            spacing={0.5}
            alignItems="flex-start"
            textAlign="left"
            mb={{ xs: 3, md: 4 }}
          >
            {Boolean(sectionTag) && (
              <Box
                sx={{
                  display: "inline-block",
                  px: 1.5,
                  py: 0.35,
                  borderRadius: "4px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 0.5,
                }}
              >
                {sectionTag}
              </Box>
            )}

            <Typography
              variant="h4"
              align="left"
              sx={{
                fontSize: { xs: "1.15rem", sm: "1.3rem", md: "1.45rem" },
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: "-0.2px",
              }}
            >
              {sectionTitle}
            </Typography>

            {Boolean(sectionSubtitle) && (
              <Typography
                variant="body2"
                align="left"
                sx={{
                  color: (theme) => alpha(theme.palette.neutral[500], 0.85),
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                }}
              >
                {sectionSubtitle}
              </Typography>
            )}
          </Stack>

          {/* Expanding Accordion Cards Container with 4px Border Radius */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 2.5 },
              width: "100%",
              minHeight: { xs: "auto", md: "270px" },
              isolation: "isolate",
              position: "relative",
            }}
          >
            {isLoading && displayList.length === 0
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <Box
                    key={`skel-${idx}`}
                    sx={{
                      flex: 1,
                      height: "270px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                ))
              : displayList?.map((item, index) => {
                  const typeKey = inferModuleType(item);

                  const modTheme =
                    MODULE_LIGHTER_SOLID_THEMES[typeKey] || DEFAULT_THEME;

                  const cardBgColor =
                    item?.theme_color ||
                    item?.color ||
                    item?.bg_color ||
                    modTheme.bgColor;

                  const cardHoverGlow =
                    item?.theme_color || item?.color
                      ? alpha(item?.theme_color || item?.color, 0.35)
                      : modTheme.hoverGlow;

                  const actionBtnText =
                    item?.button_text ||
                    item?.action_text ||
                    item?.btn_text ||
                    modTheme.actionText;

                  const cardTitle =
                    item?.title ||
                    item?.module_name ||
                    item?.name ||
                    `Module ${index + 1}`;

                  const description =
                    stripHtml(
                      item?.description ||
                      item?.sub_title ||
                      item?.subtitle ||
                      item?.short_description
                    ) ||
                    MODULE_DESCRIPTIONS[typeKey] ||
                    `Explore verified stores in ${cardTitle}.`;

                  const badgeText =
                    item?.badge_text ||
                    item?.tag ||
                    item?.badge ||
                    null;

                  const iconUrl =
                    item?.icon_full_url ||
                    item?.icon ||
                    item?.image_full_url ||
                    item?.image;

                  const resolvedModule = resolveApiModule(item);
                  const isSelected =
                    String(selectedModule?.id) === String(resolvedModule?.id);
                  const isHovered = hoveredIndex === index;
                  const isAnyHovered = hoveredIndex !== null;

                  let flexVal = 1;
                  if (isAnyHovered) {
                    flexVal = isHovered ? 1.85 : 0.72;
                  }

                  return (
                    <Box
                      key={`landing-module-${index}-${typeKey || "module"}-${resolvedModule?.id || item?.id || "x"}`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleModuleClick(item)}
                      sx={{
                        flex: { xs: "none", md: flexVal },
                        width: { xs: "100%", md: "auto" },
                        minWidth: 0,
                        zIndex: isHovered ? 2 : 1,
                        overflow: "hidden",
                        minHeight: { xs: "230px", sm: "250px", md: "270px" },
                        borderRadius: "4px",
                        p: { xs: 3, md: 3.5 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        position: "relative",
                        backgroundColor: cardBgColor,
                        color: "#ffffff",
                        border: isSelected
                          ? "2px solid #ffffff"
                          : "none",
                        boxShadow: isSelected || isHovered
                          ? `0px 14px 32px ${cardHoverGlow}`
                          : "0px 4px 14px rgba(0, 0, 0, 0.06)",
                        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                        transition:
                          "flex 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.35s ease, box-shadow 0.35s ease",
                        "&:hover": {
                          "& .shop-btn-arrow": {
                            transform: "translateX(5px)",
                          },
                        },
                      }}
                    >
                      {/* Optional Top Right Badge if configured by Admin */}
                      {Boolean(badgeText) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 14,
                            right: 14,
                            backgroundColor: "rgba(255, 255, 255, 0.28)",
                            backdropFilter: "blur(6px)",
                            color: "#ffffff",
                            px: 1.2,
                            py: 0.3,
                            borderRadius: "4px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.4px",
                            textTransform: "uppercase",
                          }}
                        >
                          {badgeText}
                        </Box>
                      )}

                      {/* Top Content */}
                      <Box>
                        {/* Frosted Glass Icon Badge */}
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "4px",
                            backgroundColor: "rgba(255, 255, 255, 0.22)",
                            backdropFilter: "blur(6px)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          {iconUrl && typeof iconUrl === "string" ? (
                            <CustomImageContainer
                              src={iconUrl}
                              alt={cardTitle}
                              width="28px"
                              height="28px"
                              objectFit="contain"
                            />
                          ) : (
                            modTheme.icon
                          )}
                        </Box>

                        {/* Module Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.25rem",
                            color: "#ffffff",
                            mb: 0.8,
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {cardTitle}
                        </Typography>

                        {/* Subtitle / Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.92)",
                            fontSize: "0.875rem",
                            lineHeight: 1.5,
                            minHeight: "40px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {description}
                        </Typography>
                      </Box>

                      {/* Action Button Footer */}
                      <Box mt={2.5}>
                        <Button
                          disableElevation
                          variant="contained"
                          fullWidth
                          sx={{
                            borderRadius: "4px",
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            py: 0.9,
                            backgroundColor: modTheme.btnBg,
                            color: modTheme.btnColor,
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                              opacity: 0.96,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <span>{actionBtnText}</span>
                          <ArrowForwardIcon
                            className="shop-btn-arrow"
                            sx={{
                              fontSize: 15,
                              transition: "transform 0.2s ease-in-out",
                            }}
                          />
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
          </Box>
        </CustomContainer>
      </Box>
    </Fade>
  );
};

export default LandingModulesSection;
