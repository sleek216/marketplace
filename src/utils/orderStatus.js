import moment from "moment";

/** Shared return-investigation pipeline (before branch / terminal outcomes). */
export const RETURN_FLOW_STATUSES = [
  "return_approved",
  "return_pickup_assigned",
  "return_picked_up",
  "return_out_for_platform",
  "return_awaiting_investigation",
  "return_out_for_vendor",
  "return_out_for_customer",
  "return_received_by_vendor",
];

export const REFUND_PIPELINE_STATUSES = [
  "refund_requested",
  ...RETURN_FLOW_STATUSES,
];

export const REFUND_HISTORY_STATUSES = [
  "refunded",
  "refund_resolved",
  "refund_request_canceled",
];

export const REFUND_ACTIVE_STATUSES = [
  "refund_requested",
  ...RETURN_FLOW_STATUSES,
];

export const TERMINAL_ORDER_STATUSES = [
  "delivered",
  "returned",
  "canceled",
  "cancelled",
  "failed",
  "refunded",
  "refund_resolved",
  "refund_request_canceled",
];

const TRACK_HIDDEN_STATUSES = new Set([
  "delivered",
  "failed",
  "canceled",
  "cancelled",
  "refunded",
  "refund_resolved",
  "refund_request_canceled",
]);

export function normalizeOrderStatus(status) {
  return (status || "").toString().trim().toLowerCase().replaceAll("-", "_");
}

export function isReturnFlowStatus(status) {
  return RETURN_FLOW_STATUSES.includes(normalizeOrderStatus(status));
}

export function isRefundPipelineStatus(status) {
  return REFUND_PIPELINE_STATUSES.includes(normalizeOrderStatus(status));
}

export function isTerminalOrderStatus(status) {
  return TERMINAL_ORDER_STATUSES.includes(normalizeOrderStatus(status));
}

export function isCancelledOrderStatus(status) {
  const normalized = normalizeOrderStatus(status);
  return normalized === "canceled" || normalized === "cancelled";
}

export function shouldShowTrackOrder(status) {
  return !TRACK_HIDDEN_STATUSES.has(normalizeOrderStatus(status));
}

export function isWithinReturnWindow(deliveredAt, returnWindowDays = 7) {
  if (!deliveredAt) return false;
  return moment().diff(moment(deliveredAt), "days") <= Number(returnWindowDays ?? 7);
}

/**
 * Customer-facing status copy (per backend spec).
 * Falls back to i18n key or formatted slug.
 */
export function getCustomerOrderStatusLabel(status, t) {
  const normalized = normalizeOrderStatus(status);
  const key = `order_status_${normalized}`;
  const translated = t(key);
  if (translated && translated !== key) return translated;

  switch (normalized) {
    case "delivered":
      return t("Delivered");
    case "failed":
      return t("Payment Failed");
    default:
      return (status || "").replaceAll("_", " ");
  }
}

export function getOngoingStatusGroup(status) {
  const normalized = normalizeOrderStatus(status);
  if (["pending"].includes(normalized)) return "pending";
  if (["accepted", "confirmed", "processing"].includes(normalized)) return "accepted";
  if (["handover", "picked_up", "out_for_delivery"].includes(normalized)) return "handover";
  if (isRefundPipelineStatus(normalized)) return "refund";
  return "other";
}

export function getPreviousStatusGroup(status) {
  const normalized = normalizeOrderStatus(status);
  if (["delivered", "returned"].includes(normalized)) return "delivered";
  if (REFUND_HISTORY_STATUSES.includes(normalized)) return "refunded";
  if (["canceled", "cancelled", "failed"].includes(normalized)) return "cancelled";
  return "other";
}
