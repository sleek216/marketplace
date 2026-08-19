const DB_NAME = "gmp-store-registration";
const DB_VERSION = 1;
const STORE_NAME = "draft";
const DRAFT_KEY = "current";
const FILE_FIELDS = ["logo", "cover_photo", "tin_certificate_image"];
const PENDING_STORE_KEY = "gmp_pending_vendor_store_id";

export const savePendingStoreId = (storeId) => {
  if (typeof window === "undefined" || storeId == null || storeId === "") return;
  const value = String(storeId);
  try {
    window.sessionStorage.setItem(PENDING_STORE_KEY, value);
    window.localStorage.setItem(PENDING_STORE_KEY, value);
  } catch (_) {
    // ignore
  }
};

export const loadPendingStoreId = () => {
  if (typeof window === "undefined") return "";
  try {
    return (
      window.sessionStorage.getItem(PENDING_STORE_KEY) ||
      window.localStorage.getItem(PENDING_STORE_KEY) ||
      ""
    );
  } catch (_) {
    return "";
  }
};

export const clearPendingStoreId = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDING_STORE_KEY);
    window.localStorage.removeItem(PENDING_STORE_KEY);
  } catch (_) {
    // ignore
  }
};

const openDraftDb = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });

export const isUsableUpload = (value) =>
  value instanceof File ||
  value instanceof Blob ||
  (typeof value === "string" &&
    (value.startsWith("data:") || value.startsWith("blob:"))) ||
  Boolean(value?.__storedFile && value?.dataUrl);

const hasFilledText = (value) =>
  value != null && String(value).trim() !== "";

const hasFilledGroup = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.values(value).some((item) => hasFilledText(item));

export const draftHasFormContent = (data) => {
  if (!data || typeof data !== "object") return false;
  if (
    [
      "email",
      "phone",
      "f_name",
      "l_name",
      "tin",
      "zoneId",
      "module_id",
      "password",
      "confirm_password",
      "vat",
      "business_plan",
      "package_id",
      "store_id",
    ].some((key) => hasFilledText(data[key]))
  ) {
    return true;
  }
  if (data.tandc === true) return true;
  if (hasFilledGroup(data.restaurant_name) || hasFilledGroup(data.restaurant_address)) {
    return true;
  }
  if (hasFilledText(data.lat) && hasFilledText(data.lng)) return true;
  if (
    Array.isArray(data.pickup_zone_id)
      ? data.pickup_zone_id.length > 0
      : hasFilledText(data.pickup_zone_id)
  ) {
    return true;
  }
  return (
    isUsableUpload(data.logo) ||
    isUsableUpload(data.cover_photo) ||
    isUsableUpload(data.tin_certificate_image)
  );
};

const fileToStored = (file) =>
  new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      resolve(file || "");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        __storedFile: true,
        name: file.name || "upload",
        type: file.type || "application/octet-stream",
        lastModified: file.lastModified || Date.now(),
        dataUrl: reader.result,
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const storedToFile = (stored) => {
  if (!stored) return "";
  if (stored instanceof File || stored instanceof Blob) return stored;
  if (!stored.__storedFile || !stored.dataUrl || typeof stored.dataUrl !== "string") {
    return "";
  }
  try {
    const [meta, base64] = stored.dataUrl.split(",");
    const mime =
      stored.type ||
      (meta.match(/data:(.*?);/) || [])[1] ||
      "application/octet-stream";
    const binary = atob(base64 || "");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new File([bytes], stored.name || "upload", {
      type: mime,
      lastModified: stored.lastModified || Date.now(),
    });
  } catch {
    return "";
  }
};

export const serializeStoreRegistrationDraft = async (values, extra = {}) => {
  const next = { ...(values || {}), ...extra };
  await Promise.all(
    FILE_FIELDS.map(async (key) => {
      const current = values?.[key];
      if (current instanceof Blob) {
        next[key] = await fileToStored(current);
        return;
      }
      if (current?.__storedFile) {
        next[key] = current;
        return;
      }
      next[key] = isUsableUpload(current) ? current : "";
    })
  );
  if (next.tin_expire_date instanceof Date) {
    next.tin_expire_date = next.tin_expire_date.toISOString();
  }
  return next;
};

export const deserializeStoreRegistrationDraft = (draft) => {
  if (!draft || typeof draft !== "object") return null;
  const next = { ...draft };
  FILE_FIELDS.forEach((key) => {
    next[key] = storedToFile(draft[key]) || "";
  });
  return next;
};

export const saveStoreRegistrationDraft = async (payload) => {
  const db = await openDraftDb();
  if (!db) return;
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).put(payload, DRAFT_KEY);
  });
  db.close();
};

export const loadStoreRegistrationDraft = async () => {
  const db = await openDraftDb();
  if (!db) return null;
  const result = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    tx.onerror = () => reject(tx.error);
    const request = tx.objectStore(STORE_NAME).get(DRAFT_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return result || null;
};

export const clearStoreRegistrationDraft = async () => {
  clearPendingStoreId();
  const db = await openDraftDb();
  if (!db) return;
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).delete(DRAFT_KEY);
  });
  db.close();
};
