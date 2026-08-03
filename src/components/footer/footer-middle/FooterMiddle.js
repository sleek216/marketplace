import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Box, alpha } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import AppLinks from "./AppLinks";
import SocialLinks from "./SocialLinks";
import SomeInfo from "./SomeInfo";
import FooterBottomItems from "../FooterBottomItems";
import { useRouter } from "next/router";
import LocationViewOnMap from "../../Map/location-view/LocationViewOnMap";

const FooterMiddle = (props) => {
  const { configData, landingPageData } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenCloseMap = () => setOpen((prev) => !prev);
  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };

  const businessLogo = configData?.logo_full_url;

  const appLinksData = {
    app_store_link:
      landingPageData?.user_app_download_section?.download_user_app_links
        ?.apple_store_url,
    play_store_link:
      landingPageData?.user_app_download_section?.download_user_app_links
        ?.playstore_url,
    app_status:
      landingPageData?.user_app_download_section?.download_user_app_links
        ?.apple_store_url_status,
    play_status:
      landingPageData?.user_app_download_section?.download_user_app_links
        ?.playstore_url_status,
  };

  return (
    <CustomStackFullWidth
      sx={{
        py: { xs: 2, sm: 2.5, md: 3 },
        px: { xs: 0.5, sm: 0 },
        width: "100%",
        minWidth: 0,
      }}
    >
      <Grid
        container
        spacing={{ xs: 2.5, sm: 3, md: 3.5 }}
        alignItems="flex-start"
        sx={{ width: "100%", minWidth: 0, m: 0 }}
      >
        <Grid item xs={12} md={4} lg={3.5} sx={{ minWidth: 0 }}>
          <CustomStackFullWidth
            gap={{ xs: 1.5, sm: 2 }}
            alignItems={{ xs: "center", md: "flex-start" }}
            justifyContent="flex-start"
            sx={{ width: "100%", minWidth: 0 }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                img: { transition: "all ease 0.5s" },
                "&:hover img": { transform: "scale(1.04)" },
              }}
            >
              <CustomImageContainer
                src={businessLogo}
                alt={configData?.business_name}
                width="auto"
                height="50px"
                objectfit="contain"
              />
            </Box>

            <SocialLinks
              configData={configData}
              landingPageData={landingPageData}
            />

            <AppLinks landingPageData={appLinksData} />
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} md={8} lg={8.5} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              borderRadius: "2px",
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              p: { xs: 1.5, sm: 2, md: 2.25 },
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 1.25, sm: 1.5 },
                alignItems: "stretch",
              }}
            >
              <SomeInfo
                iconType="mail"
                title="Mail Us"
                info={configData?.email}
                t={t}
                href={`mailto:${configData?.email}`}
              />
              <SomeInfo
                iconType="phone"
                title="Contact Us"
                info={configData?.phone}
                t={t}
                href={`tel:${configData?.phone}`}
              />
              <Box
                sx={{
                  gridColumn: { xs: "auto", sm: "1 / -1", md: "auto" },
                  minWidth: 0,
                }}
                onClick={handleOpenCloseMap}
              >
                <SomeInfo
                  iconType="location"
                  title="Find Us"
                  info={configData?.address}
                  t={t}
                  href={false}
                />
              </Box>
            </Box>

            {isSmall && (
              <Box sx={{ mt: 2 }}>
                <FooterBottomItems
                  handleClickToRoute={handleClickToRoute}
                  configData={configData}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {open && (
        <LocationViewOnMap
          open={open}
          handleClose={handleOpenCloseMap}
          latitude={configData?.default_location?.lat}
          longitude={configData?.default_location?.lng}
          address={configData?.address}
          isFooter
        />
      )}
    </CustomStackFullWidth>
  );
};

export default FooterMiddle;
