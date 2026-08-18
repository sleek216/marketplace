import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Typography } from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "utils/CustomFunctions";
import { useSelector } from "react-redux";
import { getTotalCartDeliveryCharge } from "helper-functions/cartTotals";
import DeliveryFeeAmount from "./DeliveryFeeAmount";

const CartTotalPrice = ({ cartList, storeData }) => {
  const { cartMeta, deliveryChargeRefreshing } = useSelector((state) => state.cart);

  const selectedCount = Array.isArray(cartList) ? cartList.length : 0;

  const grandSubtotal = React.useMemo(
    () => (selectedCount === 0 ? 0 : cartItemsTotalAmount(cartList)),
    [cartList, selectedCount]
  );

  const deliveryCharge = React.useMemo(
    () => getTotalCartDeliveryCharge(cartList, cartMeta, storeData),
    [cartList, cartMeta, selectedCount, storeData]
  );

  const grandTotal = grandSubtotal + deliveryCharge;

  return (
    <>
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        sx={{ px: 1.75, pt: 1, pb: 0.35 }}
      >
        <Typography fontSize="14px" color="text.secondary">
          {t("Grand Subtotal")}
        </Typography>
        <Typography fontSize="14px" fontWeight={600}>
          {getAmountWithSign(grandSubtotal)}
        </Typography>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        sx={{ px: 1.75, py: 0.35 }}
      >
        <Typography fontSize="14px" color="text.secondary">
          {t("Total Delivery Fee")}
        </Typography>
        <DeliveryFeeAmount
          amount={deliveryCharge}
          loading={deliveryChargeRefreshing}
          fontSize="14px"
        />
      </CustomStackFullWidth>
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        sx={{ px: 1.75, pt: 0.5, pb: 1.25 }}
      >
        <Typography fontSize="15px" fontWeight={700}>
          {t("Grand Total")}
        </Typography>
        <DeliveryFeeAmount
          amount={grandTotal}
          loading={deliveryChargeRefreshing}
          fontSize="15px"
          fontWeight={700}
          color="primary.main"
        />
      </CustomStackFullWidth>
    </>
  );
};

export default CartTotalPrice;
