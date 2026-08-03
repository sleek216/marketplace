import MainApi from "api-manage/MainApi";
import { getToken } from "helper-functions/getToken";

export const COUPON_LIST_PATH = "/api/v1/coupon/list";

/** API returns `expire_date`; checkout/coupon cards use `end_date`. */
export const mapCouponRow = (row) => {
  if (!row || typeof row !== "object") return row;
  const out = { ...row };
  if (out.end_date == null && out.expire_date != null) {
    out.end_date = out.expire_date;
  }
  return out;
};

export const normalizeCouponListPayload = (payload) => {
  let list = [];
  if (!payload) list = [];
  else if (Array.isArray(payload)) list = payload;
  else if (Array.isArray(payload?.data)) list = payload.data;
  else if (Array.isArray(payload?.data?.data)) list = payload.data.data;
  else if (Array.isArray(payload?.coupons)) list = payload.coupons;
  else if (Array.isArray(payload?.items)) list = payload.items;
  return list.map(mapCouponRow);
};

const pushNumericId = (ids, value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isNaN(parsed) && parsed > 0) {
    ids.add(parsed);
  }
};

const parseJsonIdList = (raw, ids, push = pushNumericId) => {
  if (raw == null || raw === "") return;

  if (Array.isArray(raw)) {
    raw.forEach((entry) => push(ids, entry));
    return;
  }

  if (typeof raw === "number") {
    push(ids, raw);
    return;
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) {
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        parsed.forEach((entry) => push(ids, entry));
      } else {
        push(ids, parsed);
      }
    } catch {
      // Non-JSON display strings are ignored for ID matching.
    }
  }
};

/** Collect numeric store IDs referenced on a coupon row. */
export const parseCouponStoreIds = (coupon) => {
  const ids = new Set();

  if (!coupon || typeof coupon !== "object") {
    return [];
  }

  pushNumericId(ids, coupon.store_id);
  pushNumericId(ids, coupon?.store?.id);

  if (coupon?.coupon_type === "store_wise") {
    parseJsonIdList(coupon.data, ids);
  }

  return [...ids];
};

/** Collect numeric zone IDs referenced on a coupon row. */
export const parseCouponZoneIds = (coupon) => {
  const ids = new Set();

  if (!coupon || typeof coupon !== "object") {
    return [];
  }

  pushNumericId(ids, coupon.zone_id);

  if (Array.isArray(coupon?.zoneId)) {
    coupon.zoneId.forEach((entry) => pushNumericId(ids, entry));
  } else {
    pushNumericId(ids, coupon?.zoneId);
  }

  if (coupon?.coupon_type === "zone_wise") {
    parseJsonIdList(coupon.data, ids);
  }

  return [...ids];
};

export const parseActiveZoneIds = (zoneId) => {
  if (zoneId == null || zoneId === "") {
    return [];
  }

  if (Array.isArray(zoneId)) {
    return zoneId
      .map((entry) => Number.parseInt(entry, 10))
      .filter((entry) => !Number.isNaN(entry) && entry > 0);
  }

  if (typeof zoneId === "string") {
    const trimmed = zoneId.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((entry) => Number.parseInt(entry, 10))
            .filter((entry) => !Number.isNaN(entry) && entry > 0);
        }
      } catch {
        return [];
      }
    }
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isNaN(parsed) || parsed <= 0 ? [] : [parsed];
  }

  const parsed = Number.parseInt(zoneId, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? [] : [parsed];
};

export const getCouponModuleId = (coupon) =>
  coupon?.module_id ?? coupon?.module?.id ?? coupon?.store?.module_id ?? null;

const matchesModule = (coupon, moduleId, storeId) => {
  if (moduleId == null || moduleId === "") {
    return true;
  }

  const checkoutModuleId = Number.parseInt(moduleId, 10);
  if (Number.isNaN(checkoutModuleId)) {
    return true;
  }

  const couponModuleId = getCouponModuleId(coupon);
  if (couponModuleId == null || couponModuleId === "") {
    const normalizedStoreId = Number.parseInt(storeId, 10);
    if (Number.isNaN(normalizedStoreId)) {
      return false;
    }
    const storeIds = parseCouponStoreIds(coupon);
    return storeIds.length > 0 && storeIds.includes(normalizedStoreId);
  }

  return Number.parseInt(couponModuleId, 10) === checkoutModuleId;
};

