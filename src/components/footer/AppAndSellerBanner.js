import React from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import CustomContainer from "components/container";
import CustomImageContainer from "components/CustomImageContainer";

const AppAndSellerBanner = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const playStoreLink =
    landingPageData?.download_app_section?.react_download_status === "1"
      ? landingPageData?.download_app_section?.react_download_link
      : configData?.play_store_config?.link ||
        configData?.landing_page_links?.app_url_android ||
        "#";

  const appStoreLink =
    landingPageData?.download_app_section?.provider_app_store_status === "1"
      ? landingPageData?.download_app_section?.provider_app_store_link
      : configData?.apple_store_config?.link ||
        configData?.landing_page_links?.app_url_ios ||
        "#";

  const handleSellerJoin = () => {
    router.push("/store-registration");
  };

  return (
    <CustomContainer sx={{ mb: { xs: 3, md: 4 } }}>
      <Box
        sx={{
          borderRadius: { xs: "16px", md: "24px" },
          overflow: "hidden",
          boxShadow: `0 16px 40px ${alpha(theme.palette.neutral[900], 0.08)}`,
          border: `1px solid ${alpha(theme.palette.neutral[300], 0.6)}`,
          background: theme.palette.background.paper,
        }}
      >
        <Grid container alignItems="stretch">
          {/* Left Side: Download Our App */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              background: `linear-gradient(135deg, #0738a6 0%, #031e67 100%)`,
              position: "relative",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: { xs: "28px 20px", sm: "36px 30px", md: "40px 44px" },
            }}
          >
            {/* Background Accent glow circles */}
            <Box
              sx={{
                position: "absolute",
                top: "-60px",
                left: "-60px",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
                pointerEvents: "none",
              }}
            />

            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={7} md={7}>
                <Stack spacing={1.5} alignItems={{ xs: "center", sm: "flex-start" }} textAlign={{ xs: "center", sm: "left" }}>
                  <Typography
                    fontSize={{ xs: "22px", sm: "26px", md: "30px" }}
                    fontWeight="800"
                    sx={{ color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                  >
                    {t("Download Our App")}
                  </Typography>
                  <Typography
                    fontSize={{ xs: "13px", sm: "14px" }}
                    fontWeight="400"
                    sx={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.5, maxWidth: "300px" }}
                  >
                    {t("For a better shopping experience & exclusive app offers!")}
                  </Typography>

                  {/* App Store Buttons */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    pt={1}
                    flexWrap="wrap"
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    useFlexGap
                  >
                    {/* Google Play */}
                    <Box
                      component="a"
                      href={playStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      <svg width="22" height="24" viewBox="0 0 512 512" fill="none">
                        <path d="M47.2 25L257.6 235.4 47.2 445.8V25z" fill="#00E676" />
                        <path d="M47.2 25L323.4 184.6l-65.8 50.8L47.2 25z" fill="#FF3D00" />
                        <path d="M47.2 445.8L257.6 235.4l65.8 50.8L47.2 445.8z" fill="#FFC107" />
                        <path d="M464.8 235.4c14.2 8.2 14.2 21.6 0 29.8l-75.6 43.6-65.8-50.8 65.8-50.8 75.6 43.6z" fill="#00B0FF" />
                      </svg>
                      <Stack alignItems="flex-start" spacing={0}>
                        <Typography fontSize="8px" fontWeight="600" sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          GET IT ON
                        </Typography>
                        <Typography fontSize="13px" fontWeight="700" sx={{ lineHeight: 1.1 }}>
                          Google Play
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Apple App Store */}
                    <Box
                      component="a"
                      href={appStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      <svg width="20" height="24" viewBox="0 0 170 170" fill="#ffffff">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.24-9.97-1.87-14.81-6.35-3.26-3.03-7.23-7.91-11.91-14.64-5.9-8.47-10.59-17.84-14.07-28.11-3.48-10.27-5.22-20.21-5.22-29.83 0-14.03 3.63-25.7 10.89-35.01 7.26-9.31 16.39-14.07 27.38-14.28 5.17-.11 10.45 1.16 15.84 3.82 5.39 2.65 9.17 3.98 11.34 3.98 1.95 0 5.86-1.38 11.73-4.14 5.87-2.76 10.89-4.03 15.07-3.82 12.01.64 21.65 5.25 28.92 13.84-10.61 6.42-15.79 15.34-15.54 26.77.25 8.92 3.67 16.48 10.27 22.68 6.6 6.2 14.54 9.68 23.82 10.44-2.28 6.74-5.32 13.44-9.13 20.1zM119.22 31.74c0-6.84 2.5-13.37 7.5-19.59 5-6.22 11.33-10.15 18.99-11.79.54 1.19.81 2.49.81 3.9 0 6.94-2.58 13.56-7.74 19.86-5.16 6.3-11.47 10.18-18.93 11.64-.11-.98-.63-2.32-.63-4.02z" />
                      </svg>
                      <Stack alignItems="flex-start" spacing={0}>
                        <Typography fontSize="8px" fontWeight="600" sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Download on the
                        </Typography>
                        <Typography fontSize="13px" fontWeight="700" sx={{ lineHeight: 1.1 }}>
                          App Store
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>

              {/* Phone Mockup in Left/Center */}
              <Grid
                item
                xs={12}
                sm={5}
                md={5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "160px", sm: "190px", md: "210px" },
                    height: "auto",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.04) rotate(-1deg)",
                    },
                  }}
                >
                  <CustomImageContainer
                    src="/landingpage/phone_app_mockup.png"
                    alt="App Preview"
                    width="100%"
                    height="100%"
                    objectfit="contain"
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Side: Become a Seller */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              background: `linear-gradient(135deg, #f0f4fd 0%, #ffffff 100%)`,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: { xs: "28px 20px", sm: "36px 30px", md: "40px 44px" },
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={7} md={7}>
                <Stack spacing={1.5} alignItems={{ xs: "center", sm: "flex-start" }} textAlign={{ xs: "center", sm: "left" }}>
                  <Typography
                    fontSize={{ xs: "22px", sm: "26px", md: "30px" }}
                    fontWeight="800"
                    sx={{ color: "#062b88", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                  >
                    {t("Become a Seller")}
                  </Typography>
                  <Typography
                    fontSize={{ xs: "13px", sm: "14px" }}
                    fontWeight="400"
                    sx={{ color: "#4a5568", lineHeight: 1.5, maxWidth: "310px" }}
                  >
                    {t("Grow your business with us and reach thousands of happy customers.")}
                  </Typography>

                  <Box pt={1}>
                    <Button
                      variant="outlined"
                      onClick={handleSellerJoin}
                      endIcon={<ArrowRight size={18} />}
                      sx={{
                        backgroundColor: "#ffffff",
                        color: "#0738a6",
                        borderColor: "#0738a6",
                        borderWidth: "1.5px",
                        borderRadius: "10px",
                        px: 3,
                        py: 1.1,
                        fontSize: "14px",
                        fontWeight: "700",
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(7, 56, 166, 0.08)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#0738a6",
                          color: "#ffffff",
                          borderColor: "#0738a6",
                          boxShadow: "0 8px 20px rgba(7, 56, 166, 0.25)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {t("Join Now")}
                    </Button>
                  </Box>
                </Stack>
              </Grid>

              {/* 3D Store Illustration on Far Right */}
              <Grid
                item
                xs={12}
                sm={5}
                md={5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "140px", sm: "170px", md: "195px" },
                    height: "auto",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CustomImageContainer
                    src="/landingpage/seller_store_3d.png"
                    alt="Become a Seller"
                    width="100%"
                    height="100%"
                    objectfit="contain"
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CustomContainer>
  );
};

export default AppAndSellerBanner;
