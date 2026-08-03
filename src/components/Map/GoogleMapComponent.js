import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import {
  alpha,
  CircularProgress,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus as AddIcon, Minus as RemoveIcon } from "lucide-react";
import { darkStyles, grayMapStyle } from "../mapColor.js";
import { getBluePinDataUrl } from "utils/mapMarkerIcon";

const GoogleMapComponent = ({
  setDisablePickButton,
  setLocationEnabled,
  setLocation,
  locationLoading,
  location,
  setPlaceDetailsEnabled,
  placeDetailsEnabled,
  setPlaceDescription,
  height,
  isModalExpand,
  left,
  bottom,
  polygonPaths,
  fromVendor,
  emphasizePickLocation = false,
  onLocationAdjusted,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const containerStyle = {
    width: "100%",
    maxHeight: isModalExpand ? "70dvh" : "50dvh",
    height: isModalExpand
      ? "90vh"
      : height
        ? height
        : isSmall
          ? "350px"
          : "350px",
    paddingBottom: "0px",
  };
  const mapRef = useRef(GoogleMap);
  const center = useMemo(
    () => ({
      lat: parseFloat(location?.lat),
      lng: parseFloat(location?.lng),
    }),
    [location?.lat, location?.lng]
  );
  const pickPinSrc = useMemo(
    () => getBluePinDataUrl(theme.palette.primary.main),
    [theme.palette.primary.main]
  );

  const options = useMemo(
    () => ({
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: theme.palette.mode === "dark" ? darkStyles : grayMapStyle,
    }),
    []
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });

  const [isMounted, setIsMounted] = useState(false);
  const [mapSetup, setMapSetup] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(polygonPaths ? 9 : 17);
  const [centerPosition, setCenterPosition] = useState(center);
  const [polygonInstance, setPolygonInstance] = useState(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (location && placeDetailsEnabled) {
      setCenterPosition(location);
    }
    if (map?.center && mapSetup) {
      setCenterPosition({
        lat: map.center?.lat(),
        lng: map.center?.lng(),
      });
    }
    setIsMounted(true);
  }, [map, mapSetup, placeDetailsEnabled, location]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleZoomIn = () => {
    if (zoom <= 21) {
      setZoom((prevZoom) => Math.min(prevZoom + 1));
    }
  };

  const handleZoomOut = () => {
    if (map && zoom >= 1) {
      setZoom((prevZoom) => Math.max(prevZoom - 1));
    }
  };

  // Effect to update polygon instance and adjust map bounds when polygonPaths change
  useEffect(() => {
    if (polygonInstance) {
      polygonInstance.setMap(null); // Remove the old polygon
    }
    if (polygonPaths?.length > 0 && map) {
      const newPolygon = new window.google.maps.Polygon({
        paths: polygonPaths,
        fillColor: theme.palette.primary.main,
        fillOpacity: 0.3,
        strokeColor: theme.palette.error.main,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map,
      });
      setPolygonInstance(newPolygon);

      newPolygon.addListener("click", (e) => {
        if (fromVendor) {
          setMapSetup(false);
          setDisablePickButton?.(false);
          setLocationEnabled?.(true);
          setLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
          setCenterPosition({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
          setPlaceDetailsEnabled(false);
          setPlaceDescription?.(undefined);
        }
      });

      // Create a LatLngBounds object to fit the polygon
      const bounds = new window.google.maps.LatLngBounds();
      polygonPaths.forEach((path) => {
        bounds.extend(new window.google.maps.LatLng(path.lat, path.lng));
      });

      // Fit the map to the new polygon bounds
      if (!fromVendor) {
        map.fitBounds(bounds);
        window.google.maps.event.addListenerOnce(map, "idle", () => {
          const c = map.getCenter();
          if (!c) return;
          setLocation({
            lat: c.lat(),
            lng: c.lng(),
          });
          setLocationEnabled?.(true);
          onLocationAdjusted?.();
        });
      }
    }
    // onLocationAdjusted intentionally omitted — often inline from parents
  }, [polygonPaths, map, fromVendor, setLocation, setLocationEnabled]);

  useEffect(() => {
    if (!map || !window.google?.maps?.event) return;
    if (polygonPaths?.length > 0) return;

    const listener = window.google.maps.event.addListenerOnce(map, "idle", () => {
      const c = map.getCenter();
      if (!c) return;
      setLocation({
        lat: c.lat(),
        lng: c.lng(),
      });
      setLocationEnabled?.(true);
      onLocationAdjusted?.();
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
    // onLocationAdjusted intentionally omitted — often inline from parents
  }, [map, polygonPaths?.length, setLocation, setLocationEnabled]);

  useEffect(() => {
    if (map && location?.lat && location?.lng) {
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.panTo({ lat, lng });
      }
    }
  }, [map, location]);

  const notifyLocationAdjusted = useCallback(() => {
    onLocationAdjusted?.();
  }, [onLocationAdjusted]);

  return isLoaded ? (
    <Stack
      padding="0px"
      sx={{
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        p: "4px",
        position: "relative",
        ...(emphasizePickLocation && {
          outline: (t) => `3px solid ${alpha(t.palette.warning.main, 0.85)}`,
          outlineOffset: "0px",
          animation: "addressMapHintPulse 2.2s ease-in-out infinite",
          "@keyframes addressMapHintPulse": {
            "0%, 100%": {
              outlineColor: alpha(theme.palette.warning.main, 0.85),
              boxShadow: `0 0 0 1px ${alpha(theme.palette.warning.main, 0.2)}`,
            },
            "50%": {
              outlineColor: alpha(theme.palette.warning.main, 0.35),
              boxShadow: `0 0 12px ${alpha(theme.palette.warning.main, 0.35)}`,
            },
          },
        }),
      }}
    >
      <Stack
        position="absolute"
        zIndex={5}
        left={left ? left : "15px"}
        bottom={bottom ? bottom : "6%"}
        direction="column"
        spacing={1}
      >
        <IconButton
          sx={{
            background: (theme) => theme.palette.neutral[100],
            "&:hover": {
              background: (theme) => alpha(theme.palette.neutral[100], 0.8),
            },
          }}
          padding={{ xs: "3px", sm: "5px" }}
          onClick={handleZoomIn}
          disabled={zoom > 21}
        >
          <AddIcon
            size={18}
            color={theme.palette.primary.main}
            strokeWidth={2.2}
          />
        </IconButton>
        <IconButton
          sx={{
            background: (theme) => theme.palette.neutral[100],
            "&:hover": {
              background: (theme) => alpha(theme.palette.neutral[100], 0.8),
            },
          }}
          padding={{ xs: "3px", sm: "5px" }}
          onClick={handleZoomOut}
          disabled={zoom < 1}
        >
          <RemoveIcon
            size={18}
            color={theme.palette.primary.main}
            strokeWidth={2.2}
          />
        </IconButton>
      </Stack>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={map ? undefined : (center ?? centerPosition)}
        onLoad={onLoad}
        zoom={zoom}
        onUnmount={onUnmount}
        onMouseDown={() => {
          setMapSetup(true);
          setDisablePickButton?.(true);
        }}
        onMouseUp={() => {
          setMapSetup(false);
          setDisablePickButton?.(false);
          setLocationEnabled?.(true);
          setLocation({
            lat: map.center?.lat(),
            lng: map.center?.lng(),
          });
          setCenterPosition({
            lat: map.center?.lat(),
            lng: map.center?.lng(),
          });
          setPlaceDetailsEnabled(false);
          setPlaceDescription?.(undefined);
          notifyLocationAdjusted();
        }}
        onZoomChanged={() => {
          if (map) {
            setLocationEnabled?.(true);
            setLocation({
              lat: map.center?.lat(),
              lng: map.center?.lng(),
            });
            setCenterPosition({
              lat: map.center?.lat(),
              lng: map.center?.lng(),
            });
            notifyLocationAdjusted();
          }
        }}
        onDragEnd={() => {
          if (map) {
            setMapSetup(false);
            setDisablePickButton?.(false);
            setLocationEnabled?.(true);
            setLocation({
              lat: map.center?.lat(),
              lng: map.center?.lng(),
            });
            setCenterPosition({
              lat: map.center?.lat(),
              lng: map.center?.lng(),
            });
            setPlaceDetailsEnabled(false);
            setPlaceDescription?.(undefined);
            notifyLocationAdjusted();
          }
        }}
        onClick={(e) => {
          if (fromVendor) {
            setMapSetup(false);
            setDisablePickButton?.(false);
            setLocationEnabled?.(true);
            setLocation({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
            setCenterPosition({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
            setPlaceDetailsEnabled(false);
            setPlaceDescription?.(undefined);
            notifyLocationAdjusted();
          }
        }}
        options={options}
      >
        {!locationLoading ? (
          <img
            src={pickPinSrc}
            style={{
              zIndex: 3,
              position: "absolute",
              marginTop: -63,
              marginLeft: -32,
              left: "50%",
              top: "50%",
              height: "60px",
              width: "45px",
              pointerEvents: "none",
            }}
            alt="map"
          />
        ) : (
          <Stack
            alignItems="center"
            style={{
              zIndex: 3,
              position: "absolute",
              marginTop: -37,
              marginLeft: -11,
              left: "50%",
              top: "50%",
            }}
          >
            <CircularProgress />
          </Stack>
        )}
      </GoogleMap>
    </Stack>
  ) : (
    <></>
  );
};

export default GoogleMapComponent;
