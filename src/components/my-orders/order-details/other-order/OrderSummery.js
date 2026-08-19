import { X as CloseIcon, ChevronDown as ExpandMoreIcon, MapPin, CreditCard, MessageCircle } from "lucide-react";
import {
  Grid,
  IconButton,
  Skeleton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Button,
  Box,
} from "@mui/material";
import adminImage from "../../../../../public/static/profile/fi_4460756 (1).png";
import { Stack } from "@mui/system";
import { FoodHalalHaram } from "components/cards/SpecialCard";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import React, { memo, useEffect, useState } from "react";
import "simplebar-react/dist/simplebar.min.css";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { CustomTypographyEllipsis } from "styled-components/CustomTypographies.style";
import CustomDivider from "../../../CustomDivider";
import CustomImageContainer from "../../../CustomImageContainer";
import CustomModal from "../../../modal";
import CashSvg from "../../assets/CashSvg";
import ParcelOrderSummery from "../ParcelOrderSummery";
import OfflineOrderDenied from "../offline-order/OfflineOrderDenied";
import OfflineOrderDetails from "../offline-order/OfflineOrderDetails";
import OfflinePaymentEdit from "../offline-order/OfflinePaymentEdit";
import PrescriptionOrderCalculation from "../prescription-order/PerscriptionOrderCalculation";
import PrescriptionOrderSummery from "../prescription-order/PrescriptionOrderSummery";
import SingleOrderAttachment from "../singleOrderAttachment";
import DeliveryAttemptsCard from "./DeliveryAttemptsCard";
import InstructionBox from "./InstructionBox";
import OrderCalculation from "./OrderCalculation";
import { getImageUrl } from "utils/CustomFunctions";
import { WrapperForCustomDialogConfirm } from "components/custom-dialog/confirm/CustomDialogConfirm.style";
import DialogTitle from "@mui/material/DialogTitle";
import { t } from "i18next";
import DialogContent from "@mui/material/DialogContent";
import { Square as CheckBoxOutlineBlankIcon, CheckSquare as CheckBoxIcon } from "lucide-react";
import ChatWithAdmin from "components/my-orders/order-details/other-order/ChatWithAdmin";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetAutomatedMessage";
import { getToken } from "helper-functions/getToken";
import { LoadingButton } from "@mui/lab";
import {
  getOrderDetailsLineItems,
  getOrderDetailsMeta,
  getOrderDetailsModuleType,
  getOrderItemPriceParts,
  getOrderItemVariationLabels,
} from "helper-functions/orderDetails";
import ManualExpectedDeliveryInfo, {
	hasManualExpectedDelivery,
	resolveManualExpectedDeliveryItem,
} from "../../../product-details/ManualExpectedDeliveryInfo";
import {
  REFUND_ACTIVE_STATUSES,
  REFUND_HISTORY_STATUSES,
} from "utils/orderStatus";
import { StoreGroupHeader } from "../../../product-details/StoreGroupSection";

const getAddOnsNames = (addOns) => {
  if (!addOns || addOns.length === 0) return "";

  const names = addOns.map(
    (item, index) =>
      `${item.name}(${item.quantity})${index !== addOns.length - 1 ? "," : ""}`
  );

  return names.join(" ");
};

const MetaChip = ({ children, tone = "neutral" }) => {
  const theme = useTheme();
  const isDiscount = tone === "discount";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 0.85,
        py: 0.25,
        borderRadius: "2px",
        fontSize: "11px",
        fontWeight: 500,
        lineHeight: 1.25,
        whiteSpace: "nowrap",
        color: isDiscount
          ? theme.palette.error.main
          : theme.palette.text.secondary,
        backgroundColor: isDiscount
          ? alpha(theme.palette.error.main, 0.08)
          : alpha(theme.palette.text.primary, 0.05),
      }}
    >
      {children}
    </Box>
  );
};

