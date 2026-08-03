import React, { Fragment, useEffect, useMemo, useState } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {
  alpha,
  Box,
  Stack,
  Typography,
  useMediaQuery,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import moment from "moment";
import { useGeolocated } from "react-geolocated";
import TrackOrderMap from "components/track-order/TrackOrderMap";
import orderConfirmImage from "../my-orders/assets/order-confirmed.png";
import shippedImage from "../my-orders/assets/shhiped.png";
import outForDelivery from "../my-orders/assets/out-for-delivery.png";
import deliveredImg from "../my-orders/assets/delivery.png";
import { StepperCustomBorder } from "../checkout/CheckOut.style";
import { Check } from "lucide-react";
import CustomImageContainer from "../CustomImageContainer";
import {
  getResolvedModuleType,
  getSlugVisualState,
  getTimestampForSlug,
  getTrackingSlugLabel,
  getTrackingSlugsForDisplay,
  isNonLinearTerminalStatus,
  OUTCOME_TRACKING_SLUGS,
  FULFILLMENT_TRACKING_SLUGS,
} from "utils/orderTracking";
import { getCustomerOrderStatusLabel } from "utils/orderStatus";

const STEP_ICON_SIZE = 36;

const QontoStepIconRoot = styled("div")(({ theme, ownerState, isMobileTimeline }) => ({
  color: theme.palette.primary.main,
  display: "flex",
  height: isMobileTimeline ? 20 : 24,
  width: isMobileTimeline ? 20 : 24,
  alignItems: "center",
  justifyContent: "center",
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
}));

function TrackingStepIcon(props) {
  const { active, completed, className, img, visual, isMobileTimeline } = props;
  const theme = useTheme();
  const muted = visual === "inactive" || visual === "upcoming";
  const pad = isMobileTimeline ? "5px" : "7px";
  const iconSize = isMobileTimeline ? 12 : 14;

  return (
    <QontoStepIconRoot
      ownerState={{ active }}
      className={className}
      isMobileTimeline={isMobileTimeline}
      sx={{ opacity: muted ? 0.45 : 1 }}
    >
      {completed ? (
        <StepperCustomBorder
          background={theme.palette.primary.main}
          padding={pad}
          border={`2px solid ${theme.palette.background.paper}`}
          boxshadow="none"
        >
          <Check size={iconSize} strokeWidth={3} color="#fff" />
        </StepperCustomBorder>
      ) : (
        <StepperCustomBorder
          background={
            active
              ? theme.palette.primary.main
              : alpha(theme.palette.neutral[400], 0.55)
          }
          padding={pad}
          border={`2px solid ${theme.palette.background.paper}`}
          boxshadow="none"
        >
          {active ? (
            <Check size={iconSize} strokeWidth={3} color="#fff" />
          ) : (
            <CustomImageContainer
              src={img}
              width={`${iconSize}px`}
              height={`${iconSize}px`}
              alt=""
            />
          )}
        </StepperCustomBorder>
      )}
    </QontoStepIconRoot>
  );
}

function pickStepImage(slug) {
  if (slug === "pending" || slug === "confirmed") return orderConfirmImage.src;
  if (
    slug === "accepted" ||
    slug === "processing" ||
    slug === "handover" ||
    slug === "refund_requested" ||
    slug === "refund_request_canceled" ||
    slug === "return_approved" ||
    slug === "return_pickup_assigned" ||
    slug === "return_awaiting_investigation"
  ) {
    return shippedImage.src;
  }
  if (
    slug === "picked_up" ||
    slug === "return_picked_up" ||
    slug === "return_out_for_platform" ||
    slug === "return_out_for_vendor" ||
    slug === "return_out_for_customer"
  ) {
    return outForDelivery.src;
  }
  return deliveredImg.src;
}

function segmentPrimary(prevStep) {
  return prevStep?.visual === "completed" || prevStep?.visual === "active";
}

function formatStepDate(time) {
  if (!time) return null;
  return moment(time).format("ddd, D MMM");
}

function isOutcomePhaseStart(slug) {
  return (
    slug === OUTCOME_TRACKING_SLUGS[0] ||
    slug === "refund_requested" ||
    slug === "return_approved"
  );
}

/** Clean equal-width horizontal timeline — icons connected, labels/dates below. */
function HorizontalStatusBar({ stepsModel, theme }) {
  const manySteps = stepsModel.length > 8;

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        py: 1,
        px: { xs: 0.5, md: 1 },
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: manySteps ? "max-content" : "100%",
          minWidth: "100%",
        }}
      >
        {stepsModel.map((step, index) => {
          const nextStep = stepsModel[index + 1];
          const showPhaseGapBefore =
            index > 0 &&
            FULFILLMENT_TRACKING_SLUGS.includes(stepsModel[index - 1]?.slug) &&
            isOutcomePhaseStart(step.slug);
          const connectToNext =
            index < stepsModel.length - 1 &&
            !(
              FULFILLMENT_TRACKING_SLUGS.includes(step.slug) &&
              isOutcomePhaseStart(nextStep?.slug)
            );

          return (
            <Fragment key={step.slug}>
              {showPhaseGapBefore && (
                <Box
                  sx={{
                    width: 12,
                    flexShrink: 0,
                    alignSelf: "stretch",
                    mx: 0.25,
                    borderLeft: `1px dashed ${alpha(theme.palette.divider, 0.95)}`,
                  }}
                  aria-hidden
                />
              )}
              <Box
                sx={{
                  flex: manySteps ? "0 0 108px" : "1 1 0",
                  minWidth: manySteps ? 108 : 0,
                  maxWidth: manySteps ? 120 : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  px: 0.5,
                }}
              >
                {connectToNext && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: STEP_ICON_SIZE / 2 - 1,
                      left: "50%",
                      width: "100%",
                      height: 2,
                      bgcolor: segmentPrimary(step)
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.55),
                      zIndex: 0,
                    }}
                    aria-hidden
                  />
                )}

                <Box
                  sx={{
                    width: STEP_ICON_SIZE,
                    height: STEP_ICON_SIZE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: "50%",
                  }}
                >
                  <TrackingStepIcon
                    active={step.visual === "active"}
                    completed={step.visual === "completed"}
                    img={step.img}
                    visual={step.visual}
                  />
                </Box>

                <Typography
                  component="div"
                  textAlign="center"
                  sx={{
                    mt: 1,
                    fontSize: "11px",
                    lineHeight: 1.25,
                    fontWeight:
                      step.visual === "active" || step.visual === "completed"
                        ? 700
                        : 500,
                    color:
                      step.visual === "active" || step.visual === "completed"
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    minHeight: 28,
                    px: 0.25,
                    wordBreak: "break-word",
                  }}
                >
                  {step.label}
                </Typography>

                <Typography
                  component="div"
                  textAlign="center"
                  sx={{
                    mt: 0.25,
                    fontSize: "10px",
                    lineHeight: 1.2,
                    color: theme.palette.text.secondary,
                    minHeight: 14,
                  }}
                >
                  {step.time ? formatStepDate(step.time) : "\u00a0"}
                </Typography>
              </Box>
            </Fragment>
          );
        })}
      </Box>
    </Box>
  );
}

