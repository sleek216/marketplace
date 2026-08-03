import MainApi from "../../../MainApi";
import { cart_all_item_remove, cart_item_delete } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const deleteItem = async (cartIdAndGuestId) => {
  const { moduleIdOverride, guestId, cart_id } = cartIdAndGuestId || {};
  const requestConfig = moduleIdOverride ? { moduleIdOverride } : {};

  if (guestId) {
    const { data } = await MainApi.delete(
      `${cart_item_delete}?guest_id=${guestId}&cart_id=${cart_id}`,
      requestConfig
    );
    return data;
  }

  const { data } = await MainApi.delete(
    `${cart_item_delete}?cart_id=${cart_id}`,
    requestConfig
  );
  return data;
};

export default function useDeleteCartItem() {
  return useMutation("delete-all-cart-item", deleteItem);
}
