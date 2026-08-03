import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useGetUserInfo from "api-manage/hooks/react-query/user/useGetUserInfo";
import { setUser } from "redux/slices/profileInfo";
import { setWalletAmount } from "redux/slices/cart";

/**
 * Loads /customer/info into Redux when a token exists (shared by header + profile).
 */
export default function useCustomerProfileSync() {
  const dispatch = useDispatch();
  const onSuccess = useCallback((res) => {
    if (res) {
      if (res.wallet_balance !== undefined && res.wallet_balance !== null) {
        localStorage.setItem("wallet_amount", String(res.wallet_balance));
        dispatch(setWalletAmount(res.wallet_balance));
      }
      dispatch(setUser(res));
    }
  }, [dispatch]);

  return useGetUserInfo(onSuccess);
}
