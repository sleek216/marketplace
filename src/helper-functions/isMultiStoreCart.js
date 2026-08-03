import { getStoreIdFromRecord } from "components/product-details/ManualExpectedDeliveryInfo";

/**
 * Multi-store cart detection for checkout payment rules.
 * Prefers API cartMeta.is_multi_store; falls back to unique store_id count.
 */
export const isMultiStoreCart = (cartList, cartMeta) => {
  if (cartMeta?.is_multi_store) return true;

  if (!Array.isArray(cartList) || cartList.length === 0) return false;

  const storeIds = new Set();
  cartList.forEach((item) => {
    const storeId = getStoreIdFromRecord(item);
    if (storeId != null && storeId !== "__default__") {
      storeIds.add(String(storeId));
    }
  });

  return storeIds.size > 1;
};

export const isMultiStoreUnsupportedPayment = (
  paymentMethod,
  usePartialPayment
) => {
  if (usePartialPayment) return true;
  if (!paymentMethod) return false;
  if (paymentMethod === "cash_on_delivery") return false;
  if (paymentMethod === "wallet") return false;
  if (
    paymentMethod === "offline_payment" ||
    String(paymentMethod).includes("offline_payment")
  ) {
    return false;
  }
  // digital gateways / digital_payment
  return true;
};