function MobileHorizontalTimeline({ stepsModel, theme }) {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        py: 1,
        px: 1.5,
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={0}
        sx={{
          position: "relative",
          minWidth: "min-content",
        }}
      >
        {stepsModel.map((step, index) => (
          <Fragment key={step.slug}>
            {index > 0 && (
              <Box
                sx={{
                  flex: "0 0 20px",
                  height: 2,
                  mt: "17px",
                  backgroundColor: segmentPrimary(stepsModel[index - 1])
                    ? theme.palette.primary.main
                    : theme.palette.neutral[300],
                }}
              />
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "0 0 auto",
                width: 64,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                }}
              >
                <TrackingStepIcon
                  active={step.visual === "active"}
                  completed={step.visual === "completed"}
                  img={step.img}
                  visual={step.visual}
                  isMobileTimeline
                />
              </Box>
              <Typography
                component="div"
                textAlign="center"
                sx={{
                  fontSize: "10px",
                  lineHeight: 1.15,
                  maxWidth: 64,
                  fontWeight:
                    step.visual === "active" || step.visual === "completed"
                      ? 600
                      : 500,
                  color:
                    step.visual === "active" || step.visual === "completed"
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  mt: 0.75,
                }}
              >
                {step.label}
              </Typography>
              <Typography
                component="div"
                textAlign="center"
                sx={{
                  fontSize: "8px",
                  lineHeight: 1,
                  maxWidth: 64,
                  color: theme.palette.text.secondary,
                  opacity: 0.75,
                  mt: 0.25,
                  minHeight: 10,
                }}
              >
                {step.time ? formatStepDate(step.time) : "\u00a0"}
              </Typography>
            </Box>
          </Fragment>
        ))}
      </Stack>
    </Box>
  );
}

const TrackOrder = ({ trackOrderData }) => {
  const [userLocation, setUserLocation] = useState({});
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const moduleType = getResolvedModuleType(trackOrderData);

  const stepsModel = useMemo(() => {
    const status = trackOrderData?.order_status;
    const slugs = getTrackingSlugsForDisplay(status);
    return slugs.map((slug) => ({
      slug,
      label: getTrackingSlugLabel(
        slug,
        moduleType,
        trackOrderData?.order_type,
        t
      ),
      time: getTimestampForSlug(slug, trackOrderData),
      visual: getSlugVisualState(slug, status, trackOrderData),
      img: pickStepImage(slug),
    }));
  }, [trackOrderData, moduleType, t]);

  const terminalNonLinear = isNonLinearTerminalStatus(
    trackOrderData?.order_status
  );

  useEffect(() => {
    setUserLocation({
      lat: trackOrderData?.delivery_address?.latitude,
      lng: trackOrderData?.delivery_address?.longitude,
    });
  }, [
    trackOrderData?.delivery_address?.latitude,
    trackOrderData?.delivery_address?.longitude,
  ]);

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });

  const getCurrentLocation = () => {
    setUserLocation({ lat: coords.latitude, lng: coords.longitude });
  };

  return (
    <CustomStackFullWidth
      mt={{ xs: 1.5, md: 2 }}
      minHeight="20vh"
      alignItems="stretch"
      spacing={2.5}
    >
      {terminalNonLinear && (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 560, mx: "auto" }}
        >
          {t("Order Status")}:{" "}
          {getCustomerOrderStatusLabel(trackOrderData?.order_status, t)}{" "}
          ({t("tracking_timeline_not_applicable")})
        </Typography>
      )}

      <Box
        sx={{
          width: "100%",
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.neutral[200], 0.25),
          py: { xs: 1.5, md: 2 },
          px: { xs: 0.5, md: 1 },
        }}
      >
        {isSmall ? (
          <MobileHorizontalTimeline stepsModel={stepsModel} theme={theme} />
        ) : (
          <HorizontalStatusBar stepsModel={stepsModel} theme={theme} />
        )}
      </Box>

      <TrackOrderMap
        getCurrentLocation={getCurrentLocation}
        trackOrderData={trackOrderData}
        userLocation={userLocation}
      />
    </CustomStackFullWidth>
  );
};

export default TrackOrder;
