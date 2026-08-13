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
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CustomContainer from "../container";

const DEFAULT_STEPS = [
  {
    step: "01",
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 34 }} />,
    title: "Select Location & Module",
    description:
      "Enter your delivery address and choose your module (Grocery, Food, Pharmacy, or E-Commerce).",
  },
  {
    step: "02",
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 34 }} />,
    title: "Choose Store & Products",
    description:
      "Browse verified local merchants, select your items or meals, and place your cart order.",
  },
  {
    step: "03",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 34 }} />,
    title: "Fast Express Delivery",
    description:
      "Relax while our delivery partners bring your items straight to your door in real-time.",
  },
];

const STEP_ICONS = [
  <LocationOnOutlinedIcon sx={{ fontSize: 34 }} key="1" />,
  <StorefrontOutlinedIcon sx={{ fontSize: 34 }} key="2" />,
  <LocalShippingOutlinedIcon sx={{ fontSize: 34 }} key="3" />,
];

const LandingHowItWorksSection = ({ landingPageData }) => {
  const theme = useTheme();

  const sectionData = landingPageData?.how_it_works_section;

  // Dynamic status check from Admin Panel
  const isEnabled =
    sectionData?.status !== 0 && sectionData?.status !== false;

  const rawTitle = sectionData?.title;
  const sectionTitle =
    rawTitle && rawTitle.trim() !== "" ? rawTitle : "How Ordering Works";

  const rawSubtitle = sectionData?.subtitle;
  const sectionSubtitle =
    rawSubtitle && rawSubtitle.trim() !== ""
      ? rawSubtitle
      : "Get your favorite products & meals delivered in 3 simple steps.";

  // Build steps list dynamically from Admin Panel
  let stepsList = DEFAULT_STEPS;
  if (Array.isArray(sectionData?.steps) && sectionData.steps.length > 0) {
    stepsList = sectionData.steps.map((item, idx) => {
      const iconUrl =
        item?.image_full_url ||
        item?.icon_full_url ||
        item?.image ||
        item?.icon_url;

      return {
        step: item?.step_number || `0${idx + 1}`,
        iconUrl: iconUrl && typeof iconUrl === "string" && iconUrl.startsWith("http") ? iconUrl : null,
        fallbackIcon: STEP_ICONS[idx % STEP_ICONS.length],
        title: item?.title || item?.step_title || `Step ${idx + 1}`,
        description: item?.description || item?.subtitle || item?.step_sub_title || "",
      };
    });
  } else if (
    sectionData?.step_1_title ||
    sectionData?.step_2_title ||
    sectionData?.step_3_title
  ) {
    stepsList = [
      {
        step: "01",
        iconUrl: sectionData?.step_1_image_full_url || sectionData?.step_1_image || null,
        fallbackIcon: <LocationOnOutlinedIcon sx={{ fontSize: 34 }} />,
        title: sectionData?.step_1_title || DEFAULT_STEPS[0].title,
        description: sectionData?.step_1_sub_title || DEFAULT_STEPS[0].description,
      },
      {
        step: "02",
        iconUrl: sectionData?.step_2_image_full_url || sectionData?.step_2_image || null,
        fallbackIcon: <StorefrontOutlinedIcon sx={{ fontSize: 34 }} />,
        title: sectionData?.step_2_title || DEFAULT_STEPS[1].title,
        description: sectionData?.step_2_sub_title || DEFAULT_STEPS[1].description,
      },
      {
        step: "03",
        iconUrl: sectionData?.step_3_image_full_url || sectionData?.step_3_image || null,
        fallbackIcon: <LocalShippingOutlinedIcon sx={{ fontSize: 34 }} />,
        title: sectionData?.step_3_title || DEFAULT_STEPS[2].title,
        description: sectionData?.step_3_sub_title || DEFAULT_STEPS[2].description,
      },
    ];
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        width: "100%",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.4)
            : theme.palette.neutral?.[100] || "#F8FAFC",
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

        {/* Steps Grid */}
        <Grid container spacing={3.5} justifyContent="center">
          {stepsList.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: "100%",
                  borderRadius: "16px",
                  textAlign: "center",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0px 10px 24px ${alpha(theme.palette.primary.main, 0.14)}`,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {/* Step Badge */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: 14,
                    right: 20,
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: alpha(theme.palette.primary.main, 0.15),
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </Typography>

                {/* Dynamic Step Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2.5,
                    overflow: "hidden",
                  }}
                >
                  {item.iconUrl ? (
                    <Box
                      component="img"
                      src={item.iconUrl}
                      alt={item.title}
                      sx={{
                        width: 32,
                        height: 32,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    item.icon || item.fallbackIcon
                  )}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: theme.palette.text.primary,
                    mb: 1,
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

export default LandingHowItWorksSection;
