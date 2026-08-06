import MainApi from "../../../MainApi";
import { cart_all_item_remove, cart_item_delete } from "../../../ApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";

const deleteItem = async (cartIdAndGuestId) => {
  const { moduleIdOverride, guestId, cart_id } = cartIdAndGuestId || {};
  const requestConfig = moduleIdOverride ? { moduleIdOverride } : {};

  if (typeof cart_id === "string" && cart_id.startsWith("temp_")) {
    return { data: { message: "Optimistic item deleted locally" } };
  }

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
  const queryClient = useQueryClient();
  return useMutation("delete-all-cart-item", deleteItem, {
    onSuccess: (data) => {
      const queryKey = ["cart-itemss"];
      if (Array.isArray(data)) {
        queryClient.setQueryData(queryKey, data);
      }
      queryClient.invalidateQueries("cart-itemss");
    },
  });
}
