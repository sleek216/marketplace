import MainApi from "api-manage/MainApi";
import { item_add_to_cart, order_details_api } from "api-manage/ApiRoutes";
import { useMutation } from "react-query";
import { getToken, hasValidAuthToken } from "helper-functions/getToken";

const getOrderDetails = async (orderId, guestId) => {
  const query = guestId
    ? `${order_details_api}?order_id=${orderId}&guest_id=${guestId}`
    : `${order_details_api}?order_id=${orderId}`;
  const { data } = await MainApi.get(query);
  return data;
};

const getVariation = (orderLine) => {
  if (Array.isArray(orderLine?.variation)) return orderLine.variation;
  return [];
};

const reorderOrder = async ({ orderId, guestId }) => {
  const orderDetails = await getOrderDetails(orderId, guestId);
  const lines = Array.isArray(orderDetails) ? orderDetails : [];
  if (lines.length === 0) {
    return { added: 0, failed: [{ message: "No items found for reorder." }] };
  }

  let added = 0;
  const failed = [];
  
  // Check if user is authenticated
  const userToken = getToken();
  const isAuthenticated = hasValidAuthToken(userToken);

  for (const line of lines) {
    const itemId = line?.item_id ?? line?.item_details?.id;
    if (!itemId) {
      failed.push({ message: "Item data is incomplete." });
      continue;
    }

    const payload = {
      ...(isAuthenticated ? {} : { guest_id: guestId }),
      model: line?.item_campaign_id ? "ItemCampaign" : "Item",
      item_id: itemId,
      quantity: Number(line?.quantity) || 1,
      price: Number(line?.price) || 0,
      variation: getVariation(line),
      add_on_ids: Array.isArray(line?.add_ons)
        ? line.add_ons.map((addOn) => addOn?.id).filter(Boolean)
        : [],
      add_on_qtys: Array.isArray(line?.add_ons)
        ? line.add_ons.map((addOn) => Number(addOn?.quantity) || 1)
        : [],
    };

    try {
      await MainApi.post(item_add_to_cart, payload);
      added += 1;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Failed to add an item.";
      failed.push({ itemName: line?.item_details?.name, message });
    }
  }

  return { added, failed };
};

export default function useReorderOrder() {
  return useMutation("reorder-order", reorderOrder);
}
