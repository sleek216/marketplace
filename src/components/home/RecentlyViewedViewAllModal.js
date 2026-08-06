import { alpha, Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomModal from "components/modal";
import LandingProductCard from "components/landing-page/LandingProductCard";
import {
  marketplaceProductGridColumns,
  marketplaceProductGridGap,
} from "components/landing-page/marketplaceCardLayout";

/**
 * Shared "See all" Recently Viewed modal — landing + module homes.
 */
const RecentlyViewedViewAllModal = ({
  open,
  onClose,
  products = [],
  onRequestDetail,
  loading = false,
  emptyLabel,
  title,
  subTitle,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      maxWidth="1040px"
      borderRadius="2px"
    >
      <Box
        sx={{
          width: { xs: "92vw", sm: "860px", md: "980px" },
          maxWidth: "100%",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          maxHeight: { xs: "82vh", md: "78vh" },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: { xs: 2, sm: 2.5 },
            pt: { xs: 2, sm: 2.25 },
            pb: 1.5,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            flexShrink: 0,
          }}
        >
          <Box minWidth={0}>
            <Typography
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "16px", md: "18px" },
                lineHeight: 1.25,
                color: "text.primary",
              }}
            >
              {title ? title : t("Recently Viewed")}
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                fontSize: { xs: "11px", sm: "12px" },
                color: "text.secondary",
                lineHeight: 1.35,
              }}
            >
              {subTitle ? subTitle : t("Continue from where you left off")}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close"
            onClick={onClose}
            size="small"
            sx={{
              mt: -0.5,
              mr: -0.5,
              flexShrink: 0,
              borderRadius: "2px",
              color: "text.secondary",
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              "&:hover": {
                bgcolor: "action.hover",
                color: "text.primary",
              },
            }}
          >
            <X size={16} />
          </IconButton>
        </Stack>

        {/* Body */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2, md: 2.5 },
            py: { xs: 1.5, sm: 2 },
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
            bgcolor:
              theme.palette.mode === "dark"
                ? "background.default"
                : alpha(theme.palette.neutral?.[100] || "#f5f6f8", 0.65),
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: alpha(theme.palette.text.primary, 0.2),
              borderRadius: "2px",
            },
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: marketplaceProductGridColumns,
                gap: marketplaceProductGridGap,
              }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <Box
                  key={`rv-modal-skel-${index}`}
                  sx={{
                    borderRadius: "2px",
                    bgcolor: "background.paper",
                    border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
                    pt: "130%",
                  }}
                />
              ))}
            </Box>
          ) : products.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: marketplaceProductGridGap,
              }}
            >
              {products.map((item) => (
                <Box
                  key={`rv-modal-${item?.id}-${item?.module_id || ""}-${item?.viewed_at || ""}`}
                  sx={{ minWidth: 0, height: "100%" }}
                >
                  <LandingProductCard
                    item={item}
                    onRequestDetail={(bundle) => {
                      onClose?.();
                      onRequestDetail?.(bundle);
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Stack alignItems="center" justifyContent="center" py={6} spacing={1}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                {emptyLabel || t("No recently viewed items found")}
              </Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </CustomModal>
  );
};

export default RecentlyViewedViewAllModal;
