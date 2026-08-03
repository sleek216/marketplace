export const HEADER_SESSION_SYNC_EVENT = "gift-marketplace-header-session-sync";

export const notifyHeaderSessionSync = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HEADER_SESSION_SYNC_EVENT));
};
