
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { rental_coupon_list_api } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";


// Define a standalone fetcher function
const fetchCouponLists = async () => {
  const { data } = await MainApi.get(`${rental_coupon_list_api}`);
  return data;
};

// Rental coupon list — only fetch when `enabled: true` (e.g. rental module UI).
export const useGetCouponLists = (options = {}) => {
  const { enabled = false, ...rest } = options;
  return useQuery("coupon-list-vehicle", fetchCouponLists, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: onSingleErrorResponse,
    enabled,
    ...rest,
  });
};