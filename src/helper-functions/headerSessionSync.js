import toast from "react-hot-toast";
import { t } from "i18next";

export const HEADER_SESSION_SYNC_EVENT = "gift-marketplace-header-session-sync";
export const OPEN_LOCATION_POPOVER_EVENT = "gift-marketplace-open-location-popover";

export const notifyHeaderSessionSync = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HEADER_SESSION_SYNC_EVENT));
};

export const notifyOpenLocationPopover = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_LOCATION_POPOVER_EVENT));
};

export const isUserLocationSet = () => {
  if (typeof window === "undefined") return false;
  const loc = localStorage.getItem("location");
  return Boolean(loc && loc.trim() !== "" && loc !== "Default Location");
};

export const checkLocationBeforeCart = () => {
  if (!isUserLocationSet()) {
    toast.error(t("Please select your location first."));
    notifyOpenLocationPopover();
    return false;
  }
  return true;
};

export const clearUserSessionData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("cartList");
  localStorage.removeItem("location");
  localStorage.removeItem("locationLabel");
  localStorage.removeItem("currentLatLng");
  localStorage.removeItem("zoneid");
  localStorage.removeItem("wallet_amount");
  notifyHeaderSessionSync();
};

