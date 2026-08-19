import React, { useState, useRef } from "react";
import {
  Box,
  Popover,
  Stack,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Divider,
} from "@mui/material";
import { QrCode, Store, Bike } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import MainApi from "api-manage/MainApi";
import { landing_page_api } from "api-manage/ApiRoutes";
import QRCodeClient from "components/landing-page/QRCodeClients";
import NextImage from "components/NextImage";
import CustomImageContainer from "components/CustomImageContainer";
import appleicon from "../../../../public/static/footer/apple.svg";
import playstoreicon from "../../../../public/static/footer/playstore.svg";

const CARD_RADIUS = "4px";

const StoreBadge = ({ onClick, iconSrc, line1, line2 }) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      height: "38px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      px: "10px",
      borderRadius: CARD_RADIUS,
      backgroundColor: "#000000",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      cursor: "pointer",
      transition: "background-color 0.15s ease, border-color 0.15s ease",
      minWidth: 0,
      "&:hover": {
        backgroundColor: "#1a1a1a",
        borderColor: "rgba(255, 255, 255, 0.35)",
      },
    }}
  >
    <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
      <NextImage
        src={iconSrc}
        alt={line2}
        height={20}
        width={20}
        objectFit="contain"
      />
    </Box>
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        sx={{
          fontSize: "8px",
          color: "rgba(255, 255, 255, 0.6)",
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {line1}
      </Typography>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.15,
          whiteSpace: "nowrap",
        }}
      >
        {line2}
      </Typography>
    </Box>
  </Box>
);

