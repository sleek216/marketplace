import MainApi from "../../../MainApi";
import { cart_item_update, item_add_to_cart, all_cart_list } from "../../../ApiRoutes";
import { useMutation } from "react-query";
import { getGuestId, getToken, hasValidAuthToken } from "helper-functions/getToken";

const sanitizeGuestId = (id) => {
  if (typeof id !== "string") return null;
  const norm = id.trim().toLowerCase();
  return norm && norm !== "null" && norm !== "undefined" ? id.trim() : null;
};

const addData = async (postData) => {
  const { moduleIdOverride, ...body } = postData || {};
  const guest_id = sanitizeGuestId(body.guest_id) || sanitizeGuestId(getGuestId());
  const price = Number(body.price) || 0;

  if (typeof body?.cart_id === "string" && body.cart_id.startsWith("temp_")) {
    const { cart_id, ...addBody } = body;
    const addPayload = {
      ...addBody,
      ...(guest_id ? { guest_id } : {}),
      price,
    };
    try {
      const { data } = await MainApi.post(item_add_to_cart, addPayload, {
        ...(moduleIdOverride ? { moduleIdOverride } : {}),
      });
      return data;
    } catch (err) {
      const msg = (err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("exist")) {
        const params = new URLSearchParams();
        params.set("group_by_store", "1");
        params.set("order_type", "delivery");
        if (guest_id && !hasValidAuthToken(getToken())) {
          params.set("guest_id", guest_id);
        }
        try {
          const { data } = await MainApi.get(`${all_cart_list}?${params.toString()}`, { omitModuleId: true });
          return data;
        } catch {
          return null;
        }
      }
      throw err;
    }
  }

  const payload = {
    ...body,
    ...(guest_id ? { guest_id } : {}),
    price,
  };
  const { data } = await MainApi.post(cart_item_update, payload, {
    ...(moduleIdOverride ? { moduleIdOverride } : {}),
  });
  return data;
};

export default function useCartItemUpdate() {
  return useMutation("updated_cart_item", addData);
}
