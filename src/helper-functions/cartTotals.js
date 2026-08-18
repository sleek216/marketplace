/**
 * Cart drawer totals — Daraz-style: compute instantly from local cart,
 * then refine with API store_groups / store details when they arrive.
 */

import { groupItemsByStore } from "../components/product-details/storeItemGrouping";

export const getCartQuantityCount = (cartList) => {
  if (!Array.isArray(cartList) || cartList.length === 0) return 0;
  return cartList.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);
};

const toCharge = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const pickDeliveryChargeFromRecord = (item) => {
  const itm = item?.item || item || {};
  const store = itm?.store || itm?.store_details || item?.store || item?.store_details || {};
  return Math.max(
    toCharge(store?.minimum_shipping_charge),
    toCharge(store?.minimum_delivery_charge),
    toCharge(store?.delivery_charge),
    toCharge(itm?.minimum_shipping_charge),
    toCharge(itm?.minimum_delivery_charge),
    toCharge(itm?.delivery_charge),
    toCharge(item?.minimum_shipping_charge),
    toCharge(item?.minimum_delivery_charge),
    toCharge(item?.delivery_charge)
  );
};

/**
 * Per-store delivery: API group → store details → item/store fields.
 * One charge per store (not per item), same as Daraz shop shipping.
 */
export const resolveStoreDeliveryCharge = (groupItems, apiGroup, storeFallback) => {
  if (!Array.isArray(groupItems) || groupItems.length === 0) return 0;

  const first = groupItems[0]?.item || groupItems[0] || {};
  const storeObj =
    first?.store ||
    first?.store_details ||
    first?.item?.store ||
    first?.item?.store_details ||
    first;

  if (storeObj?.free_delivery || first?.free_delivery || storeFallback?.free_delivery) {
    return 0;
  }

  if (apiGroup?.delivery_charge != null && Number(apiGroup.delivery_charge) >= 0) {
    return Number(apiGroup.delivery_charge);
  }

  const fallbackMatchesStore =
    storeFallback &&
    (String(storeFallback?.id) === String(apiGroup?.store_id) ||
      String(storeFallback?.id) === String(first?.store_id) ||
      String(storeFallback?.id) === String(storeObj?.id));

  if (fallbackMatchesStore) {
    const fromStore = Math.max(
      toCharge(storeFallback?.minimum_shipping_charge),
      toCharge(storeFallback?.minimum_delivery_charge),
      toCharge(storeFallback?.delivery_charge)
    );
    if (fromStore > 0) return fromStore;
    if (storeFallback?.free_delivery) return 0;
  }

  let maxCharge = 0;
  groupItems.forEach(({ item }) => {
    const charge = pickDeliveryChargeFromRecord(item);
    if (charge > maxCharge) maxCharge = charge;
  });

  if (maxCharge > 0) return maxCharge;

  if (storeFallback) {
    return Math.max(
      toCharge(storeFallback?.minimum_shipping_charge),
      toCharge(storeFallback?.minimum_delivery_charge),
      toCharge(storeFallback?.delivery_charge)
    );
  }

  return 0;
};

/** Same total delivery fee as cart drawer + checkout should show. */
export const getTotalCartDeliveryCharge = (cartList, cartMeta, storeData) => {
  if (!Array.isArray(cartList) || cartList.length === 0) return 0;

  const apiGroups = cartMeta?.store_groups || [];
  const clientGroups = groupItemsByStore(cartList);

  const summed = clientGroups.reduce((total, group) => {
    const apiGroup = apiGroups.find(
      (sg) => String(sg?.store_id) === String(group.storeId)
    );
    return total + resolveStoreDeliveryCharge(group.items, apiGroup, storeData);
  }, 0);

  if (summed > 0) return summed;

  const apiTotal = Number(cartMeta?.total_delivery_charge);
  if (Number.isFinite(apiTotal) && apiTotal >= 0 && apiGroups.length > 0) {
    return apiTotal;
  }

  return summed;
};

export const isCartItemSelected = (item, selectedCartIds) => {
  if (!Array.isArray(selectedCartIds) || selectedCartIds.length === 0) return false;
  const itemId = String(item?.cartItemId || item?.id);
  return selectedCartIds.some((id) => String(id) === itemId);
};
