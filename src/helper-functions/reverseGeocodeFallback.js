/**
 * Reverse-geocode when Laravel / Google geocode-api returns empty (e.g. billing off).
 * Uses OpenStreetMap Nominatim — same shape as backend geocode response.
 */
export async function reverseGeocodeWithFallback(location) {
  if (location?.lat == null || location?.lng == null) {
    return null;
  }

  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: "json",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            process.env.NEXT_PUBLIC_NOMINATIM_USER_AGENT ||
            "GiftMarketplace-Web/1.0 (contact: support@giftmarketplace.local)",
        },
      }
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const display = data?.display_name;
    if (!display) {
      return null;
    }
    return {
      results: [{ formatted_address: display }],
      status: "OK",
    };
  } catch {
    return null;
  }
}

export function formatLatLngLabel(location) {
  if (location?.lat == null || location?.lng == null) {
    return "";
  }
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return "";
  }
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function normalizeConfigDefaultLocation(defaultLocation) {
  if (!defaultLocation) {
    return null;
  }
  const lat = Number(defaultLocation.lat);
  const lng = Number(defaultLocation.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }
  return { lat, lng };
}
