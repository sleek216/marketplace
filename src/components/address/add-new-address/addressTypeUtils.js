/**
 * Normalizes API/UI address labels to home | office | other for icons and payloads.
 */
export function normalizeAddressTypeKey(value) {
  if (value == null || value === "") return "";
  const s = String(value).trim().toLowerCase();
  if (s === "others") return "other";
  return s;
}

/** Default when adding a new address so API always receives a type */
export const DEFAULT_ADDRESS_TYPE = "home";

/** `{ lat, lng }` from saved address records (`lat`/`lng` or `latitude`/`longitude`) */
export function coordsFromSavedAddress(rec) {
  if (!rec) return null;
  const latRaw = rec.lat ?? rec.latitude;
  const lngRaw = rec.lng ?? rec.longitude;
  if (latRaw == null || lngRaw == null || latRaw === "" || lngRaw === "")
    return null;
  const lat = typeof latRaw === "number" ? latRaw : parseFloat(String(latRaw));
  const lng = typeof lngRaw === "number" ? lngRaw : parseFloat(String(lngRaw));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

/** Parses lat/lng objects or strings; returns null if invalid */
export function normalizeLatLng(loc) {
  return coordsFromSavedAddress(loc);
}

/** Empty form fields become 0 — treat as “no coordinates” for map seeding */
export function isNullIslandPlaceholder(lat, lng) {
  return lat === 0 && lng === 0;
}
