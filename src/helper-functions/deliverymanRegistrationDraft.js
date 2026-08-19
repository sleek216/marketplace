const DB_NAME = "gmp-deliveryman-registration";
const DB_VERSION = 1;
const STORE_NAME = "draft";
const DRAFT_KEY = "current";

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

export const draftHasFormContent = (data) => {
  if (!data || typeof data !== "object") return false;
  if (
    [
      "f_name",
      "l_name",
      "email",
      "earning",
      "referral_code",
      "zone_id",
      "vehicle_id",
      "identity_number",
      "phone",
      "password",
      "confirm_password",
    ].some((key) => hasFilledText(data[key]))
  ) {
    return true;
  }
  if (data.tandc === true) return true;
  if (isUsableUpload(data.image)) return true;
  const identity = data.identity_image;
  if (Array.isArray(identity)) return identity.some((item) => isUsableUpload(item));
  return isUsableUpload(identity);
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

const toStoredList = async (value) => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return Promise.all(
    list.map(async (item) => {
      if (item instanceof Blob) return fileToStored(item);
      if (item?.__storedFile) return item;
      return null;
    })
  );
};

const fromStoredList = (value) => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => storedToFile(item) || null);
};

export const serializeDeliverymanRegistrationDraft = async (values) => {
  const next = { ...(values || {}) };
  const currentImage = values?.image;
  if (currentImage instanceof Blob) {
    next.image = await fileToStored(currentImage);
  } else if (currentImage?.__storedFile) {
    next.image = currentImage;
  } else {
    next.image = isUsableUpload(currentImage) ? currentImage : "";
  }
  next.identity_image = await toStoredList(values?.identity_image);
  return next;
};

export const deserializeDeliverymanRegistrationDraft = (draft) => {
  if (!draft || typeof draft !== "object") return null;
  const image = storedToFile(draft.image) || "";
  const identity_image = fromStoredList(draft.identity_image);
  return {
    ...draft,
    zone_id: draft.zone_id != null && draft.zone_id !== "" ? String(draft.zone_id) : "",
    vehicle_id:
      draft.vehicle_id != null && draft.vehicle_id !== ""
        ? String(draft.vehicle_id)
        : "",
    earning: draft.earning != null && draft.earning !== "" ? String(draft.earning) : "",
    image,
    identity_image,
  };
};

export const saveDeliverymanRegistrationDraft = async (payload) => {
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

export const loadDeliverymanRegistrationDraft = async () => {
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

export const clearDeliverymanRegistrationDraft = async () => {
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
