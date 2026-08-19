import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { styled, Typography, alpha, Box } from "@mui/material";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { Stack } from "@mui/system";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { Receipt } from "lucide-react";

export const OrderSummaryCalculationCard = styled(CustomStackFullWidth)(
  ({ theme }) => ({
    paddingInline: "20px",
    paddingBlock: "20px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.neutral[900], 0.8)
        : theme.palette.background.paper,
    borderRadius: "10px",
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    boxShadow: "0 2px 14px rgba(0,0,0,0.03)",
  })
);
const getItemsPrice = (items) => {
  const productPrice = items?.reduce(
    (total, product) => product?.price * product?.quantity + total,
    0
  );
  return productPrice;
};
const getAddOnsPrice = (items) => {
  let productAddonsPrice = items.reduce(
    (total, product) =>
      (product?.add_ons?.length > 0
        ? product?.add_ons?.reduce(
          (cTotal, cProduct) => cProduct?.price * cProduct?.quantity + cTotal,
          0
        )
        : 0) + total,
    0
  );
  return productAddonsPrice;
};
const getSubTotalPrice = (dataList) => {
  return getItemsPrice(dataList) + getAddOnsPrice(dataList);
};

function getRestaurantValue(data, key) {
  return data?.[0]?.item_details?.[key];
}

