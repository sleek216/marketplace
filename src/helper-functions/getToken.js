export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
};

export const hasValidAuthToken = (token) => {
  if (typeof token !== "string") return false;
  const normalized = token.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "null" && normalized !== "undefined";
};

export const getGuestId = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("guest_id");
  }
};