const matchesStore = (coupon, storeId) => {
  const normalizedStoreId = Number.parseInt(storeId, 10);
  if (Number.isNaN(normalizedStoreId)) {
    return true;
  }

  const type = coupon?.coupon_type;

  if (type === "store_wise") {
    const storeIds = parseCouponStoreIds(coupon);
    return storeIds.length > 0 && storeIds.includes(normalizedStoreId);
  }

  const boundStoreIds = parseCouponStoreIds(coupon);
  if (boundStoreIds.length > 0) {
    return boundStoreIds.includes(normalizedStoreId);
  }

  return true;
};

const matchesZone = (coupon, zoneId) => {
  if (coupon?.coupon_type !== "zone_wise") {
    return true;
  }

  const couponZoneIds = parseCouponZoneIds(coupon);
  if (couponZoneIds.length === 0) {
    return true;
  }

  const activeZoneIds = parseActiveZoneIds(zoneId);
  if (activeZoneIds.length === 0) {
    return false;
  }

  return couponZoneIds.some((id) => activeZoneIds.includes(id));
};

/** True when a coupon may be used for the current checkout store/module. */
export const isCouponApplicableToCheckout = (coupon, context = {}) => {
  const { storeId, moduleId, zoneId } = context;

  if (!matchesModule(coupon, moduleId, storeId)) {
    return false;
  }

  if (!matchesZone(coupon, zoneId)) {
    return false;
  }

  if (!matchesStore(coupon, storeId)) {
    return false;
  }

  return true;
};

/** @deprecated Use filterCouponsForCheckout */
export const isCouponApplicableToStore = (coupon, storeId) =>
  isCouponApplicableToCheckout(coupon, { storeId });

export const filterCouponsForCheckout = (coupons, context = {}) => {
  if (!Array.isArray(coupons)) {
    return [];
  }

  const { storeId, moduleId, zoneId } = context;
  const hasContext =
    (storeId != null && storeId !== "") ||
    (moduleId != null && moduleId !== "") ||
    (zoneId != null && zoneId !== "");

  if (!hasContext) {
    return coupons;
  }

  return coupons.filter((coupon) => isCouponApplicableToCheckout(coupon, context));
};

/** @deprecated Use filterCouponsForCheckout */
export const filterCouponsForStore = (coupons, storeId) =>
  filterCouponsForCheckout(coupons, { storeId });

const buildCouponListUrl = ({ storeId, moduleId } = {}) => {
  const params = new URLSearchParams();
  if (storeId != null && storeId !== "") {
    params.set("store_id", String(storeId));
  }
  if (moduleId != null && moduleId !== "") {
    params.set("module_id", String(moduleId));
  }
  const query = params.toString();
  return query ? `${COUPON_LIST_PATH}?${query}` : COUPON_LIST_PATH;
};

const buildCheckoutCouponHeaders = ({ moduleId, zoneId } = {}) => {
  const headers = {};
  if (moduleId != null && moduleId !== "") {
    headers.moduleId = String(moduleId);
  }
  if (zoneId != null && zoneId !== "") {
    headers.zoneid =
      typeof zoneId === "string" ? zoneId : JSON.stringify(zoneId);
  }
  return headers;
};

export async function fetchCustomerCouponList(context = {}) {
  if (!getToken()) {
    return [];
  }

  const { storeId, moduleId, zoneId } = context;
  const isCheckoutScoped =
    (storeId != null && storeId !== "") ||
    (moduleId != null && moduleId !== "");

  const url = isCheckoutScoped
    ? buildCouponListUrl({ storeId, moduleId })
    : COUPON_LIST_PATH;

  const headers = isCheckoutScoped
    ? buildCheckoutCouponHeaders({ moduleId, zoneId })
    : undefined;

  const { data } = await MainApi.get(
    url,
    headers ? { headers } : undefined
  );
  const list = normalizeCouponListPayload(data);

  return isCheckoutScoped
    ? filterCouponsForCheckout(list, { storeId, moduleId, zoneId })
    : list;
}
