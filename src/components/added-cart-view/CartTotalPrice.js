import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Typography } from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "../../utils/CustomFunctions";
import { useSelector } from "react-redux";

const CartTotalPrice = ({ cartList }) => {
  const { cartMeta } = useSelector((state) => state.cart);
  const localSubtotal = cartItemsTotalAmount(cartList);
  const hasApiTotals =
    cartMeta?.grand_total != null || cartMeta?.total_delivery_charge != null;

  const deliveryCharge = Number(cartMeta?.total_delivery_charge) || 0;
  const grandSubtotal =
    cartMeta?.grand_subtotal != null
      ? Number(cartMeta.grand_subtotal)
      : localSubtotal;
  const grandTotal =
    cartMeta?.grand_total != null
      ? Number(cartMeta.grand_total)
      : localSubtotal + deliveryCharge;

  return (
    <>
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        sx={{ px: 1.75, pt: 1, pb: 0.35 }}
      >
        <Typography fontSize="14px" color="text.secondary">
          {t("Subtotal")}
        </Typography>
        <Typography fontSize="14px" fontWeight={600}>
          {getAmountWithSign(hasApiTotals ? grandSubtotal : localSubtotal)}
        </Typography>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        sx={{ px: 1.75, py: 0.35 }}
      >
        <Typography fontSize="14px" color="text.secondary">
          {t("Delivery Fee")}
        </Typography>
        <Typography fontSize="14px" fontWeight={600}>
          {getAmountWithSign(deliveryCharge)}
        </Typography>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        sx={{ px: 1.75, pt: 0.5, pb: 1.25 }}
      >
        <Typography fontSize="15px" fontWeight={700}>
          {t("Total")}
        </Typography>
        <Typography fontSize="15px" fontWeight={700} color="primary.main">
          {getAmountWithSign(hasApiTotals ? grandTotal : localSubtotal)}
        </Typography>
      </CustomStackFullWidth>
    </>
  );
};

export default CartTotalPrice;
