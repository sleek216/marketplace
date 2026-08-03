import {
  ChevronDown,
  Star as StarBorderSharpIcon,
  RotateCcw,
  ReceiptText,
  Navigation,
  Send,
  Truck,
  PackageCheck,
} from "lucide-react";
import moment from "moment/moment";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Paper,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { setDeliveryManInfoByDispatch } from "redux/slices/searchFilter";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import CustomFormatedDateTime from "../../date/CustomFormatedDateTime";
import TrackParcelOrderDrawer from "../../home/module-wise-components/parcel/TrackParcelOrderDrawer";
import { DateTypography, TrackOrderButton } from "../myorders.style";
import { getImageUrl } from "utils/CustomFunctions";
import { toast } from "react-hot-toast";
import useReorderOrder from "api-manage/hooks/react-query/order/useReorderOrder";
import {
  getCustomerOrderStatusLabel,
  isRefundPipelineStatus,
  REFUND_ACTIVE_STATUSES,
  REFUND_HISTORY_STATUSES,
  isWithinReturnWindow,
  shouldShowTrackOrder,
} from "utils/orderStatus";
import { REORDER_CART_REFRESH_EVENT } from "components/header/second-navbar/SecondNavbar";
import useGetOrderDetails from "api-manage/hooks/react-query/order/useGetOrderDetails";
import OtherOrder from "../order-details/other-order";
import { useStoreRefundRequest } from "api-manage/hooks/react-query/refund-request/useStoreRefundRequest";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import RefundModal from "../order-details/other-order/RefundModal";
import RateAndReview from "components/review/RateAndReview";
import ManualExpectedDeliveryInfo, {
	hasManualExpectedDelivery,
	resolveManualExpectedDeliveryItem,
} from "components/product-details/ManualExpectedDeliveryInfo";
import { getDateFormatAnotherWay } from "utils/CustomFunctions";
import { getGuestId } from "helper-functions/getToken";

const ExpandableOrderDetails = ({
  orderId,
  configData,
  reviewStatus,
  onReviewClick,
  initialTab,
}) => {
  const guestId = getGuestId() || "";
  const {
    refetch,
    data,
    isLoading: dataIsLoading,
  } = useGetOrderDetails(orderId, guestId);

  React.useEffect(() => {
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  return (
    <OtherOrder
      configData={configData}
      data={data}
      refetch={refetch}
      id={orderId}
      dataIsLoading={dataIsLoading}
      page="my-orders"
      reviewStatus={reviewStatus}
      onReviewClick={onReviewClick}
      initialTab={initialTab}
    />
  );
};

export const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.neutral[900], 0.8)
      : theme.palette.background.paper,
  borderRadius: "2px",
  border: `1px solid ${alpha(theme.palette.neutral[300], 0.35)}`,
  boxShadow: "none",
  cursor: "pointer",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "none",
  height: "auto",
  display: "block",
  "&:hover": {
    transform: "none",
    boxShadow: "none",
    borderColor: alpha(theme.palette.primary.main, 0.4),
  },
  [theme.breakpoints.up("md")]: {
    padding: "16px 18px",
  },
}));
const OrderStatusTypography = styled(Typography)(({ theme, color }) => ({
  color: color,
  fontWeight: 600,
  fontSize: "14px",
  textTransform: "capitalize",
  lineHeight: 1.35,
  [theme.breakpoints.down("md")]: {
    fontSize: "12px",
  },
}));

const getEstimatedDeliveryText = (record) => {
  const resolvedItem = resolveManualExpectedDeliveryItem(record);
  if (!resolvedItem) return null;
  const text = resolvedItem.manual_expected_delivery_text;
  if (text) return text;
  const from = resolvedItem.manual_expected_delivery_from;
  const to = resolvedItem.manual_expected_delivery_to;
  if (from && to) {
    if (from === to) return getDateFormatAnotherWay(from);
    return `${getDateFormatAnotherWay(from)} - ${getDateFormatAnotherWay(to)}`;
  }
  if (from) return getDateFormatAnotherWay(from);
  if (to) return getDateFormatAnotherWay(to);
  return null;
};

