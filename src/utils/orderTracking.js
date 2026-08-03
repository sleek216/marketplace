/**
 * Full order tracking pipeline — every API status has a visible step.
 * Fulfillment (linear) + outcome statuses (shown after the main flow in the same scroll row).
 */

import {
  isRefundPipelineStatus,
  normalizeOrderStatus,
  RETURN_FLOW_STATUSES,
} from "./orderStatus";

/** Slugs to render: fulfillment while in progress; focused outcome path for return/refund/cancel. */
export function getTrackingSlugsForDisplay(orderStatus) {
  if (!orderStatus) return [...FULFILLMENT_TRACKING_SLUGS];
  const normalized = normalizeOrderStatus(orderStatus);

  // Return / investigation flow — keep fulfillment + return path only (not every outcome slug)
  if (RETURN_FLOW_TRACKING_SLUGS.includes(normalized)) {
    return [...FULFILLMENT_TRACKING_SLUGS, ...RETURN_FLOW_TRACKING_SLUGS];
  }

  if (normalized === "refund_requested") {
    return [
      ...FULFILLMENT_TRACKING_SLUGS,
      "refund_requested",
      ...RETURN_FLOW_TRACKING_SLUGS,
    ];
  }

  if (normalized === "refund_request_canceled") {
    return [
      ...FULFILLMENT_TRACKING_SLUGS,
      "refund_requested",
      "refund_request_canceled",
    ];
  }

  if (normalized === "refunded" || normalized === "refund_resolved") {
    return [
      ...FULFILLMENT_TRACKING_SLUGS,
      "refund_requested",
      ...RETURN_FLOW_TRACKING_SLUGS,
      normalized,
    ];
  }

  if (normalized === "returned") {
    return [...FULFILLMENT_TRACKING_SLUGS, "returned"];
  }

  if (normalized === "canceled" || normalized === "failed") {
    return [...FULFILLMENT_TRACKING_SLUGS, normalized];
  }

  if (
    OUTCOME_PHASE_ORDER_STATUSES.has(normalized) ||
    isRefundPipelineStatus(normalized)
  ) {
    return [...FULFILLMENT_TRACKING_SLUGS, normalized];
  }

  return [...FULFILLMENT_TRACKING_SLUGS];
}

export function getResolvedModuleType(trackOrderData) {
  return (
    trackOrderData?.module?.module_type ||
    trackOrderData?.module_type ||
    "ecommerce"
  );
}

/** Canonical display order (must match translation keys `tracking_sl_<slug>`). */
export const TRACKING_SLUG_ORDER = [
  "pending",
  "confirmed",
  "accepted",
  "processing",
  "handover",
  "picked_up",
  "delivered",
  "returned",
  "refund_requested",
  "return_approved",
  "return_pickup_assigned",
  "return_picked_up",
  "return_out_for_platform",
  "return_awaiting_investigation",
  "return_out_for_vendor",
  "return_out_for_customer",
  "return_received_by_vendor",
  "refund_request_canceled",
  "refunded",
  "refund_resolved",
  "canceled",
  "failed",
];

export const RETURN_FLOW_TRACKING_SLUGS = RETURN_FLOW_STATUSES;

export const FULFILLMENT_TRACKING_SLUGS = TRACKING_SLUG_ORDER.slice(0, 7);
export const OUTCOME_TRACKING_SLUGS = TRACKING_SLUG_ORDER.slice(7);

/** Refund / return / cancel / failure — hidden during normal fulfillment; shown only when API status is one of these. */
export const OUTCOME_PHASE_ORDER_STATUSES = new Set(OUTCOME_TRACKING_SLUGS);

const FULFILLMENT_SLUGS = FULFILLMENT_TRACKING_SLUGS;
const OUTCOME_SLUGS = OUTCOME_TRACKING_SLUGS;

const TERMINAL_NON_PROGRESS = new Set([
  "canceled",
  "failed",
  "refund_request_canceled",
]);

export function isNonLinearTerminalStatus(orderStatus) {
  return orderStatus && TERMINAL_NON_PROGRESS.has(orderStatus);
}

export function shouldPollTrackOrder(orderStatus) {
  if (!orderStatus) return false;
  const normalized = normalizeOrderStatus(orderStatus);
  return ![
    "delivered",
    "returned",
    "canceled",
    "cancelled",
    "failed",
    "refunded",
    "refund_resolved",
    "refund_request_canceled",
  ].includes(normalized);
}

/** Infer how far fulfillment progressed when current API status is an outcome (refund/cancel/etc.). */
export function inferFulfillmentRank(trackOrderData, orderStatus) {
  const d = trackOrderData;
  if (!d) return 0;

  const fi = FULFILLMENT_SLUGS.indexOf(orderStatus);
  if (fi !== -1) return fi;

  if (d.delivered) return 6;
  if (d.picked_up) return 5;
  if (d.handover) return 4;
  if (d.processing) return 3;
  if (d.accepted) return 2;
  if (d.confirmed) return 1;
  if (d.pending) return 0;

  if (orderStatus === "canceled" || orderStatus === "failed") return 0;

  return 0;
}

