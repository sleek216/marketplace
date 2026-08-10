import { useTheme } from "@emotion/react";
import { Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useGetTrackOrderData from "../../../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { useStoreRefundRequest } from "api-manage/hooks/react-query/refund-request/useStoreRefundRequest";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomDivider from "../../../CustomDivider";
import NoDeliveryManImage from "../../../NoDeliveryManImage";
import TrackParcelOrderDrawer from "../../../home/module-wise-components/parcel/TrackParcelOrderDrawer";
import TrackOrder from "../../../track-order";
import ProfileTab from "../../../user-information/ProfileTab";
import TopDetails from "../TopDetails";
import {
  orderDetailsMenuData,
  orderDetailsMenuDataForParcel,
  orderDetailsMenuDataTakeAway,
} from "../orderDetailsMenuData";
import DeliveryManInfo from "./DeliveryManInfo";
import OrderSummery from "./OrderSummery";
import RefundModal from "./RefundModal";
import StoreDetails from "./StoreDetails";
import { useSelector } from "react-redux";
import { getGuestId } from "helper-functions/getToken";
import { getOrderDetailsModuleType } from "helper-functions/orderDetails";
import { useUpdatePaymentMethod } from "api-manage/hooks/react-query/payment-method/useUpdatePaymentMethod";
import { useGetFailedPayment } from "api-manage/hooks/react-query/useGetFailedPayment";
import { cod_exceeds_message } from "utils/toasterMessages";
import { shouldPollTrackOrder } from "utils/orderTracking";

import DeliveryAttemptsCard from "./DeliveryAttemptsCard";

const OtherOrder = (props) => {
  const {
    configData,
    data,
    refetch,
    id,
    dataIsLoading,
    page,
    reviewStatus,
    onReviewClick,
    initialTab,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(orderDetailsMenuData[0]?.name);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const router = useRouter();
  const { tab } = router.query;
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const guestId = getGuestId();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const phone = guestUserInfo?.contact_person_number;
  const [paymentFailedData, setPaymentFailedData] = useState(null);
  const { mutate: paymentMethodUpdateMutation, isLoading: repayOrderLoading } =
    useUpdatePaymentMethod();
  const {
    refetch: refetchTrackOrder,
    data: trackOrderData,
    isLoading: trackDataIsLoading,
    isFetching: trackDataIsFetching,
  } = useGetTrackOrderData(id, phone, guestId);
  const orderModuleType = getOrderDetailsModuleType(data, trackOrderData);
  const { refetch: refetchFailedPayment, data: failPayment } = useGetFailedPayment(
    trackOrderData?.id,
    (res) => {
      if (res) {
        setPaymentFailedData?.(res);
      }
    }
  );
  useEffect(() => {
    if (trackOrderData?.id) {
      refetchFailedPayment();
    }
  }, [trackOrderData?.id]);
  useEffect(() => {
    refetchTrackOrder();
  }, []);

  useEffect(() => {
    if (currentTab !== "track-order" || !id) return;
    refetchTrackOrder();
  }, [currentTab, id, refetchTrackOrder]);

  useEffect(() => {
    if (currentTab !== "track-order") return;
    if (!shouldPollTrackOrder(trackOrderData?.order_status)) return;

    const interval = setInterval(() => {
      refetchTrackOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentTab, trackOrderData?.order_status, refetchTrackOrder]);

  const { mutate, isLoading: refundIsLoading } = useStoreRefundRequest();
  const formSubmitHandler = (values) => {
    const tempValue = { ...values, id };
    const onSuccessHandler = async (resData) => {
      if (resData) {
        await refetchTrackOrder();
        toast.success(resData.message);
        setOpenModal(false);
      }

      // router.push('/')
    };
    mutate(tempValue, {
      onSuccess: onSuccessHandler,
      onError: onErrorResponse,
    });
  };
  const handleTab = (item) => {
    if (item.name === "track-order") {
      if (trackOrderData?.module_type === "parcel") {
        setSideDrawerOpen(true);
      } else {
        setCurrentTab(item?.name);
      }
    } else {
      setCurrentTab(item?.name);
    }
  };
  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);
  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);
  const handlePayment = () => {
    const handleSuccess = (response) => {
      toast.success(response.message);
      refetchTrackOrder();
      refetch();
      //setOpenPaymentMethod(false);
    };

    const formData = {
      order_id: trackOrderData?.id,
      _method: "put",
    };
    if (paymentFailedData?.maximum_cod_order_amount > trackOrderData?.order_amount) {
      paymentMethodUpdateMutation(formData, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    } else {
      toast.error(cod_exceeds_message);
    }
  };
  const activeTabPanel = () => {
    switch (currentTab) {
      case "order-summary":
        return (
          <OrderSummery
            trackOrderData={trackOrderData}
            refetchTrackOrder={refetchTrackOrder}
            configData={configData}
            t={t}
            data={data}
            isLoading={trackDataIsLoading}
            dataIsLoading={dataIsLoading}
            openPaymentMethod={openPaymentMethod}
            setOpenPaymentMethod={setOpenPaymentMethod}
            handlePayment={handlePayment}
            repayOrderLoading={repayOrderLoading}
          />
        );
        break;
      case "seller-info":
        return (
          <>
            {data && orderModuleType !== "parcel" && (
              <StoreDetails
                storeData={trackOrderData?.store}
                configData={configData}
                t={t}
              />
            )}
          </>
        );
        break;
      case "delivery-man-info":
        return (
          <>
            {trackOrderData?.delivery_man ? (
              <DeliveryManInfo
                deliveryManData={trackOrderData?.delivery_man}
                configData={configData}
                storeData={trackOrderData?.store}
                t={t}
              />
            ) : (
              <CustomStackFullWidth
                minHeight="20vh"
                justifyContent="center"
                alignItems="center"
              >
                <NoDeliveryManImage />
                <Typography>{t("No delivery man assigned")} </Typography>
              </CustomStackFullWidth>
            )}
          </>
        );
        break;
      case "track-order":
        return (
          <TrackOrder
            trackOrderData={trackOrderData}
            configData={configData}
            t={t}
          />
        );
        break;
      case "delivery-attempts":
        return (
          <DeliveryAttemptsCard orderData={trackOrderData || data} />
        );
        break;
      default:
        break;
    }
  };

  const deliveryAttemptsCount =
    trackOrderData?.delivery_attempt_count ??
    trackOrderData?.delivery_progress?.current_attempt ??
    trackOrderData?.delivery_progress?.attempt_history?.length ??
    0;
  const maxAttempts = trackOrderData?.delivery_progress?.max_attempts || 3;
  const returnAttemptsCount =
    trackOrderData?.customer_return_attempt_count ??
    trackOrderData?.return_progress?.customer_attempt_count ??
    trackOrderData?.return_progress?.attempt_history?.length ??
    0;
  const hasAttempts = deliveryAttemptsCount > 0 || returnAttemptsCount > 0;

  const baseMenuData =
    data && orderModuleType === "parcel"
      ? orderDetailsMenuDataForParcel
      : trackOrderData?.order_type === "take_away"
        ? orderDetailsMenuDataTakeAway
        : orderDetailsMenuData;

  const getDynamicMenuData = () => {
    if (!hasAttempts) return baseMenuData;
    return [
      ...baseMenuData,
      {
        id: 15,
        name: "delivery-attempts",
        displayName: t("Delivery Attempts"),
      },
    ];
  };

  return (
    <CustomStackFullWidth alignItems="stretch" justifyContent="flex-start" mb={1}>
      {isSmall ? (
        <CustomPaperBigCard
          padding="14px"
          sx={{ borderRadius: "2px", boxShadow: "none" }}
        >
          <TopDetails
            data={data}
            trackData={trackOrderData}
            trackDataIsLoading={trackDataIsLoading}
            trackDataIsFetching={trackDataIsFetching}
            currentTab={currentTab}
            configData={configData}
            id={id}
            openModal={openModal}
            setOpenModal={setOpenModal}
            refetchOrderDetails={refetch}
            refetchTrackData={refetchTrackOrder}
            dataIsLoading={dataIsLoading}
            openPaymentMethod={openPaymentMethod}
            setOpenPaymentMethod={setOpenPaymentMethod}
            page={page}
            paymentMethodUpdateMutation={paymentMethodUpdateMutation}
            paymentFailedData={paymentFailedData}
            setPaymentFailedData={setPaymentFailedData}
            reviewStatus={reviewStatus}
            onReviewClick={onReviewClick}
          />
          <CustomDivider border="1px" />
          {trackDataIsLoading ? null : (
            <ProfileTab
              menuData={getDynamicMenuData()}
              marginright="20px"
              fontSize="11px"
              padding="8px 8px 8px 12px"
              borderRadius="2px"
              page={currentTab}
              handlePage={handleTab}
              isMobileTab={true}
            />
          )}
          {trackOrderData && activeTabPanel()}
        </CustomPaperBigCard>
      ) : (
        <>
          <TopDetails
            data={data}
            trackData={trackOrderData}
            trackDataIsLoading={trackDataIsLoading}
            trackDataIsFetching={trackDataIsFetching}
            currentTab={currentTab}
            configData={configData}
            id={id}
            openModal={openModal}
            setOpenModal={setOpenModal}
            refetchOrderDetails={refetch}
            refetchTrackData={refetchTrackOrder}
            dataIsLoading={dataIsLoading}
            page={page}
            openPaymentMethod={openPaymentMethod}
            setOpenPaymentMethod={setOpenPaymentMethod}
            paymentMethodUpdateMutation={paymentMethodUpdateMutation}
            paymentFailedData={paymentFailedData}
            setPaymentFailedData={setPaymentFailedData}
            reviewStatus={reviewStatus}
            onReviewClick={onReviewClick}
          />
          <CustomDivider />
          {trackDataIsLoading ? null : (
            <ProfileTab
              menuData={getDynamicMenuData()}
              marginright="12px"
              fontSize="13px"
              padding="10px 12px"
              borderRadius="2px"
              page={currentTab}
              handlePage={handleTab}
            />
          )}
          {trackOrderData && activeTabPanel()}
        </>
      )}
      <RefundModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        // reasons={reasonsData?.refund_reasons}
        formSubmit={formSubmitHandler}
        refundIsLoading={refundIsLoading}
      />
      {sideDrawerOpen && trackOrderData && (
        <TrackParcelOrderDrawer
          orderId={trackOrderData?.id}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          closeHandler={() => setSideDrawerOpen(false)}
          phoneOrEmail={phone}
        />
      )}
    </CustomStackFullWidth>
  );
};

OtherOrder.propTypes = {};

export default OtherOrder;