const getOrderStatusLabel = (order, t) =>
  getCustomerOrderStatusLabel(order?.order_status, t);

const formatMobileDeliveredDate = (date) => {
  if (!date) return null;
  return moment(date).format("D MMM");
};

const getMobileOrderStatusColors = (status, theme) => {
  const normalized = (status || "").toLowerCase().replace(/_/g, " ").replace(/-/g, " ").trim();
  const onBadge = theme.palette.common.white;

  if (normalized === "pending") {
    return { bg: theme.palette.info.main, color: onBadge };
  }
  if (normalized === "confirmed") {
    return {
      bg: theme.palette.footer?.inputButtonHover ?? theme.palette.primary.dark,
      color: onBadge,
    };
  }
  if (
    ["processing", "handover", "picked up", "accepted", "out for delivery"].includes(
      normalized
    )
  ) {
    return { bg: theme.palette.warning.dark, color: onBadge };
  }
  if (normalized === "arrived at city") {
    return { bg: theme.palette.info.main, color: onBadge };
  }
  if (
    [
      "delivered",
      "returned",
      "refunded",
      "refund_resolved",
      "return_received_by_vendor",
    ].includes(normalized)
  ) {
    return { bg: theme.palette.primary.main, color: onBadge };
  }
  if (normalized === "refund requested") {
    return { bg: theme.palette.info.main, color: onBadge };
  }
  if (
    ["refund request canceled", "refund request rejected"].includes(normalized)
  ) {
    return { bg: theme.palette.error.main, color: onBadge };
  }
  if (isRefundPipelineStatus(status)) {
    return { bg: theme.palette.warning.dark, color: onBadge };
  }
  if (["canceled", "cancelled", "failed"].includes(normalized)) {
    return { bg: theme.palette.error.main, color: onBadge };
  }
  return { bg: theme.palette.primary.main, color: onBadge };
};

const mobileActionButtonSx = {
  p: "2px 5px",
  fontSize: "9px",
  fontWeight: 600,
  minWidth: "unset",
  minHeight: "22px",
  height: "22px",
  lineHeight: 1.1,
  borderRadius: "5px",
  textTransform: "capitalize",
  boxShadow: "none",
  whiteSpace: "nowrap",
  flexShrink: 0,
  "& .MuiButton-startIcon": {
    marginRight: "2px",
    marginLeft: 0,
  },
  "& .MuiButton-startIcon > *:nth-of-type(1)": {
    fontSize: "9px",
  },
};

const MobileInfoBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: "4px 8px",
  borderRadius: " 8px",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: "9px",
  fontWeight: 500,
  lineHeight: 1.3,
}));

const MobileTrackBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: "5px 10px",
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  cursor: "pointer",
  flexShrink: 0,
}));

