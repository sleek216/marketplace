import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { all_cart_list } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import {
  getGuestId,
  getToken,
  hasValidAuthToken,
} from "helper-functions/getToken";
import { getCustomerLatLng } from "helper-functions/normalizeCartListResponse";

const hasValidGuestId = (guestId) => {
  if (typeof guestId !== "string") return false;
  const normalized = guestId.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "null" && normalized !== "undefined";
};

const getData = async () => {
  const userToken = getToken();
  const guestId = getGuestId();
  const isAuthenticated = hasValidAuthToken(userToken);
  const hasGuest = hasValidGuestId(guestId);

  if (!isAuthenticated && !hasGuest) {
    return [];
  }

  const params = new URLSearchParams();
  params.set("group_by_store", "1");
  params.set("order_type", "delivery");

  // Guest cart uses guest_id; authenticated cart uses Bearer token only.
  // Sending guest_id after login causes 403 once the guest cart is merged.
  if (!isAuthenticated && hasGuest) {
    params.set("guest_id", guestId);
  }

  // Always send location when available (also sent via MainApi headers).
  const { lat, lng } = getCustomerLatLng();
  if (lat != null && lng != null && lat !== "" && lng !== "") {
    params.set("latitude", String(lat));
    params.set("longitude", String(lng));
  }

  const { data } = await MainApi.get(`${all_cart_list}?${params.toString()}`, {
    omitModuleId: true,
  });
  return data;
};

const onCartListError = (error) => {
  const status = error?.response?.status;
  const isAuthenticated = hasValidAuthToken(getToken());
  const guestId = getGuestId();

  // Expected during auth transitions — avoid noisy toasts.
  if (status === 403 || status === 401) {
    if (isAuthenticated || !hasValidGuestId(guestId)) {
      return;
    }
  }

  onSingleErrorResponse(error);
};

export default function useGetAllCartList(_guestId, cartListSuccessHandler) {
  return useQuery("cart-itemss", getData, {
    onSuccess: cartListSuccessHandler,
    enabled: false,
    onError: onCartListError,
  });
}
