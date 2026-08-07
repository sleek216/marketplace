import React from "react";
import {
  Box,
  Button,
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
    <CustomContainer sx={{ mb: { xs: 4, md: 5 } }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: { xs: "16px", md: "22px" },
          overflow: { xs: "hidden", md: "visible" },
          border: `1px solid ${alpha(theme.palette.neutral[300], 0.6)}`,
          boxShadow: `0 12px 35px ${alpha(theme.palette.neutral[900], 0.07)}`,
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: { xs: "16px", md: "22px" },
            overflow: "hidden",
            minHeight: { md: "220px" },
          }}
        >
          {/* LEFT HALF: Download Our App */}
          <Box
            sx={{
              flex: 1,
              background: `linear-gradient(135deg, #053ca8 0%, #032475 100%)`,
              color: "#ffffff",
              p: { xs: "28px 20px", sm: "32px 28px", md: "36px 40px" },
              pr: { md: "90px" }, // Leave room for overlapping phone
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Background subtle curve glow */}
            <Box
              sx={{
                position: "absolute",
                top: "-40px",
                left: "-40px",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
                pointerEvents: "none",
              }}
            />

            <Stack
              spacing={1.25}
              alignItems={{ xs: "center", md: "flex-start" }}
              textAlign={{ xs: "center", md: "left" }}
            >
              <Typography
                fontSize={{ xs: "22px", sm: "25px", md: "28px" }}
                fontWeight="800"
                sx={{ color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.01em" }}
              >
                {t("Download Our App")}
              </Typography>

              <Typography
                fontSize={{ xs: "13px", sm: "14px" }}
                fontWeight="400"
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: 1.45,
                  maxWidth: "280px",
                }}
              >
                {t("For a better shopping experience & exclusive app offers!")}
              </Typography>

              {/* Badges */}
              <Stack
                direction="row"
                spacing={1.25}
                pt={1}
                flexWrap="wrap"
                justifyContent={{ xs: "center", md: "flex-start" }}
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
                    py: "7px",
                    borderRadius: "7px",
                    textDecoration: "none",
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
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
                    <Typography
                      fontSize="7.5px"
                      fontWeight="600"
                      sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
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
                    py: "7px",
                    borderRadius: "7px",
                    textDecoration: "none",
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
                    },
                  }}
                >
                  <svg width="18" height="22" viewBox="0 0 170 170" fill="#ffffff">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.24-9.97-1.87-14.81-6.35-3.26-3.03-7.23-7.91-11.91-14.64-5.9-8.47-10.59-17.84-14.07-28.11-3.48-10.27-5.22-20.21-5.22-29.83 0-14.03 3.63-25.7 10.89-35.01 7.26-9.31 16.39-14.07 27.38-14.28 5.17-.11 10.45 1.16 15.84 3.82 5.39 2.65 9.17 3.98 11.34 3.98 1.95 0 5.86-1.38 11.73-4.14 5.87-2.76 10.89-4.03 15.07-3.82 12.01.64 21.65 5.25 28.92 13.84-10.61 6.42-15.79 15.34-15.54 26.77.25 8.92 3.67 16.48 10.27 22.68 6.6 6.2 14.54 9.68 23.82 10.44-2.28 6.74-5.32 13.44-9.13 20.1zM119.22 31.74c0-6.84 2.5-13.37 7.5-19.59 5-6.22 11.33-10.15 18.99-11.79.54 1.19.81 2.49.81 3.9 0 6.94-2.58 13.56-7.74 19.86-5.16 6.3-11.47 10.18-18.93 11.64-.11-.98-.63-2.32-.63-4.02z" />
                  </svg>
                  <Stack alignItems="flex-start" spacing={0}>
                    <Typography
                      fontSize="7.5px"
                      fontWeight="600"
                      sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
                      Download on the
                    </Typography>
                    <Typography fontSize="12.5px" fontWeight="700" sx={{ lineHeight: 1.1 }}>
                      App Store
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* RIGHT HALF: Become a Seller */}
          <Box
            sx={{
              flex: 1,
              background: `linear-gradient(135deg, #f2f5fd 0%, #ffffff 100%)`,
              p: { xs: "28px 20px", sm: "32px 28px", md: "36px 40px" },
              pl: { md: "90px" }, // Leave room for overlapping phone
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <Stack
              spacing={1.25}
              alignItems={{ xs: "center", md: "flex-start" }}
              textAlign={{ xs: "center", md: "left" }}
              sx={{ zIndex: 1, maxWidth: { sm: "280px" } }}
            >
              <Typography
                fontSize={{ xs: "22px", sm: "25px", md: "28px" }}
                fontWeight="800"
                sx={{ color: "#062b88", lineHeight: 1.2, letterSpacing: "-0.01em" }}
              >
                {t("Become a Seller")}
              </Typography>

              <Typography
                fontSize={{ xs: "13px", sm: "14px" }}
                fontWeight="400"
                sx={{ color: "#4b5563", lineHeight: 1.45 }}
              >
                {t("Grow your business with us and reach thousands of happy customers.")}
              </Typography>

              <Box pt={0.75}>
                <Button
                  variant="outlined"
                  onClick={handleSellerJoin}
                  endIcon={<ArrowRight size={17} />}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#053ca8",
                    borderColor: "#053ca8",
                    borderWidth: "1.5px",
                    borderRadius: "9px",
                    px: 3,
                    py: 1,
                    fontSize: "13.5px",
                    fontWeight: "700",
                    textTransform: "none",
                    boxShadow: "0 3px 10px rgba(5, 60, 168, 0.08)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#053ca8",
                      color: "#ffffff",
                      borderColor: "#053ca8",
                      boxShadow: "0 6px 18px rgba(5, 60, 168, 0.25)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("Join Now")}
                </Button>
              </Box>
            </Stack>

            {/* 3D Store Illustration on Far Right */}
            <Box
              sx={{
                width: { xs: "110px", sm: "140px", md: "160px" },
                height: "auto",
                flexShrink: 0,
                display: { xs: "none", sm: "block" },
                zIndex: 1,
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
          </Box>
        </Box>

        {/* CENTER PHONE MOCKUP (Bridging Left & Right Banner) */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              width: "195px",
              height: "265px",
              pointerEvents: "none",
              filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.22))",
            }}
          >
            <CustomImageContainer
              src="/landingpage/iphone_mockup_center.png"
              alt="App Phone Mockup"
              width="100%"
              height="100%"
              objectfit="contain"
            />
          </Box>
        )}
      </Box>
    </CustomContainer>
  );
};

export default AppAndSellerBanner;
