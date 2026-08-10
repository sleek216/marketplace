import React from "react";
import {
  Box,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Truck, RotateCcw, MapPin, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { CustomPaperBigCard } from "styled-components/CustomStyles.style";

const getStatusBadgeStyle = (status, theme, t) => {
  const norm = (status || "").toLowerCase();
  switch (norm) {
    case "delivered":
    case "success":
    case "completed":
      return {
        bg: alpha(theme.palette.success.main, 0.12),
        color: theme.palette.success.main,
        label: t("Delivered"),
      };
    case "out_for_delivery":
      return {
        bg: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        label: t("Out for Delivery"),
      };
    case "failed":
      return {
        bg: alpha(theme.palette.error.main, 0.12),
        color: theme.palette.error.main,
        label: t("Failed"),
      };
    case "canceled":
    case "cancelled":
      return {
        bg: alpha(theme.palette.error.main, 0.12),
        color: theme.palette.error.main,
        label: t("Canceled"),
      };
    case "pending":
    default:
      return {
        bg: alpha(theme.palette.warning.main, 0.12),
        color: theme.palette.warning.main,
        label: status ? status.replace(/_/g, " ") : t("Pending"),
      };
  }
};

const SingleAttemptItem = ({ attempt, isLast, t, theme }) => {
  const badge = getStatusBadgeStyle(attempt?.status, theme, t);
  const failureReason = attempt?.failure_reason || attempt?.reason;
  const startedAt = attempt?.started_at
    ? moment(attempt?.started_at).format("MMM D, YYYY h:mm A")
    : null;
  const endedAt = attempt?.ended_at
    ? moment(attempt?.ended_at).format("MMM D, YYYY h:mm A")
    : null;

  return (
    <Stack
      spacing={1}
      sx={{
        py: 1.5,
        borderBottom: isLast
          ? "none"
          : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}
    >
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
              width: 24,
              height: 24,
              borderRadius: "2px",
              backgroundColor: alpha(badge.color, 0.12),
              color: badge.color,
            }}
          >
            <Clock size={13} />
          </Box>
          <Typography
            fontSize={{ xs: "12px", md: "13px" }}
            fontWeight={600}
            color={theme.palette.neutral[900]}
          >
            {t("Attempt")} #{attempt?.attempt_number || 1}
          </Typography>
        </Stack>

        <Typography
          fontSize="11px"
          fontWeight={600}
          sx={{
            padding: "3px 8px",
            borderRadius: "2px",
            backgroundColor: badge.bg,
            color: badge.color,
            textTransform: "capitalize",
          }}
        >
          {badge.label}
        </Typography>
      </Stack>

      {(startedAt || endedAt) && (
        <Stack spacing={0.2} pl="32px">
          {startedAt && (
            <Typography
              fontSize="12px"
              fontWeight={400}
              color={theme.palette.neutral[500]}
            >
              {t("Started")}: {startedAt}
            </Typography>
          )}
          {endedAt && (
            <Typography
              fontSize="12px"
              fontWeight={400}
              color={theme.palette.neutral[500]}
            >
              {t("Finished")}: {endedAt}
            </Typography>
          )}
        </Stack>
      )}

      {failureReason && (
        <Box
          sx={{
            ml: "32px",
            mt: 0.5,
            padding: "6px 10px",
            borderRadius: "2px",
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            border: `1px solid ${alpha(theme.palette.error.main, 0.18)}`,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertCircle size={14} color={theme.palette.error.main} />
          <Typography
            fontSize="12px"
            fontWeight={500}
            color={theme.palette.error.main}
          >
            {failureReason}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

const DeliveryAttemptsCard = ({ orderData }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!orderData) return null;

  const deliveryCount =
    orderData?.delivery_attempt_count ??
    orderData?.delivery_progress?.current_attempt ??
    orderData?.delivery_progress?.attempt_history?.length ??
    0;

  const returnCount =
    orderData?.customer_return_attempt_count ??
    orderData?.return_progress?.customer_attempt_count ??
    orderData?.return_progress?.attempt_history?.length ??
    0;

  const deliveryProgress = orderData?.delivery_progress;
  const returnProgress = orderData?.return_progress;

  const deliveryHistory = deliveryProgress?.attempt_history || [];
  const returnHistory = returnProgress?.attempt_history || [];

  const hasDeliveryAttempts =
    deliveryCount > 0 ||
    deliveryHistory.length > 0 ||
    orderData?.out_for_delivery ||
    orderData?.arrived_at_city;

  const hasReturnAttempts = returnCount > 0 || returnHistory.length > 0;

  if (!hasDeliveryAttempts && !hasReturnAttempts) {
    return null;
  }

  const maxAttempts = deliveryProgress?.max_attempts || 3;
  const arrivedAtCity =
    orderData?.arrived_at_city || deliveryProgress?.arrived_at_city;
  const isOutForDelivery =
    orderData?.out_for_delivery ||
    deliveryProgress?.attempt_history?.some(
      (a) => a.status === "out_for_delivery"
    );

  return (
    <CustomPaperBigCard
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.04)
            : alpha(theme.palette.neutral[200], 0.25),
        borderRadius: "2px",
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        padding: { xs: "12px", sm: "16px", md: "20px" },
        mb: "16px",
      }}
    >
      <Stack gap="12px" width="100%">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap"
          gap="8px"
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
              <Truck size={16} />
            </Box>
            <Typography
              fontSize={{ xs: "13px", md: "14px" }}
              fontWeight={700}
              color="primary.main"
            >
              {t("Delivery Attempts")}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            {deliveryCount > 0 && (
              <Typography
                fontSize="11px"
                fontWeight={600}
                sx={{
                  padding: "4px 10px",
                  borderRadius: "2px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                }}
              >
                {`${t("Attempt")} ${deliveryCount}/${maxAttempts}`}
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Delivery Attempt History List */}
        {deliveryHistory.length > 0 ? (
          <Box sx={{ pt: 0.5 }}>
            <Typography
              fontSize="11px"
              fontWeight={600}
              color={theme.palette.neutral[500]}
              sx={{ textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.5 }}
            >
              {t("Delivery History")}
            </Typography>
            {deliveryHistory.map((attempt, index) => (
              <SingleAttemptItem
                key={`del-attempt-${index}`}
                attempt={attempt}
                isLast={index === deliveryHistory.length - 1}
                t={t}
                theme={theme}
              />
            ))}
          </Box>
        ) : deliveryCount > 0 ? (
          <Typography
            fontSize={{ xs: "12px", md: "13px" }}
            fontWeight={400}
            color={theme.palette.neutral[600]}
            pl="40px"
          >
            {`${t("Total Attempts Made:")} ${deliveryCount} ${t("of")} ${maxAttempts}`}
          </Typography>
        ) : null}

        {/* Return Attempts (if present) */}
        {hasReturnAttempts && (
          <Box
            sx={{
              pt: 1.5,
              mt: 1,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              mb={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "2px",
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                  }}
                >
                  <RotateCcw size={14} />
                </Box>
                <Typography
                  fontSize={{ xs: "12px", md: "13px" }}
                  fontWeight={700}
                  color="warning.main"
                >
                  {t("Return Pickup Attempts")}
                </Typography>
              </Stack>
              <Typography
                fontSize="11px"
                fontWeight={600}
                sx={{
                  padding: "3px 8px",
                  borderRadius: "2px",
                  backgroundColor: alpha(theme.palette.warning.main, 0.12),
                  color: theme.palette.warning.main,
                }}
              >
                {`${t("Return Attempt")} ${returnCount}/${
                  returnProgress?.max_attempts || 3
                }`}
              </Typography>
            </Stack>

            {returnHistory.map((attempt, index) => (
              <SingleAttemptItem
                key={`ret-attempt-${index}`}
                attempt={attempt}
                isLast={index === returnHistory.length - 1}
                t={t}
                theme={theme}
              />
            ))}
          </Box>
        )}
      </Stack>
    </CustomPaperBigCard>
  );
};

export default DeliveryAttemptsCard;
