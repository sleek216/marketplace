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

const STEPS = [
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

const LandingHowItWorksSection = () => {
  const theme = useTheme();

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
              fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: "left",
            }}
          >
            How Ordering Works
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
            Get your favorite products & meals delivered in 3 simple steps.
          </Typography>
        </Stack>

        {/* Steps Grid */}
        <Grid container spacing={3.5} justifyContent="center">
          {STEPS.map((item, index) => (
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

                {/* Step Icon */}
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
                  }}
                >
                  {item.icon}
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