const OrderCalculation = ({ data, t, trackOrderData }) => {
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const handleExcludedVatTotalAmount = () => {
    return getAmountWithSign(
      trackOrderData?.order_amount - trackOrderData?.total_tax_amount
    );
  };

  const due_amount =
    trackOrderData?.order_amount - trackOrderData?.partially_paid_amount;
  return (
    <OrderSummaryCalculationCard spacing={2}>
      {trackOrderData?.bring_change_amount > 0 ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          backgroundColor={alpha(theme.palette.warning.main, 0.1)}
          padding="12px 16px"
          borderRadius="2px"
          border={`1px solid ${alpha(theme.palette.warning.main, 0.3)}`}
        >
          <Typography fontSize="13px" color={theme.palette.warning.dark} fontWeight={500}>
            {t(`Please bring ${getAmountWithSign(trackOrderData?.bring_change_amount)} in change when making the delivery.`)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      <Stack direction="row" alignItems="center" spacing={1.25} mb={0.5}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            borderRadius: "8px",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <Receipt size={18} />
        </Box>
        <Typography fontWeight={700} fontSize="16px" color="primary.main">
          {t("Summary")}
        </Typography>
      </Stack>
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{
          padding: "8px 0",
        }}
      >
        <Typography fontSize="14px" color={theme.palette.neutral[700]} fontWeight={400}>
          {t("Items Price")}
        </Typography>
        <Typography fontSize="14px" fontWeight={500} color={theme.palette.neutral[1000]}>
          {data && data?.length > 0 && getAmountWithSign(getItemsPrice(data))}
        </Typography>
      </CustomStackFullWidth>
      {trackOrderData?.module?.module_type === "food" && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px"> {t("Addons Price")}</Typography>
          <Typography fontSize="14px">
            {data &&
              data?.length > 0 &&
              getAmountWithSign(getAddOnsPrice(data))}
          </Typography>
        </CustomStackFullWidth>
      )}

      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography fontSize="14px"> {t("Subtotal")}</Typography>
        <Typography fontSize="14px">
          {data &&
            data?.length > 0 &&
            getAmountWithSign(getSubTotalPrice(data))}
        </Typography>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography fontSize="14px"> {t("Discount")}</Typography>
        <Typography fontSize="14px">
          -
          {trackOrderData &&
            getAmountWithSign(trackOrderData?.store_discount_amount)
            ? getAmountWithSign(
              trackOrderData?.store_discount_amount +
              trackOrderData?.flash_admin_discount_amount +
              trackOrderData?.flash_store_discount_amount
            )
            : 0}
        </Typography>
      </CustomStackFullWidth>
      {Number.parseInt(trackOrderData?.coupon_discount_amount) !== 0 && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px"> {t("Coupon Discount")}</Typography>
          <Typography fontSize="14px">
            -
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.coupon_discount_amount)}
          </Typography>
        </CustomStackFullWidth>
      )}
      {trackOrderData?.ref_bonus_amount > 0 ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px"> {t("Referral Discount")}</Typography>
          <Typography fontSize="14px">
            -
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.ref_bonus_amount)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}
      {trackOrderData?.extra_packaging_amount > 0 ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px"> {t("Extra Packaging")}</Typography>
          <Typography fontSize="14px">
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.extra_packaging_amount)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}
      {trackOrderData?.tax_status === "excluded" && trackOrderData?.total_tax_amount
        > 0 && (
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography>
              {t("VAT/TAX")}
            </Typography>
            <Typography>
              {trackOrderData?.tax_status !== "included" && " (+) "}
              {trackOrderData &&
                getAmountWithSign(trackOrderData?.total_tax_amount)}
            </Typography>
          </CustomStackFullWidth>
        )}
      {Number.parseInt(trackOrderData?.dm_tips) !== 0 && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px">{t("Delivery Man Tips")}</Typography>
          <Typography fontSize="14px">
            {trackOrderData && getAmountWithSign(trackOrderData?.dm_tips)}
          </Typography>
        </CustomStackFullWidth>
      )}
      {Number(trackOrderData?.additional_charge) > 0 ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px" sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap", // ensures single line
          }}>
            {configData?.additional_charge_name || t("Additional Charge")}
          </Typography>
          <Typography fontSize="14px">
            {trackOrderData && getAmountWithSign(trackOrderData?.additional_charge)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography fontSize="14px">{t("Delivery fee")}</Typography>
        <Typography fontSize="14px">
          {trackOrderData && getAmountWithSign(trackOrderData?.delivery_charge)}
        </Typography>
      </CustomStackFullWidth>
      <Stack
        width="100%"
        sx={{
          mt: "10px",
          mb: "10px",
          borderBottom: (theme) =>
            `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      />
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography component="span" fontWeight={700} fontSize="15px" color={theme.palette.primary.main}>
          {t("Total")}
          {trackOrderData?.tax_status === "included" && (
            <Typography component="span" ml={"6px"} fontSize="11px" fontWeight={400} color={theme.palette.neutral[600]}>
              {t("(Vat/Tax incl.)")}
            </Typography>
          )}
        </Typography>
        <Typography fontWeight={700} fontSize="16px" color={theme.palette.primary.main}>
          {getAmountWithSign(trackOrderData?.order_amount)}
        </Typography>
      </CustomStackFullWidth>
      {trackOrderData?.partially_paid_amount &&
        trackOrderData?.order_status !== "canceled" ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px" textTransform="capitalize">
            {t("Paid by wallet")}
          </Typography>
          <Typography fontSize="14px">
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.partially_paid_amount)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      {trackOrderData?.payment_method === "partial_payment" ? (
        <>
          {trackOrderData?.payments[1]?.payment_status === "unpaid" ? (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                fontSize="14px"
                textTransform="capitalize"
                fontWeight="bold"
              >
                {t("Due Payment")} (
                {trackOrderData &&
                  t(trackOrderData?.payments[1]?.payment_method).replaceAll(
                    "_",
                    " "
                  )}
                )
              </Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {trackOrderData && getAmountWithSign(due_amount)}
              </Typography>
            </CustomStackFullWidth>
          ) : (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                fontSize="14px"
                textTransform="capitalize"
                fontWeight="bold"
              >
                {t("Paid By")} (
                {trackOrderData &&
                  t(trackOrderData?.payments[1]?.payment_method).replaceAll(
                    "_",
                    " "
                  )}
                )
              </Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {trackOrderData && getAmountWithSign(due_amount)}
              </Typography>
            </CustomStackFullWidth>
          )}
        </>
      ) : null}
    </OrderSummaryCalculationCard>
  );
};

OrderCalculation.propTypes = {};

export default OrderCalculation;
