import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { isMultiStorePlaceOrderResponse } from "helper-functions/placeOrderResponse";

/**
 * Shared success summary for single vs multi-store place-order responses.
 * Single-store callers can keep showing their existing simple order_id line;
 * pass `compact` false for fuller multi-store breakdown.
 */
const PlaceOrderSuccessSummary = ({ orderData, orderIdFallback }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMulti = isMultiStorePlaceOrderResponse(orderData);
  const orders = Array.isArray(orderData?.orders) ? orderData.orders : [];
  const orderIds =
    Array.isArray(orderData?.order_ids) && orderData.order_ids.length
      ? orderData.order_ids
      : orders.map((o) => o?.order_id).filter(Boolean);

  if (!isMulti) {
    const singleId = orderData?.order_id || orderIdFallback;
    const amount = orderData?.total_ammount ?? orderData?.grand_total;
    return (
      <Stack spacing={1} alignItems="center" width="100%">
        <Typography align="center" sx={{ mb: 0.5 }}>
          {t("Your order is")}
          <span
            style={{
              color: theme.palette.primary.main,
              marginLeft: "3px",
              fontWeight: 600,
            }}
          >
            {singleId}
          </span>
          {t(". You can use this ID to track your order later")}
        </Typography>
        {amount != null && (
          <Typography fontWeight={600}>
            {t("Total")}: {getAmountWithSign(amount)}
          </Typography>
        )}
      </Stack>
    );
  }

  const grandTotal =
    orderData?.grand_total ?? orderData?.total_ammount ?? null;
  const totalDelivery = orderData?.total_delivery_charge;

  return (
    <Stack spacing={1.5} alignItems="stretch" width="100%" maxWidth="420px">
      <Typography align="center" fontWeight={600}>
        {t("Orders placed")}: {orderIds.join(", ")}
      </Typography>
      {orders.length > 0
        ? orders.map((order) => (
            <Stack
              key={order?.order_id || order?.store_id}
              spacing={0.35}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography fontWeight={600} fontSize="14px">
                {order?.store_name || t("Store")} — #{order?.order_id}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize="13px" color="text.secondary">
                  {t("Delivery Fee")}
                </Typography>
                <Typography fontSize="13px" fontWeight={600}>
                  {getAmountWithSign(Number(order?.delivery_charge) || 0)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize="13px" color="text.secondary">
                  {t("Total")}
                </Typography>
                <Typography fontSize="13px" fontWeight={700}>
                  {getAmountWithSign(Number(order?.order_amount) || 0)}
                </Typography>
              </Stack>
            </Stack>
          ))
        : null}
      {totalDelivery != null && (
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="14px" fontWeight={500}>
            {t("Delivery Fee")}
          </Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {getAmountWithSign(Number(totalDelivery) || 0)}
          </Typography>
        </Stack>
      )}
      {grandTotal != null && (
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="15px" fontWeight={600}>
            {t("Total")}
          </Typography>
          <Typography
            fontSize="15px"
            fontWeight={700}
            color={theme.palette.primary.main}
          >
            {getAmountWithSign(Number(grandTotal) || 0)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PlaceOrderSuccessSummary;
