import React from "react";
import { Alert, Box, Collapse, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import {
  getOrderSubtotalAfterProductDiscount,
  getStoreMinimumOrderAmount,
  isBelowStoreMinimumOrder,
} from "utils/CustomFunctions";

const MinimumOrderNotice = ({
  cartList,
  storeData,
  subtotal: subtotalOverride,
  containerSx,
  disableCollapse = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const minimum = getStoreMinimumOrderAmount(storeData);
  const subtotal =
    subtotalOverride ??
    getOrderSubtotalAfterProductDiscount(cartList, storeData);
  const shortfall =
    minimum > 0 ? Math.max(0, minimum - Number(subtotal || 0)) : 0;
  const belowMinimum =
    minimum > 0 &&
    (subtotalOverride != null
      ? shortfall > 0
      : isBelowStoreMinimumOrder(cartList, storeData));

  if (!minimum || minimum <= 0 || !belowMinimum) {
    return null;
  }

  const alert = (
    <Alert
      severity="warning"
      sx={{
        mx: disableCollapse ? 0 : 2,
        width: disableCollapse ? "100%" : "calc(100% - 32px)",
        ...containerSx,
        mt: disableCollapse ? 0 : 1.5,
        mb: disableCollapse ? 0 : 0.5,
        borderRadius: "8px",
        textAlign: "left",
        alignItems: "flex-start",
        backgroundColor: alpha(theme.palette.warning.main, 0.08),
        border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      <Typography fontSize="13px" fontWeight={600} lineHeight={1.5}>
        {t("Minimum order required")}
      </Typography>
      <Typography fontSize="12px" lineHeight={1.6} mt={0.5}>
        {t(
          "This store accepts orders of {{minimum}} or more. Your item total is {{current}} — add {{remaining}} more to continue.",
          {
            minimum: getAmountWithSign(minimum),
            current: getAmountWithSign(subtotal),
            remaining: getAmountWithSign(shortfall),
          }
        )}
      </Typography>
    </Alert>
  );

  if (disableCollapse) {
    return <Box sx={{ width: "100%" }}>{alert}</Box>;
  }

  return <Collapse in={belowMinimum}>{alert}</Collapse>;
};

export default MinimumOrderNotice;
