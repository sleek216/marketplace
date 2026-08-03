/**
 * Lightweight helper that performs an API GET with an explicitly overridden
 * moduleId header. This bypasses the MainApi interceptor's localStorage read
 * so we can fetch data for any module regardless of the currently-active one.
 */
import axios from "axios";
import { baseUrl } from "./MainApi";

export const fetchForModule = async (path, moduleId) => {
  const headers = {
    Accept: "application/json",
    "X-software-id": 33571750,
    "ngrok-skip-browser-warning": true,
    moduleId: moduleId,
  };

  if (typeof window !== "undefined") {
    const zoneid = localStorage.getItem("zoneid");
    const token = localStorage.getItem("token");
    const language = JSON.parse(localStorage.getItem("language-setting") || "null");
    const loc = JSON.parse(localStorage.getItem("currentLatLng") || "null");

    if (zoneid) headers.zoneid = zoneid;
    if (token) headers.authorization = `Bearer ${token}`;
    if (language) headers["X-localization"] = language;
    if (loc?.lat) headers.latitude = loc.lat;
    if (loc?.lng) headers.longitude = loc.lng;
  }

  const base = typeof window !== "undefined" ? "" : baseUrl;
  const { data } = await axios.get(`${base}${path}`, { headers });
  return data;
};
