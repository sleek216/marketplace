import axios from "axios";
import { hasValidAuthToken } from "helper-functions/getToken";
// In the browser, use a relative base URL so all API calls go through
// the Next.js proxy rewrites (avoids CORS issues with the backend).
// On the server (SSR), call the backend directly.
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://marketplace.aibit.services";

/** Backend zone middleware expects JSON array, e.g. [3] not a bare 3. */
export const formatZoneIdHeader = (value) => {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) {
    return JSON.stringify(value.map(String));
  }
  const str = String(value).trim();
  if (!str || str === "null" || str === "undefined") return "";
  if (str.startsWith("[")) return str;
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String));
  } catch {
    // plain id
  }
  return JSON.stringify([str]);
};

const MainApi = axios.create({
  // In browser, force root-relative API base so nested routes
  // (e.g. /store/slug) don't prefix requests with /store/.
  baseURL: typeof window !== "undefined" ? "/" : baseUrl,
});
MainApi.interceptors.request.use(function (config) {
  let zoneid = undefined;
  let token = undefined;
  let language = undefined;
  let currentLocation = undefined;
  let software_id = 33571750;
  let hostname = process.env.NEXT_CLIENT_HOST_URL;
  let moduleid = undefined;

  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
    token = localStorage.getItem("token");
    language = JSON.parse(localStorage.getItem("language-setting"));
    currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
    moduleid = JSON.parse(localStorage.getItem("module"))?.id;
    const guestId = localStorage.getItem("guest_id");
    if (guestId && guestId !== "null" && guestId !== "undefined") {
      config.headers.guest_id = guestId;
      config.headers["guest-id"] = guestId;
      config.headers["X-guest-id"] = guestId;
    }
  }
  // Customer coupon list matches Postman: Bearer (+ localization) only.
  // moduleId / zoneid / geo headers often filter the list to [] when they
  // do not match each coupon's module_id / zone (multi-module accounts).
  const rawUrl = typeof config.url === "string" ? config.url : "";
  const url = rawUrl.replace(/^\//, "");
  const method = (config.method || "get").toLowerCase();
  const isCustomerCouponList =
    method === "get" &&
    (url === "api/v1/coupon/list" || url.startsWith("api/v1/coupon/list?"));

  if (!isCustomerCouponList) {
    if (!config.omitGeo) {
      const geo = config.latLngOverride;
      if (geo?.lat != null && geo?.lng != null) {
        config.headers.latitude = geo.lat;
        config.headers.longitude = geo.lng;
      } else {
        if (currentLocation) config.headers.latitude = currentLocation.lat;
        if (currentLocation) config.headers.longitude = currentLocation.lng;
      }
    }
    // Always send zoneid - backend requires it to identify location context.
    // omitModuleId: cross-module reads (landing catalog & all-module cart list).
    // moduleIdOverride: force a specific module (e.g. add-to-cart from marketplace card).
    if (!config.omitZoneId) {
      const zoneHeader = formatZoneIdHeader(
        config.zoneIdOverride != null && config.zoneIdOverride !== ""
          ? config.zoneIdOverride
          : zoneid
      );
      if (zoneHeader) {
        config.headers.zoneid = zoneHeader;
        config.headers.zoneId = zoneHeader;
      }
    }
    if (!config.omitModuleId) {
      if (config.moduleIdOverride) {
        config.headers.moduleId = config.moduleIdOverride;
      } else if (moduleid) {
        config.headers.moduleId = moduleid;
      } else if (url.includes("customer/cart") || url.includes("cart")) {
        config.headers.moduleId = 1;
      }
    }
  }
  if (!config.omitAuth && hasValidAuthToken(token)) {
    config.headers.authorization = `Bearer ${token}`;
  }
  if (language) config.headers["X-localization"] = language;
  if (hostname) config.headers["origin"] = hostname;
  config.headers["X-software-id"] = software_id;
  config.headers["Accept"] = 'application/json'
  config.headers["ngrok-skip-browser-warning"] = true;
  return config;
});
// MainApi.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response.status === 401) {
//             toast.error(t('Your token has been expired.please sign in again'), {
//                 id: 'error',
//             })
//             localStorage.removeItem('token')
//             store.dispatch(removeToken())
//         }
//         return Promise.reject(error)
//     }
// )

export default MainApi;
