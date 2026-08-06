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
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";

const hasValidGuestId = (guestId) => {
  if (typeof guestId !== "string") return false;
  const normalized = guestId.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "null" && normalized !== "undefined";
};

const getData = async (selectedCartIds) => {
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

  if (!isAuthenticated && hasGuest) {
    params.set("guest_id", guestId);
  }

  const { lat, lng } = getCustomerLatLng();
  if (lat != null && lng != null && lat !== "" && lng !== "") {
    params.set("latitude", String(lat));
    params.set("longitude", String(lng));
  }

  if (Array.isArray(selectedCartIds)) {
    if (selectedCartIds.length === 0) {
      params.set("selected_cart_ids", "");
    } else {
      params.set("selected_cart_ids", selectedCartIds.join(","));
    }
  }

  const moduleId = getCurrentModuleId();
  const requestOptions = {};
  // Only omit moduleId if no module is selected (cross-module / landing page context)
  if (!moduleId) {
    requestOptions.omitModuleId = true;
  }

  const { data } = await MainApi.get(`${all_cart_list}?${params.toString()}`, requestOptions);
  return data;
};

const onCartListError = (error) => {
  const status = error?.response?.status;
  if (status === 403 || status === 401) {
    return;
  }

  onSingleErrorResponse(error);
};

export default function useGetAllCartList(_guestId, cartListSuccessHandler, selectedCartIds) {
  const moduleId = getCurrentModuleId();
  return useQuery(
    ["cart-itemss", moduleId || "all-modules", selectedCartIds ? selectedCartIds.join(",") : "all"],
    () => getData(selectedCartIds),
    {
      onSuccess: cartListSuccessHandler,
      onError: onCartListError,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );
}
