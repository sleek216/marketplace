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

const LandingModulesSection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: modules = [], isLoading } = useGetModule();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModuleClick = (moduleItem) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("module", JSON.stringify(moduleItem));
    }
    dispatch(setResetStoredData());
    dispatch(setSelectedModule(moduleItem));
    router.push({
      pathname: "/home",
      query: { module_id: moduleItem.id },
    }).then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

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
              Marketplace Services & Modules
            </Typography>

            <Typography
              variant="body2"
              align="left"
              sx={{
                color: (theme) => alpha(theme.palette.neutral[500], 0.85),
                fontSize: { xs: "0.85rem", md: "0.95rem" },
              }}
            >
              Hover over a category card below to expand and discover top stores & products.
            </Typography>
          </Stack>

          {/* Expanding Accordion Cards Container with 4px Border Radius */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 2.5 },
              width: "100%",
              minHeight: { xs: "auto", md: "270px" },
            }}
          >
            {isLoading
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
              : modules?.map((item, index) => {
                  const typeKey = (
                    item?.module_type ||
                    item?.module_name ||
                    ""
                  ).toLowerCase();

                  const modTheme =
                    MODULE_LIGHTER_SOLID_THEMES[typeKey] || DEFAULT_THEME;

                  const description =
                    stripHtml(item?.description) ||
                    MODULE_DESCRIPTIONS[typeKey] ||
                    `Explore verified stores in ${item?.module_name}.`;

                  const isSelected =
                    String(selectedModule?.id) === String(item?.id);
                  const isHovered = hoveredIndex === index;
                  const isAnyHovered = hoveredIndex !== null;

                  let flexVal = 1;
                  if (isAnyHovered) {
                    flexVal = isHovered ? 1.85 : 0.72;
                  }

                  return (
                    <Box
                      key={item?.id || index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleModuleClick(item)}
                      sx={{
                        flex: { xs: "none", md: flexVal },
                        width: { xs: "100%", md: "auto" },
                        minHeight: { xs: "230px", sm: "250px", md: "270px" },
                        borderRadius: "4px",
                        p: { xs: 3, md: 3.5 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        backgroundColor: modTheme.bgColor,
                        color: "#ffffff",
                        border: isSelected
                          ? "2px solid #ffffff"
                          : "none",
                        boxShadow: isSelected || isHovered
                          ? `0px 14px 32px ${modTheme.hoverGlow}`
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
                          {item?.icon_full_url ? (
                            <CustomImageContainer
                              src={item.icon_full_url}
                              alt={item.module_name}
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
                          {item?.module_name}
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
                          <span>{modTheme.actionText}</span>
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
