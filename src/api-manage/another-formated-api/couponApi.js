import MainApi from "../MainApi";

export const CouponApi = {
  couponList: () => MainApi.get("/api/v1/coupon/list"),
  applyCoupon: (code, store_id) =>
    MainApi.get(
      `/api/v1/coupon/apply?code=${encodeURIComponent(
        String(code ?? "")
      )}&store_id=${encodeURIComponent(String(store_id ?? ""))}`
    ),
};
