import { X as CloseIcon, Hash, Calendar } from "lucide-react";
import {
  Button,
  IconButton,
  Skeleton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetOrderCancelReason";
import { hasChatAndReview } from "components/my-orders/order-details/other-order/StoreDetails";
import {
  getCustomerOrderStatusLabel,
  isCancelledOrderStatus,
  isRefundPipelineStatus,
} from "utils/orderStatus";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOfflinePaymentInfo,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import usePostOrderCancel from "../../../api-manage/hooks/react-query/order/usePostOrderCancel";
import CustomModal from "../../modal";
import TrackSvg from "../assets/TrackSvg";
import { OrderStatusButton } from "../myorders.style";
import CancelOrder from "./CenacelOrder";
import DigitalPaymentManage from "./DigitalPaymentManage";
import OfflineOrderDetailsModal from "./offline-order/OfflineOrderDetailsModal";
import PaymentUpdate from "./other-order/PaymentUpdate";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import usePostParcelReturn from "api-manage/hooks/react-query/order/usePostParcelReturn";
import LoadingButton from "@mui/lab/LoadingButton";
import AddPaymentMethod from "components/checkout/item-checkout/AddPaymentMethod";
import PaymentMethod from "components/checkout/PaymentMethod";
import useGetOfflinePaymentOptions from "api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import { getDigitalMethodFromZone, handleFailedOrderPlace } from "utils/CustomFunctions";
import { useUpdatePaymentMethod } from "api-manage/hooks/react-query/payment-method/useUpdatePaymentMethod";
import { useUpdatePaymentByWallet } from "api-manage/hooks/react-query/useUpdatePaymentByWallet";
import { baseUrl } from "api-manage/MainApi";
import { useRouter } from "next/router";
import { REORDER_CART_REFRESH_EVENT } from "components/header/second-navbar/SecondNavbar";
import { useGetFailedPayment } from "api-manage/hooks/react-query/useGetFailedPayment";
import useReorderOrder from "api-manage/hooks/react-query/order/useReorderOrder";
import { getGuestId, getToken } from "helper-functions/getToken";

const TopDetails = (props) => {
  const {
    data,
    trackData,
    trackDataIsLoading,
    trackDataIsFetching,
    currentTab,
    configData,
    id,
    openModal,
    setOpenModal,
    refetchOrderDetails,
    refetchTrackData,
    dataIsLoading,
    page,
    openPaymentMethod,
    setOpenPaymentMethod,
    paymentMethodUpdateMutation,
    paymentFailedData,
    setPaymentFailedData,
    reviewStatus,
    onReviewClick,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter()
  const { orderDetailsModal, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [cancelOpenModal, setCancelOpenModal] = useState(false);
  const [openModalForPayment, setModalOpenForPayment] = useState();
  const [cancelReason, setCancelReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [returnFareOpenModal, setReturnFareOpenModal] = useState(false);
  const [openModalOffline, setOpenModelOffline] = useState(orderDetailsModal);
  const [parcelReceiveModal, setParcelReceiveModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const { mutate: postParcelReturnMutation, isLoading: postParcelReturnLoading } = usePostParcelReturn();
  const { mutate: reorderMutate, isLoading: reorderIsLoading } = useReorderOrder();

  const handlePostParcelReturn = () => {
    const formData = {
      guest_id: getGuestId(),
      order_id: id,
      order_status: "returned",
      return_otp: trackData?.parcel_cancellation?.return_otp,
    };
    postParcelReturnMutation(formData, {
      onSuccess: (res) => {
        toast.success(res?.message);
        setParcelReceiveModal(false);
        refetchOrderDetails();
        refetchTrackData();
      },
      onError: onErrorResponse,
    });
  };

  const buttonBackgroundColor = () => {
    const status = (trackData?.order_status || "").toLowerCase().replace(/_/g, " ").replace(/-/g, " ").trim();
    if (status === "pending") {
      return theme.palette.info.main;
    }
    if (status === "confirmed") {
      return theme.palette.footer.inputButtonHover;
    }
    if (
      status === "processing" ||
      status === "handover" ||
      status === "picked up" ||
      status === "accepted"
    ) {
      return theme.palette.warning.dark;
    }
    if (status === "arrived at city") {
      return theme.palette.info.main;
    }
    if (status === "out for delivery") {
      return theme.palette.success.main;
    }
    if (status === "delivered") {
      return theme.palette.primary.main;
    }
    if (status === "canceled" || status === "cancelled") {
      return theme.palette.error.main;
    }
    if (status === "refund requested") {
      return theme.palette.info.main;
    }
    if (
      status === "refund request canceled" ||
      status === "refund request rejected"
    ) {
      return theme.palette.error.main;
    }
    if (isRefundPipelineStatus(trackData?.order_status)) {
      return theme.palette.warning.dark;
    }
    if (status === "refunded" || status === "refund resolved") {
      return theme.palette.primary.main;
    }
    if (status === "failed") {
      return theme.palette.error.main;
    }
    if (status === "returned") {
      return theme.palette.primary.main;
    }
    return theme.palette.primary.main;
  };

  const currentLatLng = JSON.parse(
    window.localStorage.getItem("currentLatLng")
  );
  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );


  const { data: cancelReasonsData, refetch } = useGetOrderCancelReason(trackData?.module_type, trackData?.order_status);
  useEffect(() => {
    refetch().then();
  }, [trackData?.order_status]);

  const { mutate: orderCancelMutation, isLoading: orderLoading } =
    usePostOrderCancel();
  const handleOnSuccess = () => {
    const handleSuccess = (response) => {
      refetchOrderDetails();
      refetchTrackData();
      setCancelOpenModal(false);
      setReturnFareOpenModal(false)
      dispatch(setOrderDetailsModal(false));
      toast.success(response.message);
    };
    const formData = {
      guest_id: getGuestId(),
      order_id: id,
      reason: cancelReason,
      note: additionalInfo,
      _method: "put",
    };
    orderCancelMutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });

  };

  const today = moment(new Date());
  const differenceInMinutes = () => {
    const deliveryTime = trackData?.store?.delivery_time;
    const createdAt = trackData?.created_at;
    const processingTime = trackData?.processing_time;
    const scheduleAt = trackData?.schedule_at;
    let minTime = processingTime != null ? processingTime : 0;
    if (
      deliveryTime !== null &&
      deliveryTime !== "" &&
      processingTime === null
    ) {
      const timeArr = deliveryTime?.split("-");
      minTime = Number.parseInt(timeArr[0]);
    }
    const newDeliveryTime = scheduleAt ? scheduleAt : createdAt;
    const newDeliveryTimeWithAdditionalMin = moment(newDeliveryTime)
      .add(minTime, "minutes")
      .format();
    const duration = moment.duration(
      today.diff(newDeliveryTimeWithAdditionalMin)
    );
    const minutes = duration?.asMinutes();
    //here minutes give negative values for positive changes, that's why the condition given below
    if (minutes <= -1) {
      return Number.parseInt(Math.abs(minutes));
    }
  };
  const handleTime = () => {
    if (trackData?.processing_time != null && trackData?.processing_time !== "") {
      return trackData.processing_time;
    }
    if (trackData?.store?.processing_time != null && trackData?.store?.processing_time !== "") {
      return trackData.store.processing_time;
    }
    if (differenceInMinutes() > 5) {
      return `${differenceInMinutes() - 5} - ${differenceInMinutes()} `;
    } else {
      return `1-5`;
    }
  };

  const handleOfflineClose = () => {
    dispatch(clearOfflinePaymentInfo());
    dispatch(setOrderDetailsModal(false));
    setOpenModelOffline(false);
  };

  useEffect(() => {
    if (isCancelledOrderStatus(trackData?.order_status)) {
      dispatch(setOrderDetailsModal(false));
    }
  }, [trackData?.order_status, dispatch]);

  const shouldShowOfflinePaymentModal =
    orderDetailsModal &&
    !trackDataIsLoading &&
    Boolean(trackData?.order_status) &&
    !isCancelledOrderStatus(trackData?.order_status);
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const getReturnFee = () => {
    const totalFee = trackData?.order_amount - trackData?.dm_tips;
    const returnFeePercent = Number(configData?.parcel_cancellation_basic_setup?.return_fee || 0);
    return (totalFee * returnFeePercent) / 100;
  };
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);
  const isZoneDigital = getDigitalMethodFromZone(
    trackData?.module_type !== "parcel" ? trackData?.store?.zone_id : trackData?.zone_id,
    zoneData?.data
  );

  const { mutate: walletPaymentMutation } = useUpdatePaymentByWallet()

  const handlePayment = (mutation) => {
    const handleSuccess = (response) => {
      toast.success(response.message);
      refetchOrderDetails();
      refetchTrackData();
      setOpenPaymentMethod(false);
    };

    const formData = {
      order_id: id,
      _method: paymentMethod === "wallet" ? "POST" : "PUT",
    };

    mutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };

  const failedOrderPlace = () => {
    handleFailedOrderPlace({
      paymentMethod,
      paymentFailedData,
      handlePayment,
      paymentMethodUpdateMutation,
      walletPaymentMutation,
      profileInfo,
      orderId: trackData?.id,
      baseUrl,
      router,
    });

  }
  const handleReorder = () => {
    reorderMutate(
      { orderId: id, guestId: getGuestId() },
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
  return (
    // <HeadingBox>
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      padding={{
        xs: "0px 0px 8px 0px",
        sm: "16px 16px 12px 16px",
        md: "16px 16px 12px 16px",
      }}
      rowGap="10px"
      flexWrap="wrap"
    >
      <Stack spacing={{ xs: 1, md: 1.25 }} flexWrap="wrap">
        {dataIsLoading ? (
          <Skeleton variant="text" width="150px" />
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "2px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <Hash size={16} strokeWidth={2.2} />
              </Box>
              <Typography
                fontSize={{ xs: "13px", md: "15px" }}
                fontWeight={600}
                color={theme.palette.neutral[1000]}
              >
                {t("Order")}
                <Typography
                  component="span"
                  fontSize={{ xs: "13px", md: "15px" }}
                  fontWeight={700}
                  marginLeft="6px"
                  color={theme.palette.primary.main}
                >
                  #{data?.[0]?.order_id ? data?.[0]?.order_id : data?.id}
                </Typography>
              </Typography>
            </Stack>
            <Typography
              component="span"
              fontSize="11px"
              sx={{
                textTransform: "capitalize",
                padding: "4px 10px",
                borderRadius: "2px",
                backgroundColor:
                  trackData?.order_status === "failed"
                    ? theme.palette.error.main
                    : buttonBackgroundColor(),
                color: theme.palette.whiteContainer.main,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {trackData?.order_status === "failed"
                ? t("Payment Failed")
                : getCustomerOrderStatusLabel(trackData?.order_status, t)}
            </Typography>
            {trackData?.order_type && (
              <Typography
                component="span"
                fontSize="11px"
                sx={{
                  textTransform: "capitalize",
                  padding: "4px 10px",
                  borderRadius: "2px",
                  backgroundColor: alpha(theme.palette.neutral[500], 0.14),
                  color: theme.palette.neutral[700],
                  fontWeight: 600,
                }}
              >
                {t(
                  capitalizeText(
                    trackData?.order_type === "delivery"
                      ? "home delivery"
                      : trackData?.order_type
                  )
                )}
              </Typography>
            )}
          </Stack>
        )}

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 28,
              height: 28,
              borderRadius: "2px",
              backgroundColor: alpha(theme.palette.neutral[500], 0.1),
              color: theme.palette.neutral[600],
            }}
          >
            <Calendar size={14} />
          </Box>
          <Typography
            fontSize={{ xs: "12px", md: "13px" }}
            fontWeight={500}
            color={theme.palette.neutral[600]}
          >
            {t("Order date:")}
            <Typography
              component="span"
              fontSize={{ xs: "12px", md: "13px" }}
              fontWeight={500}
              marginLeft="5px"
              color={theme.palette.neutral[600]}
            >
              {moment(trackData?.created_at)?.format("DD MMM, YYYY")}
            </Typography>
          </Typography>

          {trackData?.module_type === "food" &&
            ["pending", "confirmed", "processing", "accepted"].includes(
              trackData?.order_status?.toLowerCase()
            ) && (
              <Stack
                direction="row"
                borderLeft={!isSmall && `2px solid ${theme.palette.neutral[400]}`}
                paddingLeft={!isSmall && "1rem"}
                alignItems="center"
                spacing={1}
              >
                {" "}
                <TrackSvg />
                <Typography
                  color={theme.palette.primary.main}
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                >
                  {t("Processing time:")}{" "}
                  <Typography
                    fontSize={{ xs: "10px", md: "12px" }}
                    fontWeight="500"
                    component="span"
                  >
                    {handleTime()}
                  </Typography>
                  <Typography
                    color="primary"
                    fontSize={{ xs: "10px", md: "12px" }}
                    fontWeight="500"
                  >
                    {t("min")}
                  </Typography>
                </Typography>
              </Stack>
            )}
        </Stack>
        {configData?.order_delivery_verification ? (
          <Typography
            fontSize={{ xs: "10px", md: "14px" }}
            fontWeight="600"
            color={theme.palette.primary.main}
          >
            <Typography
              fontSize={{ xs: "10px", md: "14px" }}
              fontWeight="600"
              color={theme.palette.neutral[500]}
              component="span"
            >
              {t("Order OTP")}:{" "}
            </Typography>
            {trackData?.otp}
          </Typography>
        ) : null}
      </Stack>

      {trackData?.order_status === "refund_request_canceled" &&
        (trackData?.refund_cancellation_note || trackData?.refund?.admin_note) && (
          <Stack>
            <OrderStatusButton
              background={alpha(theme.palette.error.light, 0.3)}
              onClick={() => setOpenModal(true)}
            >
              {trackData?.refund_cancellation_note || trackData?.refund?.admin_note}
            </OrderStatusButton>
          </Stack>
        )}

      {data &&
        !data?.[0]?.item_campaign_id &&
        trackData &&
        (trackData?.order_status === "delivered" ||
          trackData?.order_status === "returned") &&
        getToken() &&
        data?.length > 0 &&
        trackData?.module_type !== "parcel" && null}
      {trackData &&
        trackData?.payment_method === "digital_payment" &&
        trackData?.payment_status === "unpaid" &&
        zoneData?.data?.zone_data?.[0]?.cash_on_delivery ? (
        null
      ) : (
        <>
          {trackData && trackData?.order_status === "failed" && !getToken() ? (
            <OrderStatusButton
              background={theme.palette.error.deepLight}
              onClick={() => setCancelOpenModal(true)}
            >
              {t("Cancel Order")}
            </OrderStatusButton>
          ) : (
            <>
              {trackData?.module_type === "parcel" &&
                (trackData.order_status === "canceled" || trackData.order_status === "failed") ? (
                <>
                  {trackData?.order_status === "canceled" &&
                    trackData?.charge_payer === "sender" &&
                    trackData?.parcel_cancellation?.before_pickup === 0 ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={4}
                      padding="10px 10px"
                      backgroundColor={theme.palette.neutral[300]}
                      borderRadius="10px"
                    >
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Typography>{t("Parcel Returned OTP")}</Typography>
                        <Typography fontSize="20px" fontWeight="700">
                          {trackData?.parcel_cancellation?.return_otp}
                        </Typography>
                      </Stack>
                      <Button
                        sx={{ padding: "8px 10px", fontSize: "12px" }}
                        variant="contained"
                        onClick={() => setParcelReceiveModal(true)}
                      >
                        {"Parcel Received"}
                      </Button>
                    </Stack>
                  ) : (
                    <>
                      {configData?.parcel_cancellation_status === 1 &&
                        trackData?.order_status !== "canceled" &&
                        trackData?.order_status !== "delivered" && (
                          <OrderStatusButton
                            background={theme.palette.error.deepLight}
                            onClick={() => setCancelOpenModal(true)}
                          >
                            {t("Cancel Order")}
                          </OrderStatusButton>
                        )}
                    </>
                  )}
                </>
              ) : (
                (trackData?.module_type === "parcel"
                  ? ["pending", "confirmed", "picked_up"].includes(
                    trackData?.order_status
                  )
                  : (trackData?.order_status === "pending" || trackData?.order_status === "failed")) && (
                  <OrderStatusButton
                    background={theme.palette.error.deepLight}
                    onClick={() => setCancelOpenModal(true)}
                  >
                    {t("Cancel Order")}
                  </OrderStatusButton>
                )
              )}
            </>
          )}
        </>
      )}
      <CustomModal
        openModal={shouldShowOfflinePaymentModal}
        handleClose={() => handleOfflineClose()}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "relative" }}
        >
          <IconButton
            onClick={() => handleOfflineClose()}
            sx={{
              zIndex: "99",
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.neutral[100],
              borderRadius: "50%",
              [theme.breakpoints.down("md")]: {
                top: 10,
                right: 5,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "24px", fontWeight: "500" }} />
          </IconButton>
        </CustomStackFullWidth>
        <OfflineOrderDetailsModal
          trackData={trackData}
          trackDataIsLoading={trackDataIsLoading}
          trackDataIsFetching={trackDataIsFetching}
          handleOfflineClose={handleOfflineClose}
          page={page}
          setOpenPaymentMethod={setOpenPaymentMethod}
          setPaymentFailedData={setPaymentFailedData}
          refetchTrackData={refetchTrackData}
        />
      </CustomModal>

      <CustomModal
        openModal={cancelOpenModal}
        setModalOpen={setCancelOpenModal}
        handleClose={() => setCancelOpenModal(false)}
      >
        <CancelOrder
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          cancelReasonsData={cancelReasonsData}
          setModalOpen={setCancelOpenModal}
          handleOnSuccess={handleOnSuccess}
          orderLoading={orderLoading}
          additionalInfo={additionalInfo}
          setAdditionalInfo={setAdditionalInfo}
          isParcel={trackData?.module_type === "parcel"}
          orderStatus={trackData?.order_status}
          setReturnFareOpenModal={setReturnFareOpenModal}
          configData={configData}
          loading={orderLoading}
        />
      </CustomModal>

      <CustomModal
        openModal={openModalForPayment}
        setModalOpen={setModalOpenForPayment}
        handleClose={() => setModalOpenForPayment(false)}
      >
        <DigitalPaymentManage
          setModalOpenForPayment={setModalOpenForPayment}
          setModalOpen={setOpenModal}
          refetchOrderDetails={refetchOrderDetails}
          refetchTrackData={refetchTrackData}
          id={trackData?.id}
        />
      </CustomModal>
      <CustomModal
        openModal={returnFareOpenModal}
        setModalOpen={setReturnFareOpenModal}
        handleClose={() => setReturnFareOpenModal(false)}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={4}
          maxWidth="400px"
          width="100%"
          backgroundColor={theme.palette.neutral[100]}
        >
          {trackData?.charge_payer === "sender" ? (
            <>
              <Typography fontSize="12px" align="center">
                {t(
                  "If you cancel, your parcel will be back to you when rider will be available. You will have to pay a return fee to your delivery man."
                )}
              </Typography>
              <Stack alignItems="center">
                <Typography fontSize="32px" fontWeight={"bold"}>
                  {getAmountWithSign(getReturnFee())}
                </Typography>
                <Typography fontSize="12px">{t("Return Fare")}</Typography>
              </Stack>
              <Button
                loading={orderLoading}
                variant="contained"
                onClick={handleOnSuccess}
              >
                {t("Yes,Cancel")}
              </Button>
              <Typography
                onClick={() => setReturnFareOpenModal(false)}
                fontWeight="600"
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#000",
                }}
                variant="body2"
              >
                {t("Continue Delivery")}
              </Typography>
            </>
          ) : (
            <>
              <Typography fontSize="12px" align="center">
                {t(
                  "If you cancel, your parcel will be back to you when rider will be available. You will have to pay a return fee to your delivery man."
                )}
              </Typography>
              <Stack alignItems="center">
                <Typography fontSize="32px" fontWeight={"bold"}>
                  {getAmountWithSign(
                    Number(getReturnFee()) + Number(data?.order_amount)
                  )}
                </Typography>
                <Typography fontSize="12px">
                  {t("Parcel Delivery Charge + Return Fare")}
                </Typography>
              </Stack>
              <LoadingButton
                loading={orderLoading}
                variant="contained"
                onClick={handleOnSuccess}
              >
                {t("Yes,Cancel")}
              </LoadingButton>
              <Typography
                onClick={() => setReturnFareOpenModal(false)}
                fontWeight="600"
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#000",
                }}
                variant="body2"
              >
                {t("Continue Delivery")}
              </Typography>
            </>
          )}
        </Stack>
      </CustomModal>
      <CustomModal
        openModal={parcelReceiveModal}
        setModalOpen={setParcelReceiveModal}
        handleClose={() => setParcelReceiveModal(false)}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={4}
          maxWidth="400px"
          width="100%"
          backgroundColor={theme.palette.neutral[100]}
        >
          <InfoIcon
            sx={{
              fontSize: "3rem",
            }}
            color="error"
          />
          <Typography fontSize="1rem" fontWeight="700">
            {t("Have you received your parcel?")}
          </Typography>
          <Typography align="center">
            {t(
              "Please confirm only if the parcel has arrived and everything is in order"
            )}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handlePostParcelReturn}>
              {t("Yes,Received")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setParcelReceiveModal(false)}
            >
              {t("No,Cancel")}
            </Button>
          </Stack>
        </Stack>
      </CustomModal>
      <CustomModal
        openModal={openReviewModal}
        handleClose={() => setOpenReviewModal(false)}
      >

      </CustomModal>
      <CustomModal
        openModal={openPaymentMethod}
        handleClose={() => setOpenPaymentMethod(false)}
      >
        <PaymentMethod
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          zoneData={zoneData}
          configData={configData}
          orderType={trackData?.order_type}
          usePartialPayment={false}
          setOpenModel={setOpenPaymentMethod}
          forprescription={trackData?.prescription_order}
          offlinePaymentOptions={offlinePaymentOptions}
          paymentMethodImage={null}
          setPaymentMethodImage={null}
          setSwitchToWallet={null}
          isZoneDigital={isZoneDigital}
          handlePartialPayment={() => setPaymentMethod("wallet")}
          walletBalance={profileInfo?.wallet_balance}
          removePartialPayment={null}
          switchToWallet={null}
          customerData={{ data: profileInfo }}
          failed
          payableAmount={trackData?.order_amount}
          failedOrderPlace={failedOrderPlace}
        />
      </CustomModal>
    </CustomStackFullWidth>
    // </HeadingBox>
  );
};

export default TopDetails;
