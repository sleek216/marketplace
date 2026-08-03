/**
 * Pusher-protocol WebSocket client for Laravel Reverb (backend lives elsewhere).
 * Uses npm packages `laravel-echo` + `pusher-js` — JS clients only, no Laravel in this repo.
 */
import Echo from "laravel-echo";
import Pusher from "pusher-js";

/**
 * Parse GET /api/v1/config fields: websocket_status, websocket_url, websocket_port, websocket_key
 */
export function parseReverbConfig(configData) {
  if (!configData || Number(configData.websocket_status) !== 1) {
    return { enabled: false };
  }
  const key = configData.websocket_key;
  const rawUrl = configData.websocket_url || "";
  const portRaw = configData.websocket_port;

  if (!key || !String(key).trim() || !rawUrl) {
    return { enabled: false };
  }

  let host = "";
  let forceTLS = true;
  let port = 443;

  try {
    const normalized = /^https?:\/\//i.test(rawUrl)
      ? rawUrl
      : /^wss?:\/\//i.test(rawUrl)
        ? rawUrl.replace(/^wss/i, "https").replace(/^ws/i, "http")
        : `https://${rawUrl}`;
    const u = new URL(normalized);
    host = u.hostname;
    forceTLS =
      u.protocol === "https:" || /^wss/i.test(String(configData.websocket_url));
    if (portRaw !== undefined && portRaw !== null && portRaw !== "") {
      port = Number(portRaw);
    } else if (u.port) {
      port = Number(u.port);
    } else {
      port = forceTLS ? 443 : 80;
    }
  } catch {
    return { enabled: false };
  }

  return { enabled: true, key: String(key).trim(), host, port, forceTLS };
}

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Create one Echo instance (Reverb / Pusher-compatible).
 */
export function createReverbEcho(configData) {
  const parsed = parseReverbConfig(configData);
  if (!parsed.enabled || typeof window === "undefined") {
    return null;
  }

  window.Pusher = Pusher;

  const apiBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

  return new Echo({
    broadcaster: "reverb",
    key: parsed.key,
    wsHost: parsed.host,
    wsPort: parsed.port,
    wssPort: parsed.port,
    forceTLS: parsed.forceTLS,
    enabledTransports: ["ws", "wss"],
    disableStats: true,
    authEndpoint: apiBase ? `${apiBase}/broadcasting/auth` : "/broadcasting/auth",
    auth: {
      headers: authHeaders(),
    },
  });
}

let echoRef = null;

export function setReverbEchoInstance(instance) {
  echoRef = instance;
}

export function getReverbEchoInstance() {
  return echoRef;
}

export function disconnectReverbEcho() {
  if (echoRef) {
    try {
      echoRef.disconnect();
    } catch {
      /* ignore */
    }
    echoRef = null;
  }
}