const AppSectionRow = ({
  icon: Icon,
  iconUrl,
  title,
  subtitle,
  qrPlay,
  qrApp,
  qrImage,
  qrCustomUrl,
  playUrl,
  appUrl,
  playStatus,
  appStatus,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const showPlay = Number(playStatus) === 1 && playUrl;
  const showApp = Number(appStatus) === 1 && appUrl;

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box
        sx={{
          flexShrink: 0,
          width: 84,
          height: 84,
          p: 0.75,
          borderRadius: CARD_RADIUS,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {qrImage ? (
          <Box
            component="img"
            src={qrImage}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <QRCodeClient
            bare
            size={68}
            customUrl={qrCustomUrl}
            playStoreLink={qrPlay}
            appStoreLink={qrApp}
          />
        )}
      </Box>

      <Stack spacing={0.75} flex={1} minWidth={0}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          {iconUrl ? (
            <CustomImageContainer
              src={iconUrl}
              alt={title}
              width="16px"
              height="16px"
              objectFit="contain"
            />
          ) : Icon ? (
            <Icon
              size={14}
              color={theme.palette.primary.main}
              style={{ flexShrink: 0 }}
            />
          ) : null}
          <Typography
            fontWeight={700}
            fontSize="13px"
            color={theme.palette.neutral[1000]}
            lineHeight={1.2}
          >
            {t(title)}
          </Typography>
        </Stack>

        <Typography
          fontSize="11px"
          color={theme.palette.neutral[500]}
          sx={{ lineHeight: 1.35 }}
        >
          {t(subtitle)}
        </Typography>

        {(showPlay || showApp) && (
          <Stack direction="row" spacing={0.75} sx={{ pt: 0.25 }}>
            {showPlay && (
              <StoreBadge
                onClick={() => window.open(playUrl)}
                iconSrc={playstoreicon?.src}
                line1="GET IT ON"
                line2="Google Play"
              />
            )}
            {showApp && (
              <StoreBadge
                onClick={() => window.open(appUrl)}
                iconSrc={appleicon?.src}
                line1="Download on the"
                line2="App Store"
              />
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

const PartnerAppsDropdown = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const timerRef = useRef(null);

  const reduxLandingPageData = useSelector(
    (state) => state.configData?.landingPageData
  );

  const { data: apiData } = useQuery(
    "partner-apps-qr",
    async () => {
      const { data } = await MainApi.get(landing_page_api);
      return data;
    },
    { staleTime: 300000, retry: 1, refetchOnWindowFocus: false }
  );

  const data = apiData || reduxLandingPageData;

  // Master Section Data from Admin (if provided in header_qr_section or partner_apps_section)
  const masterSection =
    data?.header_qr_section ||
    data?.partner_apps_section ||
    data?.qr_section;

  // Master Status Toggle
  const isMasterEnabled =
    masterSection?.status !== 0 &&
    masterSection?.status !== false &&
    masterSection?.status !== "0" &&
    data?.header_partner_apps_status !== 0 &&
    data?.header_partner_apps_status !== "0";

  const sellerSection = data?.seller_app_download_section;
  const dmSection = data?.deliveryman_app_download_section;

  const isSellerEnabled =
    sellerSection?.status !== 0 &&
    sellerSection?.status !== false &&
    sellerSection?.status !== "0";

  const isDmEnabled =
    dmSection?.status !== 0 &&
    dmSection?.status !== false &&
    dmSection?.status !== "0";

  // Check if admin provides a custom array of apps
  const customAppsList =
    masterSection?.apps ||
    masterSection?.cards ||
    masterSection?.list;

  const hasCustomApps =
    Array.isArray(customAppsList) && customAppsList.length > 0;

  // If master is disabled OR everything inside is disabled, hide the icon completely
  if (
    !isMasterEnabled ||
    (!hasCustomApps && !isSellerEnabled && !isDmEnabled)
  ) {
    return null;
  }

  const headerTitle =
    masterSection?.title?.trim() ||
    t("Partner & Vendor Applications");

  const sl =
    sellerSection?.download_seller_app_links ||
    sellerSection?.links ||
    {};
  const dml =
    dmSection?.download_dm_app_links ||
    dmSection?.links ||
    {};

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const openPopover = (e) => {
    clearTimer();
    setAnchorEl(e.currentTarget);
  };
  const closePopover = () => {
    timerRef.current = setTimeout(() => setAnchorEl(null), 280);
  };

  return (
    <Box
      onMouseLeave={closePopover}
      sx={{ display: "inline-flex", alignItems: "center" }}
    >
      <IconButton
        onMouseEnter={openPopover}
        onClick={(e) => (anchorEl ? setAnchorEl(null) : openPopover(e))}
        size="small"
        aria-label="Partner Applications QR Codes"
        sx={{
          width: 32,
          height: 32,
          borderRadius: CARD_RADIUS,
          color: anchorEl
            ? theme.palette.primary.main
            : theme.palette.neutral[700],
          backgroundColor: anchorEl
            ? alpha(theme.palette.primary.main, 0.1)
            : "transparent",
          transition: "all 0.18s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          },
        }}
      >
        <QrCode size={19} />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        disableRestoreFocus
        disableScrollLock
        disablePortal={false}
        container={typeof document !== "undefined" ? document.body : undefined}
        ModalProps={{ hideBackdrop: true }}
        style={{ zIndex: 2000 }}
        sx={{ pointerEvents: "none", zIndex: 2000 }}
        slotProps={{
          paper: {
            onMouseEnter: clearTimer,
            onMouseLeave: closePopover,
            elevation: 0,
            sx: {
              pointerEvents: "auto",
              mt: 1,
              p: 2,
              borderRadius: CARD_RADIUS,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.12)}`,
              background: theme.palette.background.paper,
              width: { xs: "min(92vw, 420px)", sm: 440 },
              maxWidth: "calc(100vw - 24px)",
            },
          },
        }}
      >
        <Stack spacing={1.25}>
          <Typography
            fontWeight={700}
            fontSize="13px"
            color={theme.palette.neutral[1000]}
            sx={{ letterSpacing: "0.01em" }}
          >
            {headerTitle}
          </Typography>

          <Stack
            spacing={1.5}
            divider={
              <Divider sx={{ borderColor: theme.palette.divider }} />
            }
          >
            {hasCustomApps ? (
              customAppsList.map((appItem, idx) => (
                <AppSectionRow
                  key={appItem?.id || idx}
                  icon={appItem?.type === "delivery" ? Bike : Store}
                  iconUrl={appItem?.icon_full_url || appItem?.icon}
                  title={appItem?.title || `App ${idx + 1}`}
                  subtitle={
                    appItem?.subtitle ||
                    appItem?.sub_title ||
                    appItem?.description ||
                    ""
                  }
                  qrImage={
                    appItem?.qr_image_full_url ||
                    appItem?.qr_code_image_url ||
                    appItem?.qr_image
                  }
                  qrCustomUrl={appItem?.qr_url || appItem?.custom_qr_url}
                  qrPlay={appItem?.playstore_url}
                  qrApp={appItem?.apple_store_url}
                  playUrl={appItem?.playstore_url}
                  appUrl={appItem?.apple_store_url}
                  playStatus={appItem?.playstore_url_status ?? 1}
                  appStatus={appItem?.apple_store_url_status ?? 1}
                />
              ))
            ) : (
              <>
                {isSellerEnabled && (
                  <AppSectionRow
                    icon={Store}
                    iconUrl={
                      sellerSection?.icon_full_url ||
                      sellerSection?.icon
                    }
                    title={sellerSection?.title || "Vendor App"}
                    subtitle={
                      sellerSection?.subtitle ||
                      sellerSection?.sub_title ||
                      sellerSection?.description ||
                      "Scan QR code to download app and manage your store, products and orders."
                    }
                    qrImage={
                      sellerSection?.qr_image_full_url ||
                      sellerSection?.qr_code_image_url ||
                      sellerSection?.qr_image
                    }
                    qrCustomUrl={
                      sellerSection?.qr_url ||
                      sellerSection?.custom_qr_url
                    }
                    qrPlay={
                      Number(sl?.playstore_url_status) === 1
                        ? sl?.playstore_url
                        : null
                    }
                    qrApp={
                      Number(sl?.apple_store_url_status) === 1
                        ? sl?.apple_store_url
                        : null
                    }
                    playUrl={sl?.playstore_url}
                    appUrl={sl?.apple_store_url}
                    playStatus={sl?.playstore_url_status}
                    appStatus={sl?.apple_store_url_status}
                  />
                )}

                {isDmEnabled && (
                  <AppSectionRow
                    icon={Bike}
                    iconUrl={
                      dmSection?.icon_full_url ||
                      dmSection?.icon
                    }
                    title={dmSection?.title || "Delivery Man App"}
                    subtitle={
                      dmSection?.subtitle ||
                      dmSection?.sub_title ||
                      dmSection?.description ||
                      "Scan QR code to download app and start delivering orders on your schedule."
                    }
                    qrImage={
                      dmSection?.qr_image_full_url ||
                      dmSection?.qr_code_image_url ||
                      dmSection?.qr_image
                    }
                    qrCustomUrl={
                      dmSection?.qr_url ||
                      dmSection?.custom_qr_url
                    }
                    qrPlay={
                      Number(dml?.playstore_url_status) === 1
                        ? dml?.playstore_url
                        : null
                    }
                    qrApp={
                      Number(dml?.apple_store_url_status) === 1
                        ? dml?.apple_store_url
                        : null
                    }
                    playUrl={dml?.playstore_url}
                    appUrl={dml?.apple_store_url}
                    playStatus={dml?.playstore_url_status}
                    appStatus={dml?.apple_store_url_status}
                  />
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
};

export default PartnerAppsDropdown;
