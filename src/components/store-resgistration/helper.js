export const getZoneWiseModule = (data, zoneId) => {
  const result = data?.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return zoneIds?.includes(zoneId);
  });
  return result;
};

/**
 * Map pins use { lat, lng }. An older form stored those swapped
 * (formik.lat = map lng). Undo that when values are clearly inverted.
 */
export const resolveStoreLatLng = (lat, lng) => {
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { lat: lat ?? "", lng: lng ?? "" };
  }
  if (Math.abs(a) > 90 && Math.abs(b) <= 90) {
    return { lat: b, lng: a };
  }
  // Typical PK mix-up: 74 stored as lat, 32 stored as lng.
  if (a >= 50 && a <= 90 && b >= 10 && b <= 45) {
    return { lat: b, lng: a };
  }
  return { lat: a, lng: b };
};
