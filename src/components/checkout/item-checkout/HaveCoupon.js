import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  alpha,
  Box,
  Card,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CouponApi } from "api-manage/another-formated-api/couponApi";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { setCouponInfo, setCouponType } from "redux/slices/profileInfo";
import { coupon_minimum } from "utils/toasterMessages";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import {
  fetchCustomerCouponList,
  filterCouponsForCheckout,
} from "helper-functions/customerCouponList";
import { getToken } from "helper-functions/getToken";
import HadCouponBox from "./HadCouponBox";
import CouponFieldIcon from "./CouponFieldIcon";
import Coupon from "components/coupons/Coupon";
import { ChevronDown, ChevronUp } from "lucide-react";

const HaveCoupon = (props) => {
  const {
    store_id,
    module_id,
    setCouponDiscount,
    totalAmount,
    deliveryFee,
    deliveryTip,
    setSwitchToWallet,
    payableAmount,
  } = props;
  const { couponInfo } = useSelector((state) => state.profileInfo);
  const [couponCode, setCouponCode] = useState(couponInfo?.code);
  const [browseExpanded, setBrowseExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const zoneId =
    typeof window !== "undefined" ? localStorage.getItem("zoneid") : undefined;

  const getCouponDiscount = (discount, discountType, totalAmountOverall) => {
    if (discountType === "amount") {
      return discount;
    } else {
      return (discount / 100) * totalAmountOverall;
    }
  };

  const handleSuccess = useCallback(
    (response) => {
      const totalAmountOverall = totalAmount - deliveryFee - deliveryTip;
      const isFreeDelivery =
        response?.data?.coupon_type === "free_delivery";

      if (
        Number.parseInt(response?.data?.min_purchase) >
        Number.parseInt(totalAmountOverall)
      ) {
        toast.error(
          `${t(coupon_minimum)} ${getAmountWithSign(
            response?.data?.min_purchase
          )}`
        );
        return false;
      }

      if (response?.data?.discount_type === "percent" || isFreeDelivery) {
        dispatch(setCouponInfo(response.data));
        toast.success(t("Coupon Applied"));
        dispatch(setCouponType(response.data.coupon_type));
        setCouponDiscount({ ...response.data, zoneId });
        return true;
      }

      if (
        response?.data?.discount &&
        payableAmount >= response?.data?.discount
      ) {
        dispatch(setCouponInfo(response.data));
        toast.success(t("Coupon Applied"));
        dispatch(setCouponType(response.data.coupon_type));
        setCouponDiscount({ ...response.data, zoneId });
        return true;
      }

      toast.error(t("Your total price must be more then coupon amount"));
      return false;
    },
    [
      deliveryFee,
      deliveryTip,
      dispatch,
      payableAmount,
      setCouponDiscount,
      t,
      totalAmount,
      zoneId,
    ]
  );

  const handleApplyCouponError = useCallback(
    (error) => {
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (
        error?.code === "ERR_NETWORK" ||
        error?.code === "ERR_UNEXPECTED_PROXY_AUTH" ||
        error?.message === "Network Error" ||
        !error?.response
      ) {
        toast.error(
          t(
            "Network connection error. Please check your internet connection and try again."
          )
        );
        return;
      }

      if (status === 404) {
        toast.error(t("Coupon code not found. Please check and try again."));
      } else if (status === 400) {
        const errorMessage = data?.message?.toLowerCase() || "";

        if (
          errorMessage.includes("expired") ||
          errorMessage.includes("expire") ||
          errorMessage.includes("has expired")
        ) {
          toast.error(t("This coupon has expired."));
        } else if (
          errorMessage.includes("used") ||
          errorMessage.includes("already been used") ||
          errorMessage.includes("redeemed")
        ) {
          toast.error(t("This coupon has already been used."));
        } else if (
          errorMessage.includes("minimum") ||
          errorMessage.includes("min purchase") ||
          errorMessage.includes("minimum order")
        ) {
          toast.error(t("Minimum order amount not met for this coupon."));
        } else if (
          errorMessage.includes("invalid") ||
          errorMessage.includes("not found") ||
          errorMessage.includes("doesn't exist")
        ) {
          toast.error(t("Invalid coupon code."));
        } else if (
          errorMessage.includes("limit") ||
          errorMessage.includes("reached") ||
          errorMessage.includes("exceeded")
        ) {
          toast.error(t("Coupon usage limit has been reached."));
        } else if (
          errorMessage.includes("inactive") ||
          errorMessage.includes("disabled")
        ) {
          toast.error(t("This coupon is currently inactive."));
        } else if (
          errorMessage.includes("customer") ||
          errorMessage.includes("user")
        ) {
          toast.error(t("This coupon is not valid for your account."));
        } else {
          toast.error(
            data?.message || t("Coupon is not valid or has expired.")
          );
        }
      } else if (status === 422) {
        if (data?.errors?.code) {
          toast.error(data.errors.code[0]);
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error(t("Invalid coupon code."));
        }
      } else {
        onErrorResponse(error);
      }
    },
    [t]
  );

  const applyCouponWithCode = useCallback(
    async (rawCode) => {
      const trimmed = (rawCode ?? "").trim();
      if (!trimmed) {
        toast.error(t("Please enter a coupon code."));
        return false;
      }
      if (trimmed.length < 3) {
        toast.error(t("Coupon code must be at least 3 characters long."));
        return false;
      }
      if (!/^[A-Za-z0-9-_]+$/.test(trimmed)) {
        toast.error(
          t(
            "Invalid coupon code format. Use only letters, numbers, hyphens, and underscores."
          )
        );
        return false;
      }

      setIsApplying(true);
      try {
        const response = await CouponApi.applyCoupon(trimmed, store_id);
        return handleSuccess(response);
      } catch (error) {
        handleApplyCouponError(error);
        return false;
      } finally {
        setIsApplying(false);
      }
    },
    [handleApplyCouponError, handleSuccess, store_id, t]
  );

  const checkoutCouponContext = useMemo(
    () => ({ storeId: store_id, moduleId: module_id, zoneId }),
    [store_id, module_id, zoneId]
  );

  const { data: couponList = [], isFetching: listFetching } = useQuery(
    ["checkout-coupon-picker", store_id, module_id, zoneId],
    () => fetchCustomerCouponList(checkoutCouponContext),
    {
      enabled:
        Boolean(getToken()) &&
        Boolean(store_id) &&
        Boolean(module_id) &&
        !couponInfo,
      staleTime: 30 * 1000,
    }
  );

  const displayCoupons = useMemo(
    () => filterCouponsForCheckout(couponList, checkoutCouponContext),
    [couponList, checkoutCouponContext]
  );

  useEffect(() => {
    return () => {
      dispatch(setCouponInfo(null));
    };
  }, [dispatch]);

  const removeCoupon = () => {
    setCouponDiscount(null);
    localStorage.removeItem("coupon");
    setCouponCode(null);
    dispatch(setCouponInfo(null));
    setSwitchToWallet(false);
  };

  const handleApply = async () => {
    if (isApplying) return;
    await applyCouponWithCode(couponCode);
  };

  const handlePickCoupon = async (item) => {
    const code = item?.code?.trim();
    if (!code || isApplying) return;
    setCouponCode(code);
    const ok = await applyCouponWithCode(code);
    if (ok) {
      setBrowseExpanded(false);
    }
  };

  const canApply = Boolean((couponCode ?? "").trim()) && !isApplying;

  return (
    <>
      <Grid
        container
        justifyContent="flex-start"
        pt="20px"
        pb="10px"
        spacing={1}
      >
        {couponInfo ? (
          <Grid item xs={12} sm={12} md={12}>
            <HadCouponBox removeCoupon={removeCoupon} couponInfo={couponInfo} />
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  border: (th) =>
                    `1px solid ${
                      th.palette.mode === "dark"
                        ? alpha(th.palette.common.white, 0.12)
                        : alpha(th.palette.common.black, 0.08)
                    }`,
                  borderRadius: "10px",
                  boxShadow: (th) =>
                    th.palette.mode === "dark"
                      ? "none"
                      : `0 1px 4px ${alpha(th.palette.common.black, 0.06)}`,
                  px: { xs: 1.25, sm: 1.75 },
                  py: { xs: 0.75, sm: 0.875 },
                }}
              >
                <CouponFieldIcon />
                <InputBase
                  placeholder={t("Enter Your Coupon")}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: { xs: "14px", sm: "15px" },
                    color: "text.primary",
                    "& .MuiInputBase-input": {
                      py: 0.5,
                      border: "none",
                      outline: "none",
                    },
                    "& input::placeholder": {
                      color: (th) =>
                        th.palette.mode === "dark"
                          ? alpha(th.palette.common.white, 0.45)
                          : alpha(th.palette.common.black, 0.38),
                      opacity: 1,
                    },
                    "& .Mui-disabled": {
                      color: (th) => alpha(th.palette.text.primary, 0.6),
                    },
                  }}
                  inputProps={{
                    "aria-label": t("Enter Your Coupon"),
                  }}
                  onChange={(e) => setCouponCode(e.target.value)}
                  value={couponCode ?? ""}
                  disabled={isApplying}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canApply) {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                />
                <LoadingButton
                  loading={isApplying}
                  loadingPosition="start"
                  variant="text"
                  onClick={handleApply}
                  disabled={!canApply}
                  disableElevation
                  sx={{
                    flexShrink: 0,
                    minWidth: "auto",
                    px: 0.5,
                    py: 0.25,
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "15px" },
                    color: (th) =>
                      th.palette.mode === "dark"
                        ? th.palette.common.white
                        : th.palette.common.black,
                    textTransform: "none",
                    "&.Mui-disabled": {
                      color: (th) => alpha(th.palette.text.primary, 0.35),
                    },
                  }}
                >
                  {t("Apply")}
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() =>
                    !isApplying && setBrowseExpanded((open) => !open)
                  }
                  disabled={isApplying}
                  aria-expanded={browseExpanded}
                  sx={{
                    border: "none",
                    background: "none",
                    cursor: isApplying ? "default" : "pointer",
                    p: 0,
                    textAlign: "left",
                    color: "primary.main",
                    fontWeight: 600,
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:disabled": {
                      color: (th) => alpha(th.palette.text.primary, 0.35),
                      textDecoration: "none",
                    },
                  }}
                >
                  {t("Browse coupons")}
                  {browseExpanded ? (
                    <ChevronUp size={18} aria-hidden />
                  ) : (
                    <ChevronDown size={18} aria-hidden />
                  )}
                </Typography>

                <Collapse in={browseExpanded} timeout="auto" unmountOnExit>
                  <Card
                    role="region"
                    aria-label={t("Coupons")}
                    elevation={2}
                    sx={{
                      mt: 1,
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: (th) =>
                        `1px solid ${
                          th.palette.mode === "dark"
                            ? alpha(th.palette.common.white, 0.12)
                            : alpha(th.palette.common.black, 0.1)
                        }`,
                    }}
                  >
                    <Stack
                      sx={{
                        maxHeight: {
                          xs: "min(62vh, 420px)",
                          sm: "min(58vh, 480px)",
                        },
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          flexShrink: 0,
                          px: 2,
                          py: 1.5,
                          textAlign: "center",
                          bgcolor: (th) =>
                            th.palette.mode === "dark"
                              ? alpha(th.palette.common.white, 0.06)
                              : alpha(th.palette.primary.main, 0.08),
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          component="h3"
                          fontWeight={700}
                          sx={{ letterSpacing: 0.3 }}
                        >
                          {t("Coupons")}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          flex: "1 1 auto",
                          minHeight: 0,
                          overflowY: "auto",
                          overflowX: "hidden",
                          p: 1.25,
                          bgcolor: "background.paper",
                        }}
                      >
                        {listFetching ? (
                          <Stack alignItems="center" py={4}>
                            <CircularProgress size={32} />
                          </Stack>
                        ) : displayCoupons.length === 0 ? (
                          <Typography color="text.secondary" py={2} px={1}>
                            {t("No Coupon Found")}
                          </Typography>
                        ) : (
                          <Stack spacing={1.25}>
                            {displayCoupons.map((c) => (
                              <Coupon
                                key={c.id ?? c.code}
                                coupon={c}
                                onSelect={handlePickCoupon}
                                disabled={isApplying}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </Stack>
                  </Card>
                </Collapse>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default HaveCoupon;
