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
import MainApi from "api-manage/MainApi";
import { landing_page_api } from "api-manage/ApiRoutes";
import QRCodeClient from "components/landing-page/QRCodeClients";
import NextImage from "components/NextImage";
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
  title,
  subtitle,
  qrPlay,
  qrApp,
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
          p: 0.75,
          borderRadius: CARD_RADIUS,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          lineHeight: 0,
        }}
      >
        <QRCodeClient
          bare
          size={68}
          playStoreLink={qrPlay}
          appStoreLink={qrApp}
        />
      </Box>

      <Stack spacing={0.75} flex={1} minWidth={0}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Icon
            size={14}
            color={theme.palette.primary.main}
            style={{ flexShrink: 0 }}
          />
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

  const { data } = useQuery(
    "partner-apps-qr",
    async () => {
      const { data } = await MainApi.get(landing_page_api);
      return data;
    },
    { staleTime: 300000, retry: 1, refetchOnWindowFocus: false }
  );

  const sl =
    data?.seller_app_download_section?.download_seller_app_links || {};
  const dml =
    data?.deliveryman_app_download_section?.download_dm_app_links || {};

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
        ModalProps={{ hideBackdrop: true }}
        sx={{ pointerEvents: "none" }}
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
            {t("Partner & Vendor Applications")}
          </Typography>

          <Stack
            spacing={1.5}
            divider={
              <Divider sx={{ borderColor: theme.palette.divider }} />
            }
          >
            <AppSectionRow
              icon={Store}
              title="Vendor App"
              subtitle="Scan QR code to download app and manage your store, products and orders."
              qrPlay={
                sl?.playstore_url_status === 1 ? sl?.playstore_url : null
              }
              qrApp={
                sl?.apple_store_url_status === 1 ? sl?.apple_store_url : null
              }
              playUrl={sl?.playstore_url}
              appUrl={sl?.apple_store_url}
              playStatus={sl?.playstore_url_status}
              appStatus={sl?.apple_store_url_status}
            />

            <AppSectionRow
              icon={Bike}
              title="Delivery Man App"
              subtitle="Scan QR code to download app and start delivering orders on your schedule."
              qrPlay={
                dml?.playstore_url_status === 1 ? dml?.playstore_url : null
              }
              qrApp={
                dml?.apple_store_url_status === 1 ? dml?.apple_store_url : null
              }
              playUrl={dml?.playstore_url}
              appUrl={dml?.apple_store_url}
              playStatus={dml?.playstore_url_status}
              appStatus={dml?.apple_store_url_status}
            />
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
};

export default PartnerAppsDropdown;
