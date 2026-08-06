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

  // Compute store fallback delivery charges if backend returns 0 (e.g. before address selection)
  const storeFallbackDeliveryFee = React.useMemo(() => {
    if (!Array.isArray(cartList) || cartList.length === 0) return 0;
    const storeMap = new Map();
    cartList.forEach((cartRow) => {
      const item = cartRow?.item || cartRow || {};
      const storeObj = item?.store || item?.store_details || item?.item?.store || item;
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
          storeMap.set(storeId, fee);
        }
      }
    });
    let totalFee = 0;
    storeMap.forEach((val) => {
      totalFee += val > 0 ? val : 60;
    });
    return totalFee > 0 ? totalFee : (cartList.length > 0 ? 60 : 0);
  }, [cartList]);

  const deliveryCharge =
    cartMeta?.total_delivery_charge != null && Number(cartMeta.total_delivery_charge) > 0
      ? Number(cartMeta.total_delivery_charge)
      : storeFallbackDeliveryFee;

  const grandSubtotal =
    cartMeta?.grand_subtotal != null && Number(cartMeta.grand_subtotal) > 0
      ? Number(cartMeta.grand_subtotal)
      : localSubtotal;

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