export function getTimestampForSlug(slug, data) {
  if (!data) return null;
  switch (slug) {
    case "pending":
      return data.pending;
    case "confirmed":
      return data.confirmed;
    case "accepted":
      return data.accepted;
    case "processing":
      return data.processing;
    case "handover":
      return data.handover;
    case "picked_up":
      return data.picked_up;
    case "delivered":
      return data.delivered;
    case "returned":
      return data.returned_at ?? data.parcel_cancellation?.updated_at ?? null;
    case "refund_requested":
    case "refund_request_canceled":
    case "refunded":
    case "refund_resolved":
      return data.refund?.created_at ?? data.refund?.updated_at ?? null;
    case "return_approved":
    case "return_pickup_assigned":
    case "return_picked_up":
    case "return_out_for_platform":
    case "return_awaiting_investigation":
    case "return_out_for_vendor":
    case "return_out_for_customer":
    case "return_received_by_vendor":
      return (
        data.refund?.updated_at ??
        data.refund?.created_at ??
        data.returned_at ??
        null
      );
    default:
      return null;
  }
}

/** Module-aware title for a slug (translation keys must exist in en.js). */
export function getTrackingSlugLabel(slug, _moduleType, orderType, t) {
  const takeAway = orderType === "take_away";

  if (slug === "processing") {
    return t("tracking_sl_order_preparing");
  }
  if (slug === "handover") {
    return t("tracking_sl_handover");
  }
  if (slug === "picked_up") {
    return takeAway ? t("tracking_sl_collected") : t("tracking_sl_out_for_delivery");
  }

  return t(`tracking_sl_${slug}`);
}

/**
 * @returns {'completed' | 'active' | 'upcoming' | 'inactive'}
 */
export function getSlugVisualState(slug, orderStatus, trackOrderData) {
  if (!orderStatus) return "upcoming";

  const fi = FULFILLMENT_SLUGS.indexOf(orderStatus);
  const si = FULFILLMENT_SLUGS.indexOf(slug);
  const oi = OUTCOME_SLUGS.indexOf(orderStatus);
  const os = OUTCOME_SLUGS.indexOf(slug);

  if (si !== -1) {
    if (fi !== -1) {
      if (fi === 6) {
        return si <= 6 ? "completed" : "upcoming";
      }
      if (si < fi) return "completed";
      if (si === fi) return "active";
      return "upcoming";
    }
    const inferred = inferFulfillmentRank(trackOrderData, orderStatus);
    if (inferred >= 6) {
      return si <= 6 ? "completed" : "upcoming";
    }
    if (si < inferred) return "completed";
    if (si === inferred) return "active";
    return "upcoming";
  }

  if (os !== -1) {
    const normalized = normalizeOrderStatus(orderStatus);
    const returnIdx = RETURN_FLOW_TRACKING_SLUGS.indexOf(normalized);
    const returnSlugIdx = RETURN_FLOW_TRACKING_SLUGS.indexOf(slug);

    if (returnIdx !== -1 && returnSlugIdx !== -1) {
      if (returnSlugIdx < returnIdx) return "completed";
      if (returnSlugIdx === returnIdx) return "active";
      return "inactive";
    }

    if (normalized === "refund_requested" && slug === "refund_requested") {
      return "active";
    }

    if (
      ["refunded", "refund_resolved"].includes(normalized) &&
      (RETURN_FLOW_TRACKING_SLUGS.includes(slug) || slug === "refund_requested")
    ) {
      return "completed";
    }

    if (oi === -1) return "inactive";
    if (normalized === slug) return "active";
    if (
      ["refunded", "refund_resolved"].includes(normalized) &&
      slug === "refund_request_canceled"
    ) {
      return "inactive";
    }
    if (
      normalized === "refund_request_canceled" &&
      (slug === "refund_requested" || RETURN_FLOW_TRACKING_SLUGS.includes(slug))
    ) {
      return "completed";
    }
    return "inactive";
  }

  return "upcoming";
}

/** @deprecated — kept for compatibility; use getSlugVisualState / full steps instead */
export function getTrackOrderActiveStep(orderStatus) {
  if (!orderStatus) return 0;
  const i = FULFILLMENT_SLUGS.indexOf(orderStatus);
  if (i === -1) return 0;
  return i >= 6 ? 7 : i;
}

export function getTrackingStepCopy(moduleType, orderType, t) {
  const mt = moduleType || "ecommerce";
  const takeAway = orderType === "take_away";

  const preparing =
    mt === "food"
      ? t("tracking_preparing_food")
      : mt === "grocery"
        ? t("tracking_preparing_grocery")
        : mt === "pharmacy"
          ? t("tracking_preparing_pharmacy")
          : t("tracking_preparing_ecommerce");

  const onTheWay = takeAway
    ? t("tracking_ready_pickup")
    : mt === "food"
      ? t("tracking_on_way_food")
      : mt === "grocery"
        ? t("tracking_on_way_grocery")
        : mt === "pharmacy"
          ? t("tracking_on_way_pharmacy")
          : t("tracking_on_way_ecommerce");

  const completed = takeAway ? t("tracking_completed_pickup") : t("tracking_delivered");

  return {
    placed: t("tracking_step_order_placed"),
    preparing,
    onTheWay,
    completed,
  };
}
