import React from "react";
import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

const CardWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "isPopular",
})(({ theme, isActive, isPopular }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "24px 20px",
  borderRadius: "16px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  border: isActive
    ? `2.5px solid ${theme.palette.primary.main}`
    : `1px solid ${alpha(theme.palette.neutral[300] || "#cbd5e1", 0.7)}`,
  boxShadow: isActive
    ? `0 12px 30px ${alpha(theme.palette.primary.main, 0.2)}`
    : `0 4px 18px ${alpha(theme.palette.neutral[900] || "#000", 0.05)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateY(-6px)",
    boxShadow: `0 16px 36px ${alpha(theme.palette.primary.main, 0.16)}`,
  },
}));

const PopularBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 20,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || theme.palette.primary.main} 100%)`,
  color: "#ffffff",
  borderBottomLeftRadius: "10px",
  borderBottomRightRadius: "10px",
  padding: "4px 12px",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
  zIndex: 2,
}));

const Plan = ({ setSelectedPackage, selectedPackage, item, isPopular }) => {
  const theme = useTheme();
  const isActive =
    selectedPackage != null && String(selectedPackage) === String(item?.id);

  const featureList = [
    {
      key: "max_order",
      label: `${t("Max Order")}: ${item?.max_order ?? t("Unlimited")}`,
      active: true,
    },
    {
      key: "max_product",
      label: `${t("Max Product")}: ${item?.max_product ?? t("Unlimited")}`,
      active: true,
    },
    {
      key: "pos",
      label: t("POS System"),
      active: item?.pos === 1,
    },
    {
      key: "mobile_app",
      label: t("Mobile App Access"),
      active: item?.mobile_app === 1,
    },
    {
      key: "chat",
      label: t("Live Chat Support"),
      active: item?.chat === 1,
    },
    {
      key: "review",
      label: t("Store Reviews & Ratings"),
      active: item?.review === 1,
    },
    {
      key: "self_delivery",
      label: t("Self Delivery Option"),
      active: item?.self_delivery === 1,
    },
  ];

  return (
    <Box sx={{ height: "100%", py: 0.5, px: 0, width: "100%", flex: 1 }}>
      <CardWrapper
        isActive={isActive}
        isPopular={isPopular}
        onClick={() => setSelectedPackage(item.id)}
      >
        {isPopular && (
          <PopularBadge>
            <Sparkles size={12} />
            {t("Popular")}
          </PopularBadge>
        )}

        <Box>
          {/* Header */}
          <Typography
            fontSize="18px"
            fontWeight={700}
            color={isActive ? "primary.main" : "text.primary"}
            mb={0.5}
            sx={{ pt: isPopular ? 1.5 : 0 }}
          >
            {item?.package_name}
          </Typography>

          {/* Price */}
          <Stack direction="row" alignItems="baseline" spacing={0.5} mt={1.5} mb={1}>
            <Typography
              fontSize="28px"
              fontWeight={800}
              color="primary.main"
              lineHeight={1}
            >
              {getAmountWithSign(item?.price)}
            </Typography>
          </Stack>

          {/* Validity Chip */}
          <Chip
            label={`${item?.validity} ${t("Days Validity")}`}
            size="small"
            sx={{
              bgcolor: isActive
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.neutral[400] || "#94a3b8", 0.12),
              color: isActive ? "primary.main" : "text.secondary",
              fontWeight: 700,
              fontSize: "12px",
              height: "26px",
              mb: 1.5,
            }}
          />

          <Divider sx={{ my: 1.5, borderColor: alpha(theme.palette.divider, 0.6) }} />

          {/* Feature List */}
          <Stack spacing={1.25} sx={{ my: 1.5 }}>
            {featureList.map((feature) => (
              <Stack
                key={feature.key}
                direction="row"
                alignItems="center"
                spacing={1.25}
              >
                {feature.active ? (
                  <CheckCircle2
                    size={17}
                    color={theme.palette.primary.main}
                    strokeWidth={2.2}
                  />
                ) : (
                  <XCircle
                    size={17}
                    color={alpha(theme.palette.neutral[400] || "#cbd5e1", 0.6)}
                    strokeWidth={1.8}
                  />
                )}
                <Typography
                  fontSize="13px"
                  fontWeight={feature.active ? 600 : 400}
                  color={
                    feature.active
                      ? theme.palette.neutral[900] || "text.primary"
                      : theme.palette.neutral[400] || "text.disabled"
                  }
                >
                  {feature.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Selection Button */}
        <Button
          fullWidth
          variant={isActive ? "contained" : "outlined"}
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPackage(item.id);
          }}
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "14px",
            textTransform: "none",
            boxShadow: isActive
              ? `0 6px 18px ${alpha(theme.palette.primary.main, 0.3)}`
              : "none",
            "&:hover": {
              boxShadow: `0 8px 22px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {isActive ? t("Selected") : t("Select Package")}
        </Button>
      </CardWrapper>
    </Box>
  );
};

export default Plan;
