import React from "react";
import { Box, Grid, Stack, Typography, useTheme, alpha } from "@mui/material";
import CustomContainer from "../container";

const LandingAppDownloadBannerSection = ({ configData, landingPageData }) => {
  const theme = useTheme();

  // Dynamic admin config checks
  const isEnabled =
    landingPageData?.download_app_section?.status !== 0 &&
    landingPageData?.download_app_section?.status !== false;

  const rawTitle = landingPageData?.download_app_section?.title;
  const bannerTitle =
    rawTitle && rawTitle.trim() !== ""
      ? rawTitle
      : "Stay Home and Get All Your Essentials From Our Market!";

  const rawSubtitle = landingPageData?.download_app_section?.subtitle;
  const bannerSubtitle =
    rawSubtitle && rawSubtitle.trim() !== ""
      ? rawSubtitle
      : "Download the app from app store or google play";

  // Custom Banner Image uploaded via Admin Panel (if any)
  const customBannerImage =
    landingPageData?.download_app_section?.image_full_url ||
    landingPageData?.download_app_section?.banner_image_full_url ||
    landingPageData?.download_app_section?.image;

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

  if (!isEnabled) {
    return null;
  }

  return (
    <Box
      sx={{
        pt: { xs: 2, sm: 3, md: 3.5 },
        pb: { xs: 5, sm: 6.5, md: 8 },
        mb: { xs: 3, sm: 4, md: 5 },
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <CustomContainer>
        {/* If Admin uploaded a custom full-width banner image matching Hero Banner ratio */}
        {customBannerImage ? (
          <Box
            sx={{
              position: "relative",
              borderRadius: { xs: "12px", sm: "16px", md: "20px" },
              overflow: "hidden",
              boxShadow: "none",
              cursor: "pointer",
              width: "100%",
              minHeight: { xs: "190px", sm: "240px", md: "280px", lg: "300px" },
              height: { xs: "190px", sm: "240px", md: "280px", lg: "300px" },
            }}
            onClick={() => {
              if (playStoreLink && playStoreLink !== "#") {
                window.open(playStoreLink, "_blank");
              }
            }}
          >
            <Box
              component="img"
              src={customBannerImage}
              alt={bannerTitle}
              sx={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                borderRadius: { xs: "12px", sm: "16px", md: "20px" },
              }}
            />
          </Box>
        ) : (
          /* Default Interactive Theme Blue Banner Card matching Hero Banner Ratio */
          <Box
            sx={{
              position: "relative",
              borderRadius: { xs: "12px", sm: "16px", md: "20px" },
              backgroundColor: theme.palette.primary.main, // Theme Primary Blue
              color: "#FFFFFF",
              overflow: "hidden",
              boxShadow: "none",
              p: { xs: "24px 18px", sm: "32px 28px", md: "36px 44px" },
              minHeight: { xs: "190px", sm: "240px", md: "280px", lg: "300px" },
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Top-Left Curly Doodle Decorative Lines */}
            <Box
              sx={{
                position: "absolute",
                top: 15,
                left: 25,
                width: 70,
                height: 70,
                pointerEvents: "none",
                opacity: 0.2,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <path
                  d="M10 50 Q30 10, 50 50 T90 50"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </Box>

            {/* Top-Right 3 Wavy Decorative Lines */}
            <Box
              sx={{
                position: "absolute",
                top: 18,
                right: { xs: 15, md: 320 },
                width: 60,
                height: 35,
                pointerEvents: "none",
                opacity: 0.2,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 80 40" fill="none">
                <path d="M0 10 Q20 0, 40 10 T80 10" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M0 20 Q20 10, 40 20 T80 20" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M0 30 Q20 20, 40 30 T80 30" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>
            </Box>

            <Grid container alignItems="center" spacing={{ xs: 2, md: 3 }}>
              {/* Left Content Column */}
              <Grid item xs={12} md={7} lg={7.5}>
                <Stack
                  spacing={1.5}
                  alignItems={{ xs: "center", md: "flex-start" }}
                  textAlign={{ xs: "center", md: "left" }}
                  sx={{ zIndex: 3, position: "relative" }}
                >
                  {/* Headline */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.65rem", md: "2rem", lg: "2.2rem" },
                      fontWeight: 800,
                      color: "#FFFFFF",
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      fontFamily: "inherit",
                      maxWidth: "500px",
                    }}
                  >
                    {bannerTitle}
                  </Typography>

                  {/* Subtitle */}
                  {Boolean(bannerSubtitle) && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        color: "rgba(255, 255, 255, 0.85)",
                        fontWeight: 400,
                      }}
                    >
                      {bannerSubtitle}
                    </Typography>
                  )}

                  {/* App Store Badges */}
                  <Stack
                    direction="row"
                    spacing={1.25}
                    pt={0.5}
                    flexWrap="wrap"
                    justifyContent={{ xs: "center", md: "flex-start" }}
                    useFlexGap
                  >
                    {/* Google Play Badge */}
                    <Box
                      component="a"
                      href={playStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "9px",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        px: "14px",
                        py: "8px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        transition: "transform 0.2s ease, boxShadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                        },
                      }}
                    >
                      <svg width="20" height="22" viewBox="0 0 512 512" fill="none">
                        <path d="M47.2 25L257.6 235.4 47.2 445.8V25z" fill="#00E676" />
                        <path d="M47.2 25L323.4 184.6l-65.8 50.8L47.2 25z" fill="#FF3D00" />
                        <path d="M47.2 445.8L257.6 235.4l65.8 50.8L47.2 445.8z" fill="#FFC107" />
                        <path d="M464.8 235.4c14.2 8.2 14.2 21.6 0 29.8l-75.6 43.6-65.8-50.8 65.8-50.8 75.6 43.6z" fill="#00B0FF" />
                      </svg>
                      <Stack alignItems="flex-start" spacing={0}>
                        <Typography fontSize="7.5px" fontWeight="600" sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          GET IT ON
                        </Typography>
                        <Typography fontSize="12.5px" fontWeight="700" sx={{ lineHeight: 1.1 }}>
                          Google Play
                        </Typography>
                      </Stack>
                    </Box>

                    {/* App Store Badge */}
                    <Box
                      component="a"
                      href={appStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "9px",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        px: "14px",
                        py: "8px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        transition: "transform 0.2s ease, boxShadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                        },
                      }}
                    >
                      <svg width="18" height="22" viewBox="0 0 170 170" fill="#ffffff">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.24-9.97-1.87-14.81-6.35-3.26-3.03-7.23-7.91-11.91-14.64-5.9-8.47-10.59-17.84-14.07-28.11-3.48-10.27-5.22-20.21-5.22-29.83 0-14.03 3.63-25.7 10.89-35.01 7.26-9.31 16.39-14.07 27.38-14.28 5.17-.11 10.45 1.16 15.84 3.82 5.39 2.65 9.17 3.98 11.34 3.98 1.95 0 5.86-1.38 11.73-4.14 5.87-2.76 10.89-4.03 15.07-3.82 12.01.64 21.65 5.25 28.92 13.84-10.61 6.42-15.79 15.34-15.54 26.77.25 8.92 3.67 16.48 10.27 22.68 6.6 6.2 14.54 9.68 23.82 10.44-2.28 6.74-5.32 13.44-9.13 20.1zM119.22 31.74c0-6.84 2.5-13.37 7.5-19.59 5-6.22 11.33-10.15 18.99-11.79.54 1.19.81 2.49.81 3.9 0 6.94-2.58 13.56-7.74 19.86-5.16 6.3-11.47 10.18-18.93 11.64-.11-.98-.63-2.32-.63-4.02z" />
                      </svg>
                      <Stack alignItems="flex-start" spacing={0}>
                        <Typography fontSize="7.5px" fontWeight="600" sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Download on the
                        </Typography>
                        <Typography fontSize="12.5px" fontWeight="700" sx={{ lineHeight: 1.1 }}>
                          App Store
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>

              {/* Right Column: Delivery Guy Image */}
              <Grid item xs={12} md={5} lg={4.5} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: { md: 15, lg: 35 },
                    width: { md: "290px", lg: "330px" },
                    height: "100%",
                    maxHeight: "310px",
                    display: "flex",
                    alignItems: "flex-end",
                    zIndex: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/static/delivery_guy_large.png"
                    alt="Delivery Guy with Essentials"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "bottom right",
                      filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25))",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CustomContainer>
    </Box>
  );
};

export default LandingAppDownloadBannerSection;
