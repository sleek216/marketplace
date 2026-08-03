const PLACE_ORDER_SUCCESS_KEY = "placeOrderSuccess";

export const isMultiStorePlaceOrderResponse = (data) =>
  Boolean(data?.is_multi_store) ||
  (Array.isArray(data?.order_ids) && data.order_ids.length > 1) ||
  (Array.isArray(data?.orders) && data.orders.length > 1);

export const savePlaceOrderSuccess = (responseData) => {
  if (!responseData || typeof window === "undefined") return;
  try {
    localStorage.setItem(PLACE_ORDER_SUCCESS_KEY, JSON.stringify(responseData));
    if (responseData?.total_ammount != null || responseData?.grand_total != null) {
      localStorage.setItem(
        "totalAmount",
        String(responseData.grand_total ?? responseData.total_ammount)
      );
    }
  } catch {
    // ignore storage errors
  }
};

export const getPlaceOrderSuccess = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLACE_ORDER_SUCCESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearPlaceOrderSuccess = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PLACE_ORDER_SUCCESS_KEY);
  } catch {
    // ignore
  }
};
