export const HEADER_SESSION_SYNC_EVENT = "gift-marketplace-header-session-sync";

export const notifyHeaderSessionSync = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HEADER_SESSION_SYNC_EVENT));
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

