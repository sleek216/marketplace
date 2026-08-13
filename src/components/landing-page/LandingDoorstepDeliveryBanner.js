import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setSelectedModule } from "redux/slices/utils";
import { setResetStoredData } from "redux/slices/storedData";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import CustomContainer from "../container";

const LandingDoorstepDeliveryBanner = ({ landingPageData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: modules = [] } = useGetModule();

  const sectionData =
    landingPageData?.doorstep_banner_section ||
    landingPageData?.promotional_banner_section;

  // Dynamic status check from Admin Panel
  const isEnabled =
    sectionData?.status !== 0 && sectionData?.status !== false;

  const rawTitle = sectionData?.title;
  const bannerTitle =
    rawTitle && rawTitle.trim() !== ""
      ? rawTitle
      : "Groceries Delivery at your door step";

  const rawSubtitle = sectionData?.subtitle;
  const bannerSubtitle =
    rawSubtitle && rawSubtitle.trim() !== ""
      ? rawSubtitle
      : "Fresh groceries and daily essentials delivered straight to your doorstep with care";

  const buttonText = sectionData?.button_name || sectionData?.button_text || "Shop Now";

  const customDeliveryImage =
    sectionData?.image_full_url ||
    sectionData?.image ||
    "/static/delivery_guy_large.png";

  const handleShopNow = () => {
    const groceryModule =
      modules?.find(
        (m) =>
          m?.module_type === "grocery" ||
          m?.module_name?.toLowerCase().includes("grocery")
      ) || modules?.[0];

    if (groceryModule) {
      if (typeof window !== "undefined") {
        localStorage.setItem("module", JSON.stringify(groceryModule));
      }
      dispatch(setResetStoredData());
      dispatch(setSelectedModule(groceryModule));
      router
        .push({
          pathname: "/home",
          query: { module_id: groceryModule.id },
        })
        .then(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
    } else {
      router.push("/search?search=");
    }
  };

  if (!isEnabled) {
    return null;
  }

  const isDarkMode = theme.palette.mode === "dark";
  const primaryTeal = isDarkMode ? "#38BDF8" : "#0C4D52";
  const textColorSecondary = isDarkMode ? "#94A3B8" : "#516C73";
  const cardBg = isDarkMode ? alpha(theme.palette.background.paper, 0.9) : "#FFFFFF";
  const borderColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0";

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4, md: 5 },
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <CustomContainer>
        <Box
          sx={{
            width: "100%",
            backgroundColor: cardBg,
            borderRadius: { xs: "16px", sm: "20px", md: "24px" },
            border: `1px solid ${borderColor}`,
            boxShadow: isDarkMode
              ? "0px 8px 30px rgba(0, 0, 0, 0.4)"
              : "0px 2px 14px rgba(0, 0, 0, 0.02)",
            px: { xs: 2.5, sm: 4, md: 5, lg: 6 },
            py: { xs: 3, sm: 3.5, md: 3 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 3, sm: 4, md: 3 },
            position: "relative",
            overflow: "hidden",
            minHeight: { md: "240px" },
          }}
        >
          {/* Left Column: Delivery Guy Image / Custom Admin Image */}
          <Box
            sx={{
              width: { xs: "100%", md: "32%", lg: "30%" },
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: "flex-end",
              height: { xs: "auto", md: "100%" },
              alignSelf: { xs: "center", md: "stretch" },
            }}
          >
            <Box
              component="img"
              src={customDeliveryImage}
              alt={bannerTitle}
              sx={{
                width: "100%",
                maxWidth: { xs: "240px", sm: "280px", md: "310px", lg: "340px" },
                height: { xs: "200px", sm: "240px", md: "250px", lg: "270px" },
                objectFit: "contain",
                objectPosition: "bottom center",
              }}
            />
          </Box>

          {/* Middle Column: Headline, Subtitle & Action Button */}
          <Box
            sx={{
              width: { xs: "100%", md: "46%", lg: "48%" },
              textAlign: { xs: "center", md: "left" },
              py: { xs: 0.5, md: 1 },
            }}
          >
            <Stack
              spacing={{ xs: 1.5, sm: 2 }}
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              {/* Main Headline */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.45rem", md: "1.65rem" },
                  fontWeight: 700,
                  color: primaryTeal,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  fontFamily: "inherit",
                }}
              >
                {bannerTitle}
              </Typography>

              {/* Subtitle Paragraph */}
              {Boolean(bannerSubtitle) && (
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
                    color: textColorSecondary,
                    lineHeight: 1.5,
                    maxWidth: { xs: "100%", sm: "460px" },
                    fontWeight: 400,
                  }}
                >
                  {bannerSubtitle}
                </Typography>
              )}

              {/* Action Button */}
              <Box pt={{ xs: 0.5, md: 1 }}>
                <Button
                  onClick={handleShopNow}
                  disableElevation
                  variant="contained"
                  sx={{
                    backgroundColor: isDarkMode ? "#0284C7" : "#0C4D52",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.925rem" },
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 1, sm: 1.15 },
                    borderRadius: "8px",
                    textTransform: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#0369A1" : "#08373A",
                      boxShadow: "0px 4px 12px rgba(12, 77, 82, 0.25)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {buttonText}{" "}
                  <NorthEastIcon
                    sx={{
                      fontSize: { xs: 16, sm: 18 },
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                    }}
                  />
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Right Column: Circular Stamp Badge */}
          <Box
            sx={{
              width: { xs: "100%", md: "22%", lg: "22%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: { xs: 1, md: 0 },
            }}
          >
            <Box
              sx={{
                width: { xs: 135, sm: 150, md: 160 },
                height: { xs: 135, sm: 150, md: 160 },
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Spinning Circular Text */}
              <Box
                component="svg"
                viewBox="0 0 160 160"
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  animation: "spin 20s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                {/* Thin dashed guide circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="none"
                  stroke={isDarkMode ? "rgba(255,255,255,0.15)" : "#E2E8F0"}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <path
                  id="deliveryCirclePath"
                  d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                  fill="none"
                />
                <text
                  fill={isDarkMode ? "#94A3B8" : "#0C4D52"}
                  fontSize="9.5"
                  fontWeight="700"
                  letterSpacing="2.8"
                  style={{ fontFamily: "sans-serif" }}
                >
                  <textPath href="#deliveryCirclePath" startOffset="0%">
                    • SAME DAY DELIVERY • SAME DAY DELIVERY •
                  </textPath>
                </text>
              </Box>

              {/* Center Dark Circle with Neon Green Grocery Delivery Truck */}
              <Box
                sx={{
                  width: { xs: 72, sm: 82, md: 86 },
                  height: { xs: 72, sm: 82, md: 86 },
                  borderRadius: "50%",
                  backgroundColor: isDarkMode ? "#0F172A" : "#0C4D52",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 14px rgba(12, 77, 82, 0.2)",
                  zIndex: 2,
                }}
              >
                {/* Neon Green Grocery Delivery Truck Icon */}
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  sx={{
                    width: { xs: 36, sm: 42, md: 44 },
                    height: { xs: 36, sm: 42, md: 44 },
                    fill: "#39DB80",
                  }}
                >
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5-1.5zm13.5-1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-1.5-6H4V6h11v5h3l2.25 3H18v-3z" />
                  <rect x="7" y="9" width="5" height="4" rx="0.5" fill="#22C55E" opacity="0.9" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomContainer>
    </Box>
  );
};

export default LandingDoorstepDeliveryBanner;
