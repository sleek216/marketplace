import MainApi from "../../../MainApi";
import { cart_item_update } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const addData = async (postData) => {
  const { moduleIdOverride, ...body } = postData || {};
  const { data } = await MainApi.post(cart_item_update, body, {
    ...(moduleIdOverride ? { moduleIdOverride } : {}),
  });
  return data;
};

export default function useCartItemUpdate() {
  return useMutation("updated_cart_item", addData);
}
