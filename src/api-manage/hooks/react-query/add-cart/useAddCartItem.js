import MainApi from "../../../MainApi";
import { item_add_to_cart } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const addData = async (postData) => {
  const { moduleIdOverride, ...body } = postData || {};
  const { data } = await MainApi.post(item_add_to_cart, body, {
    ...(moduleIdOverride ? { moduleIdOverride } : {}),
  });
  return data;
};

export default function useAddCartItem() {
  return useMutation("add-to-cart", addData);
}
