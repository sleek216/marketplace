import React from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import CustomContainer from "components/container";
import CustomImageContainer from "components/CustomImageContainer";

const PromoDealsBanner = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const handleExploreDeals = () => {
    router.push("/store");
  };

  const handleLearnMore = () => {
    router.push("/about-us");
  };

  return (
    <CustomContainer sx={{ mb: { xs: 4, md: 5 } }}>
      <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="stretch">
        {/* LEFT CARD: Fresh Deals Every Day! */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              borderRadius: { xs: "18px", md: "22px" },
              overflow: "hidden",
              height: "100%",
              minHeight: { xs: "220px", sm: "240px", md: "230px" },
              background: `linear-gradient(135deg, #053ca8 0%, #032475 100%)`,
              color: "#ffffff",
              p: { xs: "24px 18px", sm: "30px 24px", md: "32px 32px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: `0 12px 30px ${alpha("#053ca8", 0.15)}`,
            }}
          >
            {/* Ambient background glow */}
            <Box
              sx={{
                position: "absolute",
                top: "-50px",
                left: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Left Content */}
            <Stack
              spacing={1.25}
              alignItems={{ xs: "center", sm: "flex-start" }}
              textAlign={{ xs: "center", sm: "left" }}
              sx={{ zIndex: 2, maxWidth: { sm: "240px", md: "260px" } }}
            >
              <Typography
                fontSize={{ xs: "22px", sm: "25px", md: "27px" }}
                fontWeight="800"
                sx={{ color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.01em" }}
              >
                {t("Fresh Deals Every Day!")}
              </Typography>

              <Typography
                fontSize={{ xs: "12.5px", sm: "13.5px" }}
                fontWeight="400"
                sx={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.45 }}
              >
                {t("Save more with our exclusive offers & discounts.")}
              </Typography>

              <Box pt={0.75}>
                <Button
                  variant="contained"
                  onClick={handleExploreDeals}
                  endIcon={<ArrowRight size={17} />}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#053ca8",
                    borderRadius: "9px",
                    px: 2.75,
                    py: 1,
                    fontSize: "13px",
                    fontWeight: "700",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f0f4ff",
                      color: "#032475",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("Explore Deals")}
                </Button>
              </Box>
            </Stack>

            {/* Yellow Scalloped UP TO 50% OFF Badge */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "14px", sm: "18px", md: "22px" },
                right: { xs: "130px", sm: "160px", md: "175px" },
                zIndex: 3,
                width: { xs: "62px", sm: "70px", md: "76px" },
                height: { xs: "62px", sm: "70px", md: "76px" },
                borderRadius: "50%",
                backgroundColor: "#ffd200",
                color: "#000000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                transform: "rotate(-6deg)",
                border: "2px dashed #e6bd00",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Typography fontSize="8px" fontWeight="800" sx={{ lineHeight: 1, opacity: 0.85 }}>
                UP TO
              </Typography>
              <Typography fontSize="16px" fontWeight="900" sx={{ lineHeight: 1.05 }}>
                50%
              </Typography>
              <Typography fontSize="8.5px" fontWeight="800" sx={{ lineHeight: 1, opacity: 0.85 }}>
                OFF
              </Typography>
            </Box>

            {/* Fresh Groceries Basket Illustration */}
            <Box
              sx={{
                width: { xs: "130px", sm: "170px", md: "190px" },
                height: "auto",
                flexShrink: 0,
                zIndex: 1,
                mr: { xs: 0, sm: -1 },
              }}
            >
              <CustomImageContainer
                src="/landingpage/fresh_deals_basket.png"
                alt="Fresh Deals"
                width="100%"
                height="100%"
                objectfit="contain"
              />
            </Box>
          </Box>
        </Grid>

        {/* RIGHT CARD: Fast Delivery You Can Trust */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              borderRadius: { xs: "18px", md: "22px" },
              overflow: "hidden",
              height: "100%",
              minHeight: { xs: "220px", sm: "240px", md: "230px" },
              background: `linear-gradient(135deg, #f0f4fd 0%, #ffffff 100%)`,
              border: `1px solid ${alpha(theme.palette.neutral[300], 0.6)}`,
              p: { xs: "24px 18px", sm: "30px 24px", md: "32px 32px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: `0 12px 30px ${alpha(theme.palette.neutral[900], 0.05)}`,
            }}
          >
            {/* Left Content */}
            <Stack
              spacing={1.25}
              alignItems={{ xs: "center", sm: "flex-start" }}
              textAlign={{ xs: "center", sm: "left" }}
              sx={{ zIndex: 2, maxWidth: { sm: "240px", md: "260px" } }}
            >
              <Typography
                fontSize={{ xs: "22px", sm: "25px", md: "27px" }}
                fontWeight="800"
                sx={{ color: "#062b88", lineHeight: 1.2, letterSpacing: "-0.01em" }}
              >
                {t("Fast Delivery You Can Trust")}
              </Typography>

              <Typography
                fontSize={{ xs: "12.5px", sm: "13.5px" }}
                fontWeight="400"
                sx={{ color: "#4b5563", lineHeight: 1.45 }}
              >
                {t("Get your orders in 30 minutes at your doorstep.")}
              </Typography>

              <Box pt={0.75}>
                <Button
                  variant="contained"
                  onClick={handleLearnMore}
                  endIcon={<ArrowRight size={17} />}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#053ca8",
                    borderRadius: "9px",
                    px: 2.75,
                    py: 1,
                    fontSize: "13px",
                    fontWeight: "700",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(5, 60, 168, 0.08)",
                    border: "1px solid rgba(5, 60, 168, 0.15)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#053ca8",
                      color: "#ffffff",
                      boxShadow: "0 6px 18px rgba(5, 60, 168, 0.25)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("Learn More")}
                </Button>
              </Box>
            </Stack>

            {/* Delivery Rider Scooter Illustration */}
            <Box
              sx={{
                width: { xs: "140px", sm: "185px", md: "205px" },
                height: "auto",
                flexShrink: 0,
                zIndex: 1,
                mr: { xs: 0, sm: -1 },
              }}
            >
              <CustomImageContainer
                src="/landingpage/delivery_rider_scooter.png"
                alt="Fast Delivery"
                width="100%"
                height="100%"
                objectfit="contain"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </CustomContainer>
  );
};

export default PromoDealsBanner;
