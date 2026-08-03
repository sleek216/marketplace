import { useQuery } from "react-query";
import { geocode_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import {
  formatLatLngLabel,
  reverseGeocodeWithFallback,
} from "helper-functions/reverseGeocodeFallback";

const getGeoCode = async (location) => {
  if (!location?.lat || !location?.lng) {
    return null;
  }

  try {
    const { data } = await MainApi.get(
      `${geocode_api}?lat=${location.lat}&lng=${location.lng}`
    );
    if (data?.results?.length > 0) {
      return data;
    }
  } catch {
    // Backend geocode failed — try fallback below.
  }

  const fallback = await reverseGeocodeWithFallback(location);
  if (fallback?.results?.length > 0) {
    return fallback;
  }

  const coordsLabel = formatLatLngLabel(location);
  if (coordsLabel) {
    return {
      results: [{ formatted_address: coordsLabel }],
      status: "FALLBACK",
    };
  }

  return null;
};

export default function useGetGeoCode(location, geoLocationEnable) {
  return useQuery(["geo-code", location], () => getGeoCode(location), {
    enabled: Boolean(
      geoLocationEnable && location?.lat != null && location?.lng != null
    ),
    retry: 1,
  });
}
