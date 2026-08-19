/**
 * Laravel serves `/payment/{gateway}/pay` and fetches `/payment/stripe/token`
 * using its configured website URL. Proxying that page through Next on
 * `http://localhost:3000` makes Stripe.js call `https://localhost:3000/...`
 * which fails (ERR_SSL_PROTOCOL_ERROR / Failed to fetch).
 *
 * Always send payment pages to the API host (HTTPS, no :3000).
 */
export const normalizePaymentRedirectLink = (redirectLink) => {
  if (!redirectLink) return redirectLink;
  try {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const parsed = new URL(String(redirectLink), origin);
    const isPaymentPath = parsed.pathname.startsWith("/payment");
    const apiBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

    if (isPaymentPath && apiBase) {
      const api = new URL(apiBase);
      parsed.protocol = api.protocol;
      parsed.hostname = api.hostname;
      parsed.port = api.port || "";
      return parsed.toString();
    }

    const isLocalHost =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (typeof window !== "undefined" && isLocalHost) {
      parsed.protocol = window.location.protocol || "http:";
      parsed.hostname = window.location.hostname;
      parsed.port = window.location.port || "";
    } else if (parsed.port === "3000" && !isLocalHost) {
      parsed.port = "";
    }

    return parsed.toString();
  } catch {
    return redirectLink;
  }
};
