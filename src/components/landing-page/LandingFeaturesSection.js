import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  alpha,
  useTheme,
  Stack,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CustomContainer from "../container";

const DEFAULT_FEATURES = [
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Express Doorstep Delivery",
    description:
      "Get your orders delivered in under 30 minutes with live real-time tracking.",
  },
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "100% Quality Assurance",
    description:
      "Every item is handpicked from verified merchants with strict quality standards.",
  },
  {
    icon: <DiscountOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Unbeatable Daily Deals",
    description:
      "Save on groceries, food, medicine & retail items with daily promos and coupons.",
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available around the clock to assist your orders.",
  },
  {
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Verified Local Stores",
    description:
      "Shop directly from thousands of trusted local stores & international brands.",
  },
  {
    icon: <AutorenewOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Hassle-Free Returns",
    description:
      "Easy returns and quick resolution for a confident online shopping experience.",
  },
];

const FEATURE_ICONS = [
  <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} key="1" />,
  <VerifiedOutlinedIcon sx={{ fontSize: 32 }} key="2" />,
  <DiscountOutlinedIcon sx={{ fontSize: 32 }} key="3" />,
  <SupportAgentOutlinedIcon sx={{ fontSize: 32 }} key="4" />,
  <StorefrontOutlinedIcon sx={{ fontSize: 32 }} key="5" />,
  <AutorenewOutlinedIcon sx={{ fontSize: 32 }} key="6" />,
];

const LandingFeaturesSection = ({ landingPageData }) => {
  const theme = useTheme();

  const sectionData =
    landingPageData?.why_choose_us_section ||
    landingPageData?.features_section ||
    landingPageData?.why_choose_us;

  // Dynamic status check from Admin Panel
  const isEnabled =
    sectionData?.status !== 0 && sectionData?.status !== false;

  const rawTitle = sectionData?.title;
  const sectionTitle =
    rawTitle && rawTitle.trim() !== ""
      ? rawTitle
      : "Why Shop On Our Marketplace?";

  const rawSubtitle = sectionData?.subtitle;
  const sectionSubtitle =
    rawSubtitle && rawSubtitle.trim() !== ""
      ? rawSubtitle
      : "We provide a fast, secure, and multi-category online shopping platform.";

  // Build features list dynamically from Admin Panel
  let featuresList = DEFAULT_FEATURES;
  const rawList =
    sectionData?.features ||
    sectionData?.list ||
    sectionData?.cards ||
    landingPageData?.why_choose_us_list;

  if (Array.isArray(rawList) && rawList.length > 0) {
    featuresList = rawList.map((item, idx) => {
      const iconUrl =
        item?.image_full_url ||
        item?.icon_full_url ||
        item?.image ||
        item?.icon_url;

      return {
        iconUrl: iconUrl && typeof iconUrl === "string" && iconUrl.startsWith("http") ? iconUrl : null,
        fallbackIcon: FEATURE_ICONS[idx % FEATURE_ICONS.length],
        title: item?.title || item?.feature_title || `Feature ${idx + 1}`,
        description: item?.description || item?.subtitle || item?.feature_sub_title || "",
      };
    });
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        width: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CustomContainer>
        {/* Section Header */}
        <Stack spacing={1} alignItems="flex-start" textAlign="left" mb={{ xs: 4, md: 5 }}>
          <Typography
            variant="h4"
            align="left"
            sx={{
              fontSize: { xs: "1.15rem", sm: "1.3rem", md: "1.45rem" },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: "left",
            }}
          >
            {sectionTitle}
          </Typography>
          {Boolean(sectionSubtitle) && (
            <Typography
              variant="body1"
              align="left"
              sx={{
                color: (theme) => alpha(theme.palette.neutral[500], 0.85),
                maxWidth: "600px",
                fontSize: { xs: "0.875rem", md: "1rem" },
                textAlign: "left",
              }}
            >
              {sectionSubtitle}
            </Typography>
          )}
        </Stack>

        {/* Feature Cards Grid */}
        <Grid container spacing={3}>
          {featuresList.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: "16px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.6)
                      : theme.palette.neutral?.[100] || "#FAFAFA",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0px 10px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                    borderColor: theme.palette.primary.main,
                    "& .feature-icon": {
                      backgroundColor: theme.palette.primary.main,
                      color: "#ffffff",
                    },
                  },
                }}
              >
                {/* Dynamic Icon Container */}
                <Box
                  className="feature-icon"
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  {item.iconUrl ? (
                    <Box
                      component="img"
                      src={item.iconUrl}
                      alt={item.title}
                      sx={{
                        width: 28,
                        height: 28,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    item.icon || item.fallbackIcon
                  )}
                </Box>

                {/* Card Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: theme.palette.text.primary,
                    mb: 0.8,
                  }}
                >
                  {item.title}
                </Typography>

                {/* Card Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) => alpha(theme.palette.neutral[500], 0.8),
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                  }}
                >
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CustomContainer>
    </Box>
  );
};

export default LandingFeaturesSection;
