import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { AlertCircle as ErrorIcon } from "lucide-react";
import GoogleMapComponent from "components/Map/GoogleMapComponent";
import { useSelector } from "react-redux";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useGetGeoCode from "api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetPlaceDetails from "api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import useGetAutocompletePlace from "api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import useGetCheckZone from "api-manage/hooks/react-query/google-api/useGetCheckZone";
import CustomMapSearch from "components/Map/CustomMapSearch";
import { CustomTypography } from "components/landing-page/hero-section/HeroSection.style";
import ModalExtendShrink from "components/Map/ModalExtendShrink";
import {
  isNullIslandPlaceholder,
  normalizeLatLng,
} from "components/address/add-new-address/addressTypeUtils";

const MapForRestaurantJoin = ({
  handleLocation,
  zoneId,
  polygonPaths,
  inZoom,
  restaurantAddressHandler,
  setInZone,
  searchHeight,
  zoneHandler,
  fromVendor,
  showZoneWarning,
  setShowZoneWarning,
  inZone,
  externalLocation,
  initialLocation,
}) => {
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState(() => {
    const fromProp = normalizeLatLng(initialLocation);
    const fromConfig = normalizeLatLng(configData?.default_location);
    const seed = fromProp || fromConfig;
    if (seed && !isNullIslandPlaceholder(seed.lat, seed.lng)) return seed;
    return fromConfig || null;
  });
  const geoFallbackAttemptedRef = useRef(false);
  const [searchKey, setSearchKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(true);
  const [placeDescription, setPlaceDescription] = useState(undefined);
  const [predictions, setPredictions] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [isModalExpand, setIsModalExpand] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [autocompleteSelection, setAutocompleteSelection] = useState(null);
  const skipGeoSearchSyncRef = useRef(false);
  const skipInitialAddressSyncRef = useRef(
    Boolean(normalizeLatLng(initialLocation))
  );
  const { t } = useTranslation();

  const applyLocationFromMapOrGps = useCallback((loc) => {
    skipGeoSearchSyncRef.current = false;
    setLocation(loc);
  }, []);
  useEffect(() => {
    const fromInitial = normalizeLatLng(initialLocation);
    if (
      fromInitial &&
      !isNullIslandPlaceholder(fromInitial.lat, fromInitial.lng)
    ) {
      applyLocationFromMapOrGps(fromInitial);
      setLocationEnabled(true);
      return;
    }
    const fromConfig = normalizeLatLng(configData?.default_location);
    if (
      fromConfig &&
      !isNullIslandPlaceholder(fromConfig.lat, fromConfig.lng)
    ) {
      applyLocationFromMapOrGps(fromConfig);
      setLocationEnabled(true);
    }
  }, [configData?.default_location, initialLocation, applyLocationFromMapOrGps]);

  useEffect(() => {
    const current = normalizeLatLng(location);
    if (
      current &&
      !isNullIslandPlaceholder(current.lat, current.lng)
    ) {
      return;
    }
    if (geoFallbackAttemptedRef.current) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    geoFallbackAttemptedRef.current = true;
    const timer = window.setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyLocationFromMapOrGps({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationEnabled(true);
        },
        () => {},
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 300000,
        }
      );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [location?.lat, location?.lng, applyLocationFromMapOrGps]);

  useEffect(() => {
    const lat = Number(location?.lat);
    const lng = Number(location?.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setLocationEnabled(true);
    }
  }, [location?.lat, location?.lng]);

  // When the user types an address manually, we can pass resolved lat/lng here.
  // This makes validation behave the same as selecting a place from the map search bar.
  useEffect(() => {
    if (
      typeof externalLocation?.lat === "number" &&
      typeof externalLocation?.lng === "number"
    ) {
      applyLocationFromMapOrGps({
        lat: externalLocation.lat,
        lng: externalLocation.lng,
      });
      setLocationEnabled(true);
    }
  }, [externalLocation, applyLocationFromMapOrGps]);
  const { data: places, isLoading } = useGetAutocompletePlace(
    searchKey,
    enabled
  );

  useEffect(() => {
    if (places) {
      const tempData = places?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions(tempData);
    }
  }, [places]);
  const zoneIdEnabled = locationEnabled;
  const { data: zoneData } = useGetZoneId(location, zoneIdEnabled);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        localStorage.setItem("zoneid", zoneData?.zone_id);
        if (zoneData?.zone_id && zoneData?.zone_data?.[0]?.id) {
          zoneHandler?.(zoneData?.zone_data?.[0]?.id);
        }
      }
    }
  }, [zoneData]);
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    placeId,
    placeDetailsEnabled
  );
  //

  useEffect(() => {
    if (placeDetails) {
      applyLocationFromMapOrGps({
        lat: placeDetails?.location?.latitude,
        lng: placeDetails?.location?.longitude,
      });
      setLocationEnabled(true);
    }
  }, [placeDetails, applyLocationFromMapOrGps]);
  const successHandler = (res) => {
    setInZone(res);

    if (!res && res !== undefined) {
      setShowZoneWarning(true);
      zoneHandler?.(null);
      //restaurantAddressHandler?.(null);
    } else {
      setShowZoneWarning(false);
    }
  };
  const { data: checkedData } = useGetCheckZone(
    location,
    zoneId,
    successHandler
  );
  const { data: geoCodeResults, isFetching: isFetchingGeoCodes } =
    useGetGeoCode(location, locationEnabled);

  useEffect(() => {
    const addr = geoCodeResults?.results?.[0]?.formatted_address;
    if (!addr) return;
    if (skipGeoSearchSyncRef.current) return;
    setSearchInputText(addr);
    setAutocompleteSelection(null);
    // Keep read-only "Business Address" in sync with the map search bar (same reverse-geocode line).
    if (!showZoneWarning) {
      restaurantAddressHandler?.(addr);
    }
    // restaurantAddressHandler is stable enough in practice; omit from deps to avoid re-running on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoCodeResults, showZoneWarning]);

  useEffect(() => {
    const formattedAddress = geoCodeResults?.results?.[0]?.formatted_address;
    const shouldSyncAddress = showZoneWarning || polygonPaths?.length > 0;

    if (skipInitialAddressSyncRef.current && shouldSyncAddress) {
      skipInitialAddressSyncRef.current = false;
      handleLocation(location);
      if (formattedAddress && !showZoneWarning) {
        restaurantAddressHandler?.(formattedAddress);
      }
      return;
    }

    if (showZoneWarning) {
      restaurantAddressHandler?.(null);
    } else if (formattedAddress) {
      restaurantAddressHandler(formattedAddress);
    }

    handleLocation(location);
  }, [geoCodeResults, showZoneWarning, polygonPaths]);

  const handleSearchInputChange = (event, newInputValue, reason) => {
    if (reason === "input") {
      skipGeoSearchSyncRef.current = Boolean(newInputValue?.length);
      setSearchInputText(newInputValue ?? "");
      if (newInputValue) {
        setSearchKey(newInputValue);
        setEnabled(true);
        setPlaceDetailsEnabled(true);
      } else {
        setSearchKey("");
        setEnabled(false);
      }
      setAutocompleteSelection(null);
    } else if (reason === "clear") {
      skipGeoSearchSyncRef.current = false;
      setSearchInputText("");
      setSearchKey("");
      setEnabled(false);
      setPlaceId("");
      setAutocompleteSelection(null);
      setPredictions([]);
    } else if (reason === "reset") {
      setSearchInputText(newInputValue ?? "");
    }
  };

  const handleAutocompleteChange = (event, value) => {
    skipGeoSearchSyncRef.current = false;
    if (value && typeof value === "object" && value.place_id) {
      setPlaceId(value.place_id);
      setAutocompleteSelection(value);
      setSearchInputText(value.description || "");
    }
    setPlaceDetailsEnabled(true);
  };

  const handleCloseSearchBar = () => {
    skipGeoSearchSyncRef.current = false;
    setSearchInputText("");
    setSearchKey("");
    setEnabled(false);
    setPlaceId("");
    setAutocompleteSelection(null);
    setPredictions([]);
  };
  return (
    <CustomStackFullWidth>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          padding: { xs: ".75rem", sm: "1rem" },
          borderRadius: { xs: ".25rem", sm: "10px" },
        }}>
        <Stack mb={2}>
          <Typography
            variant="body1"
            fontWeight={500}
            mb={".125rem"}
          >
            {t("Set Your Business Location on Map")}
          </Typography>
          <Typography
            variant="body2"
            fontSize="0.625rem !important"
          >
            {t("Please mark the exact location of your business so customers can easily find you.")}
          </Typography>
        </Stack>
        <CustomStackFullWidth sx={{ position: "relative" }}>
          <CustomStackFullWidth
            sx={{
              right: "10px",
              position: "absolute",
              zIndex: 999,
              maxWidth: "250px",
              top: "10px",
            }}
          >
            <CustomMapSearch
              newMap
              handleCloseLocation={handleCloseSearchBar}
              frommap="false"
              setSearchKey={setSearchKey}
              setEnabled={setEnabled}
              predictions={predictions}
              setPlaceId={setPlaceId}
              setPlaceDetailsEnabled={setPlaceDetailsEnabled}
              setPlaceDescription={setPlaceDescription}
              handleChange={handleAutocompleteChange}
              currentLocationValue={autocompleteSelection}
              inputValue={searchInputText}
              onInputChange={handleSearchInputChange}
              searchHeight={searchHeight}
            />
          </CustomStackFullWidth>
          <GoogleMapComponent
            setLocation={applyLocationFromMapOrGps}
            location={location}
            setPlaceDetailsEnabled={setPlaceDetailsEnabled}
            placeDetailsEnabled={placeDetailsEnabled}
            locationEnabled={locationEnabled}
            setPlaceDescription={setPlaceDescription}
            setLocationEnabled={setLocationEnabled}
            height="250px"
            polygonPaths={polygonPaths}
            inZoom={inZoom}
            isModalExpand={isModalExpand}
            setIsModalExpand={setIsModalExpand}
            fromVendor={fromVendor}

          />
          <CustomStackFullWidth
            sx={{
              position: "absolute",
              bottom: "44%",
              left: { xs: "6%", sm: "3%" },
              right: "0px",
              zIndex: 999,
              maxWidth: "35px",
            }}
          >
            <ModalExtendShrink
              isModalExpand={isModalExpand}
              setIsModalExpand={setIsModalExpand}
              t={t}
            />
          </CustomStackFullWidth>
          {showZoneWarning || !inZone ? (
            <Box
              sx={{
                position: "absolute",
                bottom: "4%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.neutral[800],
                padding: "8px 12px",
                borderRadius: ".5rem",
                gap: "5px",
                width: "max-content",
                maxWidth: "95%",
              }}
            >
              <ErrorIcon sx={{ color: theme.palette.warning.main, fontSize: "20px" }} />
              <Typography
                variant="body2"
                sx={{ color: theme.palette.neutral[100], fontSize: "12px", fontWeight: 500 }}
              >
                {t("Please place the marker inside the available zones.")}
              </Typography>
            </Box>
          ) : (
            <CustomStackFullWidth
              sx={{
                position: "absolute",
                bottom: "4%",
                left: "0",
                right: "0",
                zIndex: 999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Stack direction="row" spacing={{ xs: 1, sm: 2 }} backgroundColor={theme.palette.neutral[100]} paddingX='5px' borderRadius='3px'>
                <CustomTypography sx={{ fontSize: { xs: '10px', sm: '12px' } }}>Latitude: {Number(location?.lat)?.toFixed(7)}</CustomTypography>
                <CustomTypography sx={{ fontSize: { xs: '10px', sm: '12px' } }}>Longitude: {Number(location?.lng)?.toFixed(7)}</CustomTypography>
              </Stack>
            </CustomStackFullWidth>
          )}
        </CustomStackFullWidth>
      </Box>
    </CustomStackFullWidth>
  );
};
export default MapForRestaurantJoin;
