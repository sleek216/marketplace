import MainApi from "../../../MainApi";
import { item_add_to_cart } from "../../../ApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import { getGuestId } from "helper-functions/getToken";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";

const sanitizeGuestId = (id) => {
  if (typeof id !== "string") return null;
  const norm = id.trim().toLowerCase();
  return norm && norm !== "null" && norm !== "undefined" ? id.trim() : null;
};

const addData = async (postData) => {
  const { moduleIdOverride, ...body } = postData || {};
  const guest_id = sanitizeGuestId(body.guest_id) || sanitizeGuestId(getGuestId());
  const price = Number(body.price) || 0;
  const payload = {
    ...body,
    ...(guest_id ? { guest_id } : {}),
    price,
  };
  const { data } = await MainApi.post(item_add_to_cart, payload, {
    ...(moduleIdOverride ? { moduleIdOverride } : {}),
  });
  return data;
};

export default function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation("add-to-cart", addData, {
    onSuccess: (data) => {
      const queryKey = ["cart-itemss"];
      if (Array.isArray(data)) {
        queryClient.setQueryData(queryKey, data);
      }
      queryClient.invalidateQueries("cart-itemss");
    },
  });
}
