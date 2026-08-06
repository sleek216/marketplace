import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Typography } from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "../../utils/CustomFunctions";
import { useSelector } from "react-redux";

const CartTotalPrice = ({ cartList, allCartList }) => {
  const { cartMeta } = useSelector((state) => state.cart);

  // Always compute subtotal locally from the SELECTED items (real-time, no API needed)
  const grandSubtotal = React.useMemo(
    () => cartItemsTotalAmount(cartList),
    [cartList]
  );

  // Compute local delivery fee from selected items' stores
  const localDeliveryFee = React.useMemo(() => {
    if (!Array.isArray(cartList) || cartList.length === 0) return 0;
    const storeMap = new Map();
    cartList.forEach((cartRow) => {
      const item = cartRow?.item || cartRow || {};
      const storeObj =
        item?.store || item?.store_details || item?.item?.store || item;
      const storeId = storeObj?.id || item?.store_id || item?.id;
      if (storeId && !storeMap.has(storeId)) {
        if (storeObj?.free_delivery || item?.free_delivery) {
          storeMap.set(storeId, 0);
        } else {
          const fee =
            Number(storeObj?.minimum_shipping_charge) ||
            Number(storeObj?.minimum_delivery_charge) ||
            Number(storeObj?.delivery_charge) ||
            Number(item?.minimum_shipping_charge) ||
            Number(item?.minimum_delivery_charge) ||
            Number(item?.delivery_charge) ||
            0;
          storeMap.set(storeId, fee > 0 ? fee : 60);
        }
      }
    });
    let totalFee = 0;
    storeMap.forEach((val) => {
      totalFee += val;
    });
    return totalFee > 0 ? totalFee : cartList.length > 0 ? 60 : 0;
  }, [cartList]);

  // If backend has delivery charge scale proportionally to selected items
  const deliveryCharge = React.useMemo(() => {
    const backendDelivery = Number(cartMeta?.total_delivery_charge) || 0;
    if (backendDelivery > 0) {
      const allSubtotal = cartItemsTotalAmount(
        Array.isArray(allCartList) && allCartList.length > 0
          ? allCartList
          : cartList
      );
      if (allSubtotal > 0 && grandSubtotal < allSubtotal) {
        // Scale delivery proportionally to selected items ratio
        return (
          Math.round(((backendDelivery * grandSubtotal) / allSubtotal) * 100) /
          100
        );
      }
      return backendDelivery;
    }
    return localDeliveryFee;
  }, [cartMeta, grandSubtotal, allCartList, cartList, localDeliveryFee]);

  const grandTotal = grandSubtotal + deliveryCharge;

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
          {getAmountWithSign(grandSubtotal)}
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
          {getAmountWithSign(grandTotal)}
        </Typography>
      </CustomStackFullWidth>
    </>
  );
};

export default CartTotalPrice;
