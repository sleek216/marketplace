import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "../../utils/CustomFunctions";
import { useSelector } from "react-redux";
import { groupItemsByStore } from "../product-details/storeItemGrouping";

/**
 * Computes delivery charge for a group of selected cart items from one store.
 * Priority: API store_groups → item-level store data → per-item max fallback → 60 default.
 */
const resolveStoreDeliveryCharge = (groupItems, apiGroup) => {
  // If ALL items in the group are deselected, charge is 0
  if (!groupItems || groupItems.length === 0) return 0;

  // Check free delivery from API or item data
  const firstItem = groupItems[0]?.item || groupItems[0] || {};
  const storeObj =
    firstItem?.store ||
    firstItem?.store_details ||
    firstItem?.item?.store ||
    firstItem?.item?.store_details ||
    firstItem;

  const isFreeDelivery = storeObj?.free_delivery || firstItem?.free_delivery;
  if (isFreeDelivery) return 0;

  // Use API delivery charge if available
  if (apiGroup?.delivery_charge != null && Number(apiGroup.delivery_charge) >= 0) {
    return Number(apiGroup.delivery_charge);
  }

  // Fallback: pick the maximum delivery charge across all items in this store
  // (matches backend behavior where max charge is used for multi-product stores)
  let maxCharge = 0;
  groupItems.forEach(({ item }) => {
    const itm = item?.item || item || {};
    const store = itm?.store || itm?.store_details || itm;
    const charge =
      Number(store?.minimum_shipping_charge) ||
      Number(store?.minimum_delivery_charge) ||
      Number(store?.delivery_charge) ||
      Number(itm?.minimum_shipping_charge) ||
      Number(itm?.minimum_delivery_charge) ||
      Number(itm?.delivery_charge) ||
      0;
    if (charge > maxCharge) maxCharge = charge;
  });

  return maxCharge > 0 ? maxCharge : 60;
};

const CartTotalPrice = ({ cartList, selectedCartIds, isFetchingApi }) => {
  const { cartMeta } = useSelector((state) => state.cart);

  const selectedCount = Array.isArray(cartList) ? cartList.length : 0;

  const localSubtotal = React.useMemo(
    () => cartItemsTotalAmount(cartList),
    [cartList]
  );

  /**
   * Compute total delivery fee by summing per-store charges.
   * Uses the same priority as CartContents: API store_groups → item fallback → 60 default.
   * For multi-product stores, takes the MAX charge (matches backend logic).
   */
  const localDeliveryFee = React.useMemo(() => {
    if (selectedCount === 0 || !Array.isArray(cartList)) return 0;
    const apiGroups = cartMeta?.store_groups || [];
    const clientGroups = groupItemsByStore(cartList);

    let total = 0;
    clientGroups.forEach((group) => {
      const apiGroup = apiGroups.find(
        (sg) => String(sg?.store_id) === String(group.storeId)
      );
      const charge = resolveStoreDeliveryCharge(group.items, apiGroup);
      total += charge;
    });
    return total;
  }, [cartList, cartMeta, selectedCount]);

  const grandSubtotal = selectedCount === 0 ? 0 : localSubtotal;

  // Prefer API-computed total delivery when selection data is fresh
  const deliveryCharge =
    selectedCount === 0
      ? 0
      : cartMeta?.selection_applied &&
        cartMeta?.total_delivery_charge != null &&
        Number(cartMeta.total_delivery_charge) >= 0
      ? Number(cartMeta.total_delivery_charge)
      : localDeliveryFee;

  const grandTotal = selectedCount === 0 ? 0 : grandSubtotal + deliveryCharge;

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
        <Typography fontSize="14px" fontWeight={600}>
          {isFetchingApi ? (
            <CircularProgress size={13} thickness={5} color="primary" />
          ) : (
            getAmountWithSign(deliveryCharge)
          )}
        </Typography>
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
        <Typography fontSize="15px" fontWeight={700} color="primary.main">
          {isFetchingApi ? (
            <CircularProgress size={14} thickness={5} color="primary" />
          ) : (
            getAmountWithSign(grandTotal)
          )}
        </Typography>
      </CustomStackFullWidth>
    </>
  );
};

export default CartTotalPrice;
