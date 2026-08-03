import { getCurrentModuleType } from "./getCurrentModuleType";
import { getModuleId } from "./getModuleId";

const STORE_PREVIEW_PREFIX = "store-preview:";

export const getStoreIdFromPath = () => {
  if (typeof window === "undefined") return null;
  return window.location.pathname.match(/^\/store\/([^/?#]+)/)?.[1] ?? null;
};

export const getStoreLookupKeys = (store = {}) => {
  const keys = new Set();
  if (store?.slug) keys.add(String(store.slug));
  if (store?.id != null) keys.add(String(store.id));
  return [...keys];
};

export const buildStoreQuery = (store = {}) => {
  const id = store?.slug ?? store?.id;
  if (!id) return null;

  const query = {
    id: `${id}`,
    module_id: `${store?.module_id ?? getModuleId()}`,
    module_type: getCurrentModuleType(),
  };

  if (store?.zone_id != null) {
    query.store_zone_id = `${store.zone_id}`;
  }
  if (store?.distance != null) {
    query.distance = store.distance;
  }

  if (typeof window !== "undefined") {
    try {
      const latLng = JSON.parse(localStorage.getItem("currentLatLng") || "null");
      if (latLng?.lat) query.lat = latLng.lat;
      if (latLng?.lng) query.lng = latLng.lng;
    } catch {
      // ignore parse errors
    }
  }

  return query;
};

export const buildStoreHref = (store) => {
  const query = buildStoreQuery(store);
  if (!query) return null;
  return { pathname: "/store/[id]", query };
};

export const cacheStorePreview = (store) => {
  if (typeof window === "undefined" || !store) return;
  const payload = JSON.stringify(store);
  getStoreLookupKeys(store).forEach((key) => {
    try {
      sessionStorage.setItem(`${STORE_PREVIEW_PREFIX}${key}`, payload);
    } catch {
      // ignore quota errors
    }
  });
};

export const getCachedStorePreview = (storeId) => {
  if (typeof window === "undefined" || !storeId) return null;
  const keys = [String(storeId)];
  try {
    for (const key of keys) {
      const raw = sessionStorage.getItem(`${STORE_PREVIEW_PREFIX}${key}`);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    return null;
  }
  return null;
};

export const prepareStoreNavigation = (store) => {
  if (typeof window === "undefined" || !store) return;

  if (store?.zone_id != null) {
    const zoneId = parseInt(store.zone_id, 10);
    if (!Number.isNaN(zoneId)) {
      localStorage.setItem("zoneid", `[${zoneId}]`);
    }
  }

  cacheStorePreview(store);
};
