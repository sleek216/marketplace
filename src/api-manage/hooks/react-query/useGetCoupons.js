import { useQuery } from "react-query";
import { getToken } from "helper-functions/getToken";
import { getModuleId } from "helper-functions/getModuleId";
import { fetchCustomerCouponList } from "helper-functions/customerCouponList";

const getZoneId = () =>
  typeof window !== "undefined" ? localStorage.getItem("zoneid") : null;

/**
 * Fetches `/api/v1/coupon/list` when `enabled` is true.
 * Default: run on the client when a user token exists (no manual refetch needed).
 */
export default function useGetCoupons(options = {}) {
  const {
    enabled: enabledOption,
    staleTime,
    cacheTime,
    onError,
    onSuccess,
    retry,
    refetchOnWindowFocus,
  } = options;
  const defaultEnabled =
    typeof window !== "undefined" && Boolean(getToken());
  return useQuery(
    ["coupons-list", getModuleId(), getZoneId()],
    fetchCustomerCouponList,
    {
      staleTime,
      cacheTime,
      onError,
      onSuccess,
      retry,
      refetchOnWindowFocus,
      enabled:
        enabledOption !== undefined ? enabledOption : defaultEnabled,
    }
  );
}
