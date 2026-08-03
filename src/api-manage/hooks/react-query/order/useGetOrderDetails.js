import MainApi from "../../../MainApi";
import { order_details_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import {
  getToken,
  hasValidAuthToken,
} from "helper-functions/getToken";

const getData = async (order_id, guestId) => {
  const isAuthenticated = hasValidAuthToken(getToken());
  const params = new URLSearchParams({ order_id: String(order_id) });
  if (!isAuthenticated && guestId) {
    params.set("guest_id", String(guestId));
  }
  const { data } = await MainApi.get(`${order_details_api}?${params.toString()}`);
  return data;
};

export default function useGetOrderDetails(order_id, guestId) {
  return useQuery(["order-details", order_id, guestId], () => getData(order_id, guestId), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
