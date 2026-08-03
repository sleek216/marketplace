import React from "react";
import { useTheme } from "@emotion/react";
import { Box, Stack } from "@mui/system";
import { alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";

/** Number of units at or below which we show the "low stock" warning. */
const LOW_STOCK_THRESHOLD = 10;

/**
 * Smart stock availability badge.
 *
 * Props:
 *   stock    {number|undefined}  — current warehouse quantity.
 *                                  When omitted the badge shows the legacy
 *                                  binary "In Stock" label (backward-compat).
 *   compact  {boolean}           — smaller pill, used on product cards.
 */
const InStockTag = ({ stock, compact = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const fontSize   = compact ? "10px" : "12px";
  const padding    = compact ? "2px 7px" : "4px 10px";
  const iconSize   = compact ? 11 : 13;

  /* ── Out of Stock ────────────────────────────────────────────── */
  if (stock === 0) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.4}
        sx={{
          display: "inline-flex",
          padding,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
          fontSize,
          borderRadius: "2px",
          fontWeight: "600",
          whiteSpace: "nowrap",
        }}
      >
        <Package size={iconSize} />
        <span>{t("Out of Stock")}</span>
      </Stack>
    );
  }

  /* ── Low Stock ───────────────────────────────────────────────── */
  if (stock !== undefined && stock !== null && stock <= LOW_STOCK_THRESHOLD) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.4}
        sx={{
          display: "inline-flex",
          padding,
          backgroundColor: alpha(theme.palette.warning.main, 0.12),
          color: theme.palette.warning.dark ?? theme.palette.warning.main,
          fontSize,
          borderRadius: "2px",
          fontWeight: "600",
          whiteSpace: "nowrap",
        }}
      >
        <Package size={iconSize} />
        <span>
          {t("Only")} {stock} {t("left")}
        </span>
      </Stack>
    );
  }

  /* ── In Stock (plenty) ───────────────────────────────────────── */
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.4}
      sx={{
        display: "inline-flex",
        padding,
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.main,
        fontSize,
        borderRadius: "2px",
        fontWeight: "500",
        whiteSpace: "nowrap",
      }}
    >
      <Package size={iconSize} />
      <span>{t("In Stock")}</span>
    </Stack>
  );
};

export default InStockTag;
