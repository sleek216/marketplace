/** Shared SSR fetch for config + landing page (used by / and /home). */

export async function fetchConfigAndLandingPage(req, res) {
  const language = req.cookies?.languageSetting;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  const headers = {
    "X-software-id": 33571750,
    "X-server": "server",
    "X-localization": language,
    origin: process.env.NEXT_CLIENT_HOST_URL,
  };

  const timeoutMs = Number(process.env.NEXT_PUBLIC_SSP_FETCH_TIMEOUT_MS) || 8000;
  const fetchSignal =
    typeof AbortSignal !== "undefined" && AbortSignal.timeout
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  const fetchJson = async (path) => {
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not set");
    }
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers,
      ...(fetchSignal ? { signal: fetchSignal } : {}),
    });
    if (!response.ok) {
      throw new Error(`${path} failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  const [configResult, landingResult] = await Promise.allSettled([
    fetchJson("/api/v1/config"),
    fetchJson("/api/v1/react-landing-page"),
  ]);

  const config = configResult.status === "fulfilled" ? configResult.value : null;
  const landingPageData =
    landingResult.status === "fulfilled" ? landingResult.value : null;

  if (configResult.status === "rejected") {
    console.warn(
      "[SSR] /api/v1/config:",
      configResult.reason?.cause?.message ||
        configResult.reason?.message ||
        configResult.reason
    );
  }
  if (landingResult.status === "rejected") {
    console.warn(
      "[SSR] /api/v1/react-landing-page:",
      landingResult.reason?.cause?.message ||
        landingResult.reason?.message ||
        landingResult.reason
    );
  }

  if (res) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
  }

  return {
    configData: config ?? {},
    landingPageData: landingPageData ?? {},
  };
}
