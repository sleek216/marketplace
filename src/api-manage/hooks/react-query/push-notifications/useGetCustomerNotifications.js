import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { customer_notifications_api } from "api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getData = async (status = "all") => {
  const { data } = await MainApi.get(`${customer_notifications_api}?status=${status}`);
  return data;
};

const normalizeNotifications = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.notifications)) return response.notifications;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.notifications)) return response.data.notifications;
  return [];
};

const hasValidAuthToken = (token) => {
  if (typeof token !== "string") return false;
  const normalized = token.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "null" && normalized !== "undefined";
};

const useGetCustomerNotifications = (token, status = "all") => {
  const isAuthenticated = hasValidAuthToken(token);
  return useQuery(["customer-notifications", status, isAuthenticated], () => getData(status), {
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 60000 : false,
    select: normalizeNotifications,
    onError: onErrorResponse,
  });
};

export default useGetCustomerNotifications;