const Order = (props) => {
  const theme = useTheme();
  const {
    order,
    reviewStatus,
    t,
    configData,
    dispatch,
    index,
    onReviewClick,
    isReviewExpanded,
    onReviewSubmitted,
    isExpanded,
    onToggleDetails,
    onOpenTrackDetails,
    openTrackTab,
  } = props;

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const guestId = getGuestId();
  const { mutate: reorderMutate, isLoading: reorderIsLoading } = useReorderOrder();
  const { mutate: refundMutate, isLoading: refundIsLoading } = useStoreRefundRequest();
  const storeImage =
    order?.module_type === "parcel"
      ? "parcel_category_image_url"
      : "store_image_url";
  const router = useRouter();

  const handleClick = (e) => {
    if (order?.delivery_man) {
      dispatch(setDeliveryManInfoByDispatch(order?.delivery_man));
    }
    onToggleDetails?.(order?.id);
  };
  const handleRateButtonClick = (e) => {
    e.stopPropagation();
    if (onReviewClick) {
      onReviewClick(order?.id);
    } else {
      router.push(`/rate-and-review/${order?.id}`, undefined, {
        shallow: true,
      });
    }
  };
  const handleClickTrackOrder = (e) => {
    e.stopPropagation();
    if (order?.delivery_man) {
      e.stopPropagation();
      dispatch(setDeliveryManInfoByDispatch(order?.delivery_man));
    }
    if (order?.module_type === "parcel") {
      e.stopPropagation();
      setSideDrawerOpen(true);
    } else {
      onOpenTrackDetails?.(order?.id);
    }
  };
  const handleReorder = (e) => {
    e.stopPropagation();
    reorderMutate(
      { orderId: order?.id, guestId },
      {
        onSuccess: (response) => {
          if (response?.added > 0) {
            toast.success(t("Items added to cart"));
            if (response?.failed?.length > 0) {
              toast.error(
                t("Some items are not available now and were skipped.")
              );
            }
            window.dispatchEvent(new Event(REORDER_CART_REFRESH_EVENT));
          } else {
            toast.error(
              response?.failed?.[0]?.message ||
                t("Unable to reorder this order right now.")
            );
          }
        },
      }
    );
  };
  const handleRefundClick = (e) => {
    e.stopPropagation();
    setRefundModalOpen(true);
  };
  const orderLineItems = order?.details || order?.items || [];
  const hasOrderLevelDelivery = hasManualExpectedDelivery(order);
  const firstLineDeliveryRecord = orderLineItems.find((line) =>
    hasManualExpectedDelivery(resolveManualExpectedDeliveryItem(line))
  );
  const deliveryRecord = hasOrderLevelDelivery
    ? order
    : firstLineDeliveryRecord;
  const isDeliveredOrder = order?.order_status === "delivered";
  const returnWindowDays = configData?.return_window_days ?? 7;
  const withinReturnWindow = isWithinReturnWindow(order?.delivered, returnWindowDays);
  const showDeliveredOrderActions =
    isDeliveredOrder && order?.module_type !== "parcel";
  const showRefundAction =
    showDeliveredOrderActions &&
    configData?.refund_active_status &&
    withinReturnWindow;
  const isCompletedNonDeliveredOrder = [
    "canceled",
    "cancelled",
    "failed",
    ...REFUND_HISTORY_STATUSES,
    ...REFUND_ACTIVE_STATUSES,
    "return_received_by_vendor",
  ].includes(order?.order_status);
  const showDeliveredFooter = isDeliveredOrder && order?.delivered;
  const showEstimatedFooter =
    !isDeliveredOrder &&
    !isCompletedNonDeliveredOrder &&
    Boolean(deliveryRecord);

  const handleRefundSubmit = (values) => {
    refundMutate(
      {
        ...values,
        id: order?.id,
      },
      {
        onSuccess: (resData) => {
          toast.success(resData?.message);
          setRefundModalOpen(false);
        },
        onError: onErrorResponse,
      }
    );
  };
  const color = () => {
    if (
      order?.order_status === "pending" ||
      order?.order_status === "failed" ||
      order?.order_status === "canceled"
    ) {
      return alpha(theme.palette.error.main, 0.8);
    }
    if (
      order?.order_status === "confirmed" ||
      order?.order_status === "picked_up" ||
      order?.order_status === "delivered"
    ) {
      return theme.palette.primary.main;
    }
  };

  const statusLabel = getOrderStatusLabel(order, t);
  const mobileStatusColors = getMobileOrderStatusColors(order?.order_status, theme);
  const estimatedDeliveryText = showEstimatedFooter
    ? getEstimatedDeliveryText(deliveryRecord)
    : null;
  const deliveredDateShort =
    isDeliveredOrder && (order?.delivered || order?.created_at)
      ? formatMobileDeliveredDate(order?.delivered || order?.created_at)
      : null;
  const showMobileTrack = shouldShowTrackOrder(order?.order_status);
  const itemCount =
    order?.order_type !== "parcel" ? order?.details_count : null;

  const deliveredInformation = () => (
    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
      {order?.module_type !== "parcel" && (
        <Button
          onClick={(e) => handleReorder(e)}
          variant="contained"
          size="small"
          startIcon={<RotateCcw size={14} />}
          disabled={reorderIsLoading}
          sx={{
            p: { xs: "4px 8px", sm: "5px 10px", md: "5px 10px" },
            fontSize: { xs: "11px", sm: "11px", md: "12px" },
            minWidth: "unset",
          }}
        >
          {t(reorderIsLoading ? "Reordering..." : "Reorder Items")}
        </Button>
      )}
      {showRefundAction && (
        <Button
          onClick={(e) => handleRefundClick(e)}
          variant="outlined"
          size="small"
          startIcon={<ReceiptText size={14} />}
          sx={{
            p: { xs: "4px 8px", sm: "5px 10px", md: "5px 10px" },
            fontSize: { xs: "11px", sm: "11px", md: "12px" },
            minWidth: "unset",
          }}
        >
          {t("Refund Request")}
        </Button>
      )}
      {showDeliveredOrderActions && (
        <Button
          onClick={(e) => handleRateButtonClick(e)}
          variant="outlined"
          size="small"
          startIcon={<StarBorderSharpIcon size={14} />}
          sx={{
            p: { xs: "4px 8px", sm: "5px 10px", md: "5px 10px" },
            fontSize: { xs: "11px", sm: "11px", md: "12px" },
            minWidth: "unset",
          }}
        >
          {t("Write Review")}
        </Button>
      )}
    </Stack>
  );

  const mobileDeliveredActions = () => (
    <Stack
      direction="row"
      spacing={0.35}
      alignItems="center"
      flexWrap="nowrap"
      justifyContent="flex-end"
      sx={{ minWidth: 0 }}
    >
      {order?.module_type !== "parcel" && (
        <Button
          onClick={(e) => handleReorder(e)}
          variant="contained"
          color="primary"
          size="small"
          disabled={reorderIsLoading}
          startIcon={<RotateCcw size={9} />}
          sx={mobileActionButtonSx}
        >
          {t(reorderIsLoading ? "..." : "Reorder")}
        </Button>
      )}
      {showRefundAction && (
        <Button
          onClick={(e) => handleRefundClick(e)}
          variant="contained"
          color="warning"
          size="small"
          startIcon={<ReceiptText size={9} />}
          sx={{
            ...mobileActionButtonSx,
            "&:hover": { boxShadow: "none" },
          }}
        >
          {t("Refund")}
        </Button>
      )}
      {showDeliveredOrderActions && (
        <Button
          onClick={(e) => handleRateButtonClick(e)}
          variant="contained"
          color="success"
          size="small"
          startIcon={<StarBorderSharpIcon size={9} />}
          sx={{
            ...mobileActionButtonSx,
            "&:hover": { boxShadow: "none" },
          }}
        >
          {t("Review")}
        </Button>
      )}
    </Stack>
  );

  const notDeliveredInformation = () => (
    <>
      {shouldShowTrackOrder(order?.order_status) && (
          <TrackOrderButton
            variant="outlined"
            size="small"
            onClick={(e) => handleClickTrackOrder(e)}
            startIcon={
              <Navigation
                size={isXSmall ? 14 : 16}
                color={theme.palette.primary.main}
              />
            }
          >
            {t("Track Order")}
          </TrackOrderButton>
        )}
    </>
  );
  return (
    <CustomPaper
      id={`order-card-${order?.id}`}
      onClick={(e) => handleClick(e)}
      sx={{
        width: "100%",
        maxWidth: "none",
        ...(isXSmall
          ? {
              "&:hover": {
                transform: "none",
              },
            }
          : null),
      }}
    >
      {isXSmall ? (
        <Stack direction="row" spacing={1.25} alignItems="stretch">
          <Box
            sx={{
              width: "32%",
              maxWidth: "110px",
              flexShrink: 0,
              position: "relative",
              borderRadius: "10px",
              border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
              overflow: "hidden",
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: "2px",
            }}
          >
              {order?.module_type === "parcel" && (
                <Stack
                  sx={{
                    position: "absolute",
                    top: "4px",
                    zIndex: 2,
                    left: "4px",
                  }}
                >
                  <Chip
                    label={order?.module_type}
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: "2px",
                      textTransform: "capitalize",
                      height: "18px",
                      fontSize: "9px",
                    }}
                  />
                </Stack>
              )}
              <Box sx={{ width: "100%", height: "100%" }}>
                <CustomImageContainer
                  src={
                    order?.module_type === "parcel"
                      ? order?.parcel_category?.image_full_url
                      : order?.store?.logo_full_url
                  }
                  width="100%"
                  height="100%"
                  smWidth="100%"
                  smHeight="100%"
                  objectfit="cover"
                  borderRadius="8px"
                />
              </Box>
          </Box>

          <Stack flex={1} spacing={0.75} minWidth={0} justifyContent="center">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography
                fontWeight={700}
                fontSize="13px"
                color="text.primary"
                noWrap
                sx={{ textTransform: "uppercase" }}
              >
                #{order?.id}
              </Typography>
              <Typography fontWeight={700} fontSize="13px" color="text.primary">
                {getAmountWithSign(order?.order_amount)}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0.75}
            >
              <Chip
                label={statusLabel}
                size="small"
                sx={{
                  height: "auto",
                  maxWidth: "42%",
                  backgroundColor: mobileStatusColors.bg,
                  color: mobileStatusColors.color,
                  fontWeight: 600,
                  fontSize: "10px",
                  textTransform: "capitalize",
                  borderRadius: "6px",
                  "& .MuiChip-label": {
                    px: 1,
                    py: 0.35,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              />
              {deliveredDateShort ? (
                <MobileInfoBadge
                  title={`${t("delivered")} : ${deliveredDateShort}`}
                >
                  <PackageCheck size={12} style={{ flexShrink: 0 }} />
                  <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t("delivered")} : {deliveredDateShort}
                  </Box>
                </MobileInfoBadge>
              ) : (
                estimatedDeliveryText && (
                  <MobileInfoBadge title={estimatedDeliveryText}>
                    <Truck size={12} style={{ flexShrink: 0 }} />
                    <Box component="span">
                      {estimatedDeliveryText}
                    </Box>
                  </MobileInfoBadge>
                )
              )}
            </Stack>

            {itemCount != null && (
              <Typography
                fontSize="12px"
                fontWeight={500}
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                {t("Items")}: {itemCount}
              </Typography>
            )}

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={0.5}
              width="100%"
            >
              {isDeliveredOrder
                ? mobileDeliveredActions()
                : showMobileTrack && (
                    <MobileTrackBadge
                      onClick={(e) => handleClickTrackOrder(e)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleClickTrackOrder(e);
                        }
                      }}
                    >
                      <Send size={12} />
                      {t("Track")}
                    </MobileTrackBadge>
                  )}
              <ChevronDown
                size={18}
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  opacity: 0.75,
                  flexShrink: 0,
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          width="100%"
          sx={{ minWidth: 0 }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: "2px",
              border: `1px solid ${alpha(theme.palette.neutral[400], 0.25)}`,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.neutral[200], 0.35),
              p: 0.5,
            }}
          >
            {order?.module_type === "parcel" && (
              <Chip
                label={order?.module_type}
                color="primary"
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  zIndex: 2,
                  borderRadius: "2px",
                  textTransform: "capitalize",
                  height: 18,
                  fontSize: "9px",
                }}
              />
            )}
            <CustomImageContainer
              src={
                order?.module_type === "parcel"
                  ? order?.parcel_category?.image_full_url
                  : order?.store?.logo_full_url
              }
              width="100%"
              height="100%"
              smWidth="100%"
              smHeight="100%"
              objectfit="cover"
              borderRadius="2px"
            />
          </Box>

          <Stack
            flex={1}
            spacing={0.35}
            justifyContent="center"
            minWidth={0}
          >
            <Typography
              fontWeight={600}
              fontSize={{ xs: "13px", md: "14px" }}
              noWrap
            >
              {t("Order")}
              <Typography
                fontWeight={600}
                component="span"
                marginLeft="5px"
                fontSize={{ xs: "13px", md: "14px" }}
              >
                #{order?.id}
              </Typography>
              {order?.order_type !== "parcel" && (
                <Typography
                  component="span"
                  marginLeft="5px"
                  fontSize="12px"
                  color="text.secondary"
                >
                  ({order?.details_count} {t("Items")})
                </Typography>
              )}
            </Typography>
            <OrderStatusTypography color={color}>
              {order?.order_status === "delivered"
                ? t("Delivered")
                : order?.order_status === "failed"
                  ? t("Payment Failed")
                  : getCustomerOrderStatusLabel(order?.order_status, t)}
            </OrderStatusTypography>
            <DateTypography>
              {order?.order_status === "delivered" ? (
                <CustomFormatedDateTime date={order?.delivered} />
              ) : (
                <CustomFormatedDateTime date={order?.created_at} />
              )}
            </DateTypography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            flexShrink={0}
          >
            <Typography
              fontSize="15px"
              fontWeight={700}
              color="text.primary"
              sx={{ whiteSpace: "nowrap" }}
            >
              {getAmountWithSign(order?.order_amount)}
            </Typography>
            {order?.order_status === "delivered"
              ? deliveredInformation()
              : notDeliveredInformation()}
            <ChevronDown
              size={18}
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                opacity: 0.75,
                flexShrink: 0,
              }}
            />
          </Stack>
        </Stack>
      )}
      {!isXSmall && (showDeliveredFooter || showEstimatedFooter) && (
        <Box mt={1} onClick={(e) => e.stopPropagation()}>
          <ManualExpectedDeliveryInfo
            record={showEstimatedFooter ? deliveryRecord : undefined}
            deliveredDate={showDeliveredFooter ? order?.delivered : undefined}
            variant="footer"
          />
        </Box>
      )}
      <Collapse in={Boolean(isReviewExpanded)} timeout="auto" unmountOnExit>
        <Stack
          mt={1}
          pt={1}
          px={{ xs: 0.25, md: 0.5 }}
          sx={{
            borderTop: (theme) =>
              `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <RateAndReview
            key={`review-${order?.id}`}
            orderId={order?.id}
            embedded
            layout="split"
            orderMeta={{
              delivered: order?.delivered,
              storeName: order?.store?.name,
              storeZone:
                order?.store?.zone?.name ||
                order?.store?.address ||
                order?.store?.zone_name,
            }}
            onReviewSubmitted={onReviewSubmitted}
          />
        </Stack>
      </Collapse>
      <Collapse in={Boolean(isExpanded)} timeout="auto" unmountOnExit>
        <Stack
          mt={1.5}
          pt={1.5}
          sx={{ borderTop: (theme) => `1px solid ${alpha(theme.palette.neutral[400], 0.2)}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <ExpandableOrderDetails
            orderId={order?.id}
            configData={configData}
            reviewStatus={reviewStatus}
            onReviewClick={onReviewClick}
            initialTab={openTrackTab ? "track-order" : undefined}
          />
        </Stack>
      </Collapse>
      {sideDrawerOpen && (
        <TrackParcelOrderDrawer
          orderId={order?.id}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          closeHandler={() => setSideDrawerOpen(false)}
        />
      )}
      <RefundModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        formSubmit={handleRefundSubmit}
        refundIsLoading={refundIsLoading}
      />
    </CustomPaper>
  );
};
Order.propTypes = {};

export default Order;
