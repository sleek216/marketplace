import React from "react";
import {
  Box,
  Button,
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

const AppAndSellerBanner = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

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
          width: "100%",
          borderRadius: { xs: "14px", sm: "18px", md: "22px" },
          overflow: "hidden",
          boxShadow: `0 12px 35px ${alpha(theme.palette.neutral[900], 0.08)}`,
          border: `1px solid ${alpha(theme.palette.neutral[300], 0.6)}`,
          backgroundColor: "#ffffff",
          lineHeight: 0,
        }}
      >
        <Box sx={{ width: "100%", height: "auto", position: "relative" }}>
          <CustomImageContainer
            src="/landingpage/app_and_seller_full_banner.png"
            alt="Download Our App & Become a Seller"
            width="100%"
            height="100%"
            objectfit="cover"
          />

          {/* Google Play Store Clickable Hotspot */}
          <Box
            component="a"
            href={playStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            title={t("Google Play")}
            sx={{
              position: "absolute",
              left: "6.5%",
              bottom: "12%",
              width: "18%",
              height: "26%",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          />

          {/* Apple App Store Clickable Hotspot */}
          <Box
            component="a"
            href={appStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            title={t("App Store")}
            sx={{
              position: "absolute",
              left: "25.5%",
              bottom: "12%",
              width: "18%",
              height: "26%",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          />

          {/* Become a Seller Join Now Clickable Hotspot */}
          <Box
            onClick={handleSellerJoin}
            title={t("Become a Seller")}
            sx={{
              position: "absolute",
              left: "53.5%",
              bottom: "12%",
              width: "18%",
              height: "26%",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(7, 56, 166, 0.06)",
              },
            }}
          />
        </Box>
      </Box>
    </CustomContainer>
  );
};

export default AppAndSellerBanner;
