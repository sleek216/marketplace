import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import giftbox from "./assets/giftbox.gif";

import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import {
  CustomColouredTypography,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";

import { getNumberWithConvertedDecimalPoint } from "utils/CustomFunctions";
import { setCampaignItemList, setClearCart } from "redux/slices/cart";
import CustomImageContainer from "../CustomImageContainer";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useTheme } from "@emotion/react";
import PlaceOrderSuccessSummary from "./PlaceOrderSuccessSummary";
import {
  getPlaceOrderSuccess,
  isMultiStorePlaceOrderResponse,
} from "helper-functions/placeOrderResponse";

const SuccessCard = ({ configData, total, order_id, orderData: orderDataProp }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [totalAmount, setTotalAmount] = useState(0);
  const dispatch = useDispatch();
  const { orderInformation } = useSelector((state) => state.utilsData);

  const orderData = useMemo(() => {
    if (orderDataProp && (orderDataProp.order_id || orderDataProp.is_multi_store)) {
      return orderDataProp;
    }
    if (
      orderInformation &&
      (orderInformation.order_id || orderInformation.is_multi_store)
    ) {
      return orderInformation;
    }
    return getPlaceOrderSuccess();
  }, [orderDataProp, orderInformation]);

  const isMulti = isMultiStorePlaceOrderResponse(orderData);

  useEffect(() => {
    dispatch(setClearCart());
    dispatch(setCampaignItemList());
    if (total) {
      setTotalAmount(total);
    } else if (orderData?.grand_total != null) {
      setTotalAmount(orderData.grand_total);
    } else if (orderData?.total_ammount != null) {
      setTotalAmount(orderData.total_ammount);
    } else if (localStorage.getItem("totalAmount")) {
      setTotalAmount(localStorage.getItem("totalAmount"));
    }
  }, []);

  const handlePoints = () => {
    if (totalAmount && configData?.loyalty_point_status === 1) {
      return getNumberWithConvertedDecimalPoint(
        (totalAmount / 100) * configData?.loyalty_point_item_purchase_point,
        configData?.digit_after_decimal_point
      );
    }
  };
  const handleText = () => {
    if (getCurrentModuleType() === "food") {
      return "food";
    } else if (getCurrentModuleType() === "parcel") {
      return "parcel";
    } else {
      return "order";
    }
  };

  return (
    <CustomStackFullWidth
      height="100%"
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Typography
          align="center"
          sx={{ fontSize: 24 }}
          color="text.secondary"
          gutterBottom
        >
          {t("You place the order successfully.")}
        </Typography>
        <Typography align="center" sx={{ mb: 1.5 }} color="text.secondary">
          {t(
            `Your order is placed Successfully. We start our delivery process and you will receive your ${handleText()} soon.`
          )}
        </Typography>
        {isMulti || orderData ? (
          <PlaceOrderSuccessSummary
            orderData={orderData}
            orderIdFallback={order_id}
          />
        ) : (
          <Typography align="center" sx={{ mb: 1.5 }}>
            {t(`Your order is`)}
            <span
              style={{
                color: theme.palette.primary.main,
                marginLeft: "3px",
              }}
            >
              {order_id}
            </span>
            {t(`. You can use this ID to track your order later`)}
          </Typography>
        )}
        {configData?.loyalty_point_status === 1 && (
          <CustomStackFullWidth alignItems="center">
            <CustomImageContainer
              src={giftbox.src}
              width="140px"
              borderRadius=".6rem"
              objectfit="contain"
            />
            <CustomColouredTypography color="primary" variant="h3">
              {t("Congratulations!")}
            </CustomColouredTypography>
          </CustomStackFullWidth>
        )}
        <Stack pt="2rem" spacing={1}>
          <Button
            onClick={() =>
              router.push("/track-order", undefined, {
                shallow: true,
              })
            }
            variant="contained"
          >
            {t("Track your order")}
          </Button>
          <Typography
            onClick={() => router.push("/home", undefined, { shallow: true })}
            variant="contained"
            sx={{
              textDecoration: "underLine",
              cursor: "pointer",
              textAlign: "center",
              color: (theme) => theme.palette.primary.main,
            }}
          >
            {t("Continue shopping ")}
          </Typography>
        </Stack>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};
export default SuccessCard;