const OrderLineItem = ({ product, isLast, t }) => {
  const theme = useTheme();
  const variationLabels = getOrderItemVariationLabels(product);
  const priceParts = getOrderItemPriceParts(product);
  const unitType = product?.item_details?.unit_type;
  const unitTypeIsVariation = variationLabels.some(
    (row) => row.value.toLowerCase() === String(unitType || "").toLowerCase()
  );
  const showUnit =
    Boolean(unitType) &&
    !unitTypeIsVariation &&
    variationLabels.length === 0;
  const quantity = product?.quantity || 1;
  const hasDiscount =
    priceParts.discountPerUnit > 0 && priceParts.baseUnit > priceParts.finalUnit;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        px: { xs: 1.25, sm: 1.75 },
        py: 1.35,
        ...(!isLast && {
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
        }),
      }}
    >
      <Box
        sx={{
          position: "relative",
          flexShrink: 0,
          width: { xs: 56, sm: 64 },
          height: { xs: 56, sm: 64 },
        }}
      >
        <CustomImageContainer
          src={product?.image_full_url}
          height="64px"
          width="64px"
          smHeight="56px"
          smWidth="56px"
          loading="lazy"
          borderRadius="8px"
          objectfit="cover"
        />
        <Box
          aria-label={`${t("Qty")} ${quantity}`}
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            minWidth: 22,
            height: 22,
            px: quantity > 9 ? 0.5 : 0,
            borderRadius: "50%",
            bgcolor: "common.black",
            color: "common.white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            lineHeight: 1,
            border: `2px solid ${
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.background.paper
            }`,
          }}
        >
          {quantity}
        </Box>
      </Box>

      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        flex={1}
        minWidth={0}
        spacing={1.25}
      >
        <Stack minWidth={0} spacing={0.6} flex={1}>
          <Typography
            fontWeight={600}
            fontSize={{ xs: "13px", sm: "14px" }}
            lineHeight={1.35}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
            }}
          >
            {t(product?.item_details?.name)}
            {product?.item_details?.halal_tag_status &&
            product?.item_details?.is_halal ? (
              <FoodHalalHaram
                position="relative"
                width={23}
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  marginLeft: "4px",
                }}
              />
            ) : null}
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.6}>
            {variationLabels.map((row, variationIndex) => (
              <MetaChip key={`${row.name}-${row.value}-${variationIndex}`}>
                {row.name ? `${t(row.name)}: ${row.value}` : row.value}
              </MetaChip>
            ))}
            {showUnit && (
              <MetaChip>
                {t("Unit")}: {t(unitType)}
              </MetaChip>
            )}
            {hasDiscount && (
              <MetaChip tone="discount">
                {t("Discount")} {getAmountWithSign(priceParts.discountPerUnit)}
              </MetaChip>
            )}
            {product?.add_ons?.length > 0 && (
              <MetaChip>
                {t("Addons")}: {getAddOnsNames(product?.add_ons)}
              </MetaChip>
            )}
          </Stack>
        </Stack>
        <Stack alignItems="flex-end" spacing={0.15} flexShrink={0} pt={0.15}>
          <Typography
            fontSize={{ xs: "14px", sm: "15px" }}
            fontWeight={700}
            color="text.primary"
            whiteSpace="nowrap"
          >
            {getAmountWithSign(priceParts.finalUnit)}
          </Typography>
          {hasDiscount && (
            <Typography
              fontSize="12px"
              color="text.disabled"
              sx={{ textDecoration: "line-through" }}
              whiteSpace="nowrap"
            >
              {getAmountWithSign(priceParts.baseUnit)}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};


const OrderSummery = (props) => {
  const {
    trackOrderData,
    configData,
    t,
    data,
    isLoading,
    dataIsLoading,
    refetchTrackOrder,
    setOpenPaymentMethod,
    handlePayment,
    repayOrderLoading
  } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [openOfflineDetails, setOpenOfflineDetails] = useState(false);
  const [openOfflineModal, setOpenOfflineModal] = useState(false);
  const [partialWithOffline, setPartialWithOffline] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const { data: automateMessageData } = useGetOrderCancelReason();
  const orderDetailsMeta = getOrderDetailsMeta(data);
  const orderLineItems = getOrderDetailsLineItems(data);
  const orderDeliverySource = orderLineItems.find((product) =>
    hasManualExpectedDelivery(resolveManualExpectedDeliveryItem(product))
  );
  const isDeliveredOrder = trackOrderData?.order_status === "delivered";
  const isCompletedNonDeliveredOrder = [
    "canceled",
    "cancelled",
    "failed",
    ...REFUND_HISTORY_STATUSES,
    ...REFUND_ACTIVE_STATUSES,
    "return_received_by_vendor",
  ].includes(trackOrderData?.order_status);
  const showDeliveredFooter = isDeliveredOrder && trackOrderData?.delivered;
  const showEstimatedFooter =
    !isDeliveredOrder &&
    !isCompletedNonDeliveredOrder &&
    Boolean(orderDeliverySource);

  useEffect(() => {
    if (trackOrderData?.offline_payment !== null) {
      setPartialWithOffline(true);
    }
  }, []);

  const handleImageOnClick = (value) => {
    setModalImage(value);
    setModalOpen(true);
  };
  const handleModalClose = (value) => {
    setModalOpen(value);
    setModalImage(null);
  };
  const handleClickOffline = () => {
    setOpenOfflineDetails(!openOfflineDetails);
  };
  const buttonBackgroundColor = () => {
    if (trackOrderData?.offline_payment?.data?.status === "denied") {
      return `${alpha(theme.palette.error.deepLight, 0.9)}`;
    } else if (trackOrderData?.offline_payment?.data?.status === "unpaid") {
      return theme.palette.info.main;
    } else if (trackOrderData?.offline_payment?.data?.status === "verified") {
      return theme.palette.success.main;
    } else {
      return theme.palette.warning.lite;
    }
  };
  const isPaymentFailed = () => {
    return (trackOrderData?.order_status === "failed" || !trackOrderData?.offline_payment)
      && (trackOrderData?.payment_status === "unpaid" || (trackOrderData?.payments[1]?.payment_status === "unpaid" && trackOrderData?.payments[1]?.payment_method !== "cash_on_delivery"))
      && (trackOrderData?.payment_method !== "cash_on_delivery" && trackOrderData?.payment_method !== "wallet")
      && trackOrderData?.order_status !== "canceled"
  };
  return (
    <>
      {getOrderDetailsModuleType(data, trackOrderData) === "parcel" ? (
        <ParcelOrderSummery
          data={orderDetailsMeta || data}
          trackOrderData={trackOrderData}
          configData={configData}
          refetchTrackOrder={refetchTrackOrder}
          isPaymentFailed={isPaymentFailed}
          repayOrderLoading={repayOrderLoading}
          setOpenPaymentMethod={setOpenPaymentMethod}
          handlePayment={handlePayment}
        />
      ) : (
        <Grid container pr={{ xs: "0px", sm: "0px", md: "16px" }}>
          <Grid container item md={8} xs={12}>
            <Grid item xs={12} sm={12} md={12}>
              {!orderDetailsMeta?.prescription_order &&
                trackOrderData?.module_type === "pharmacy" &&
                trackOrderData?.order_attachment_full_url && trackOrderData?.attachment && (
                  <SingleOrderAttachment
                    title="Prescription"
                    trackOrderData={trackOrderData}
                    configData={configData}
                  />
                )}
              {orderDetailsMeta?.prescription_order && (
                <PrescriptionOrderSummery data={orderDetailsMeta} />
              )}
              {orderLineItems.length > 0 && (
                <Box sx={{ pl: { xs: "0px", sm: "8px", md: "12px" } }}>
                  <StoreGroupHeader
                    storeName={trackOrderData?.store?.name}
                    storeLogo={trackOrderData?.store?.logo_full_url}
                    storeId={trackOrderData?.store?.id}
                    sx={{
                      px: 0,
                      borderBottom: "none",
                      pb: 1,
                      pt: 0,
                    }}
                  />
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: "2px",
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      overflow: "hidden",
                    }}
                  >
                    {orderLineItems.map((product, index) => (
                      <OrderLineItem
                        key={product?.id || index}
                        product={product}
                        isLast={index === orderLineItems.length - 1}
                        t={t}
                      />
                    ))}
                    {(showDeliveredFooter || showEstimatedFooter) && (
                      <ManualExpectedDeliveryInfo
                        record={
                          showEstimatedFooter ? orderDeliverySource : undefined
                        }
                        deliveredDate={
                          showDeliveredFooter
                            ? trackOrderData?.delivered
                            : undefined
                        }
                        variant="footer"
                        footerInset
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              pl={{ xs: "0px", sm: "8px", md: "12px" }}
            >
              <CustomStackFullWidth
                direction={{ xs: "column", md: "row" }}
                sx={{
                  flexWrap: "wrap",
                  padding: { xs: "0px", md: "0px 8px" },
                  gap: 1.5,
                }}
              >
                <Stack
                  spacing={1}
                  flex={1}
                  sx={{
                    p: 1.75,
                    borderRadius: "2px",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    backgroundColor: theme.palette.background.paper,
                    minWidth: 0,
                  }}
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
                      <MapPin size={16} />
                    </Box>
                    <Typography
                      fontSize={{ xs: "13px", md: "14px" }}
                      fontWeight={700}
                      color="primary.main"
                    >
                      {t("Address")}
                    </Typography>
                  </Stack>
                  <Typography
                    fontSize="13px"
                    fontWeight={400}
                    color={theme.palette.neutral[600]}
                    lineHeight={1.5}
                    pl="40px"
                  >
                    {trackOrderData?.delivery_address?.address}
                  </Typography>
                </Stack>
                <Stack
                  flex={1}
                  spacing={1}
                  sx={{
                    p: 1.75,
                    borderRadius: "2px",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    backgroundColor: theme.palette.background.paper,
                    minWidth: 0,
                  }}
                >
                  <Stack
                    width="100%"
                    spacing={1}
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Stack gap="10px" width="100%">
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              display: "grid",
                              placeItems: "center",
                              width: 32,
                              height: 32,
                              borderRadius: "2px",
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <CreditCard size={16} />
                          </Box>
                          <Typography
                            fontSize={{ xs: "13px", md: "14px" }}
                            fontWeight={700}
                            color="primary.main"
                          >
                            {t("Payment")}
                          </Typography>
                        </Stack>
                        <Typography
                          fontSize="12px"
                          fontWeight={600}
                          color={theme.palette.primary.main}
                          sx={{
                            padding: "4px 10px",
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.12
                            ),
                            borderRadius: "2px",
                            textTransform: "capitalize",
                          }}
                        >
                          {trackOrderData?.payment_status?.replace("_", " ")}
                        </Typography>
                      </Stack>
                      {trackOrderData?.payment_method ? (
                        <CustomStackFullWidth flexDirection="row" alignItems="center" pl="40px">
                          <CashSvg />
                          <Typography
                            padding={"0px 10px"}
                            fontSize={{ xs: "13px", md: "14px" }}
                            fontWeight="400"
                            color={theme.palette.neutral[600]}
                            maxWidth="280px"
                            lineHeight="24px"
                            textTransform="capitalize"
                          >
                            {t(
                              trackOrderData?.payment_method.replaceAll(
                                "_",
                                " "
                              )
                            )}
                          </Typography>
                        </CustomStackFullWidth>
                      ) : (
                        <Skeleton width="100px" variant="text" />
                      )}
                      {isPaymentFailed() && (
                        <Typography sx={{ maxWidth: "336px" }} fontSize={{ xs: "12px", md: "14px" }} fontWeight="400" color={theme.palette.neutral[500]}>
                          {t("Your payment was incomplete. Please choose an option below to complete your transaction.")}
                        </Typography>
                      )}
                      {isPaymentFailed() && (
                        <Stack direction="row" spacing={1} width="100%">
                          {getToken() && <Button variant="contained" fullWidth onClick={() => setOpenPaymentMethod(true)}>
                            {t("Pay Now")}
                          </Button>}
                          <LoadingButton variant="outlined" loading={repayOrderLoading} fullWidth onClick={handlePayment}>
                            {t("Switch to COD")}
                          </LoadingButton>
                        </Stack>
                      )}
                    </Stack>
                    {(trackOrderData?.payment_method === "offline_payment") && trackOrderData?.offline_payment && (
                      <Stack alignItems="flex-end" gap="5px">
                        <Typography
                          component="span"
                          fontSize="12px"
                          sx={{
                            textTransform: "capitalize",
                            padding: "4px",
                            marginLeft: "15px",
                            borderRadius: "3px",
                            backgroundColor: buttonBackgroundColor(),
                            color: theme.palette.whiteContainer.main,
                            fontWeight: "600",
                            marginTop: "-8px",
                          }}
                        >
                          {/* {trackData?.order_status.replace("_", " ")} */}
                          {trackOrderData?.offline_payment?.data?.status}
                        </Typography>
                        {trackOrderData?.offline_payment && (trackOrderData?.payment_method === "offline_payment") ? (<ExpandMoreIcon
                          onClick={handleClickOffline}
                          sx={{ cursor: "pointer" }}
                        />) : null}
                      </Stack>
                    )}
                  </Stack>
                  {openOfflineDetails &&
                    (trackOrderData?.payment_method === "offline_payment" ||
                      partialWithOffline) && (
                      <OfflineOrderDetails
                        trackOrderData={trackOrderData}
                        setOpenOfflineModal={setOpenOfflineModal}
                        setOpenPaymentMethod={setOpenPaymentMethod}
                        refetchTrackOrder={refetchTrackOrder}
                      />
                    )}

                  {trackOrderData?.offline_payment?.data?.status ===
                    "denied" && (trackOrderData?.payment_method == "offline_payment") && (
                      <OfflineOrderDenied trackOrderData={trackOrderData} />
                    )}
                  {trackOrderData?.offline_payment?.data?.status ===
                    "denied" && (trackOrderData?.payment_method === "offline_payment") && getToken() && (
                      <Stack direction="row" spacing={1} width="100%" marginTop="15px">
                        <LoadingButton
                          variant="outlined"
                          fullWidth
                          loading={repayOrderLoading}
                          onClick={handlePayment}
                        >
                          {t("Switch to COD")}
                        </LoadingButton>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => setOpenPaymentMethod(true)}
                        >
                          {t("Update Payment")}
                        </Button>
                      </Stack>
                    )}

                  {openOfflineModal && (
                    <CustomModal
                      openModal={openOfflineModal}
                      handleClose={() => setOpenOfflineModal(false)}
                    >
                      <CustomStackFullWidth
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ position: "relative" }}
                      >
                        <IconButton
                          onClick={() => setOpenOfflineModal(false)}
                          sx={{
                            zIndex: "99",
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: (theme) =>
                              theme.palette.neutral[100],
                            borderRadius: "50%",
                            [theme.breakpoints.down("md")]: {
                              top: 10,
                              right: 5,
                            },
                          }}
                        >
                          <CloseIcon
                            sx={{ fontSize: "24px", fontWeight: "500" }}
                          />
                        </IconButton>
                      </CustomStackFullWidth>
                      <OfflinePaymentEdit
                        trackOrderData={trackOrderData}
                        refetchTrackOrder={refetchTrackOrder}
                        data={orderDetailsMeta || data}
                        setOpenOfflineModal={setOpenOfflineModal}
                      />
                    </CustomModal>
                  )}
                </Stack>
                {!isSmall && trackOrderData?.unavailable_item_note && (
                  <Stack
                    sx={{
                      borderLeft: (theme) =>
                        `3px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
                      paddingLeft: "30px",

                      height: "100px",
                    }}
                  ></Stack>
                )}

                {trackOrderData?.cutlery && (
                  <Stack
                    spacing={1}
                    sx={{ ":last-child": { marginLeft: "0px" } }}
                  >
                    <Typography
                      fontSize={{ xs: "14px", md: "16px" }}
                      fontWeight="500"
                      textTransform="capitalize"
                    >
                      {t("Cutlery")}
                    </Typography>
                    <Typography
                      fontSize={{ xs: "12px", md: "14px" }}
                      fontWeight="400"
                      color={theme.palette.neutral[500]}
                      width="215px"
                      lineHeight="25px"
                      textTransform="capitalize"
                    >
                      {t("Yes")}
                    </Typography>
                  </Stack>
                )}
              </CustomStackFullWidth>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              pl={{ xs: "0px", sm: "8px", md: "12px" }}
            >
              {trackOrderData?.unavailable_item_note && (
                <InstructionBox
                  title="Unavailable item Note"
                  note={trackOrderData?.unavailable_item_note}
                />
              )}
              {trackOrderData?.delivery_instruction && (
                <InstructionBox
                  title="delivery instruction"
                  note={trackOrderData?.delivery_instruction}
                />
              )}
              {trackOrderData?.order_status === "refund_requested" && (
                <InstructionBox
                  title="refund reason"
                  note={trackOrderData?.refund?.customer_reason}
                />
              )}
              {trackOrderData?.order_status === "refund_request_canceled" && (
                <InstructionBox
                  title="refund cancellation note"
                  note={
                    trackOrderData?.refund_cancellation_note ||
                    trackOrderData?.refund?.admin_note
                  }
                />
              )}
              {trackOrderData?.order_status === "canceled" &&
                trackOrderData?.cancellation_note && (
                  <InstructionBox
                    title="cancellation note"
                    note={trackOrderData?.cancellation_note}
                  />
                )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} pl={{ xs: "0px", sm: "12px", md: "16px" }}>

            {orderDetailsMeta?.prescription_order ? (
              <PrescriptionOrderCalculation
                data={orderDetailsMeta}
                t={t}
                trackOrderData={trackOrderData}
                configData={configData}
              />
            ) : (
              <OrderCalculation
                data={orderLineItems}
                t={t}
                trackOrderData={trackOrderData}
                configData={configData}
              />
            )}
            {getToken() && !orderDetailsMeta?.prescription_order && (
              <Stack
                direction="row"
                spacing={1.25}
                justifyContent="center"
                mt={1.5}
                alignItems="center"
                sx={{
                  padding: "10px 14px",
                  borderRadius: "2px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
                onClick={() => setOpenAdmin(true)}
              >
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "2px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  }}
                >
                  <MessageCircle size={16} />
                </Box>
                <Typography
                  fontSize={{ xs: "13px", md: "14px" }}
                  fontWeight="500"
                  color={theme.palette.neutral[700]}
                >
                  {t(`Message to `)}
                  <Typography
                    component="span"
                    fontSize={{ xs: "13px", md: "14px" }}
                    fontWeight="600"
                    color={theme.palette.primary.main}
                  >
                    {configData?.business_name}
                  </Typography>
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
      )}
      <CustomModal
        openModal={openAdmin}
        handleClose={() => setOpenAdmin(false)}
        closeButton
      >
        <ChatWithAdmin
          automateMessageData={automateMessageData?.data}
          orderID={trackOrderData?.id}
        />
      </CustomModal>
    </>
  );
};

OrderSummery.propTypes = {};

export default memo(OrderSummery);
