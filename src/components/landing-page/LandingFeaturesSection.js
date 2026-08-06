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

const FEATURES = [
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

const LandingFeaturesSection = () => {
  const theme = useTheme();

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
              fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: "left",
            }}
          >
            Why Shop On Our Marketplace?
          </Typography>
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
            We provide a fast, secure, and multi-category online shopping platform.
          </Typography>
        </Stack>

        {/* Feature Cards Grid */}
        <Grid container spacing={3}>
          {FEATURES.map((item, index) => (
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
                  }}
                >
                  {item.icon}
                </Box>
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
