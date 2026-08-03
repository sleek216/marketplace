import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  alpha,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import {
  HeroFormInputWrapper,
  HeroFormItem,
  StyledButton,
} from "./HeroSection.style";
import { useGeolocated } from "react-geolocated";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import AllowLocationDialog from "../../Map/AllowLocationDialog";
import CustomMapSearch from "../../Map/CustomMapSearch";
import ModuleSelectionRaw from "./module-selection/ModuleSelectionRaw";
import { useDispatch, useSelector } from "react-redux";
import { normalizeConfigDefaultLocation } from "helper-functions/reverseGeocodeFallback";
import { module_select_success } from "utils/toasterMessages";
import { setWishList } from "redux/slices/wishList";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { getToken } from "helper-functions/getToken";
import { Box } from "@mui/system";
import { Navigation as GpsFixedIcon, ChevronUp as KeyboardArrowUpIcon, ChevronDown as KeyboardArrowDownIcon, Map as MapIcon, Search as SearchIcon } from "lucide-react";
import { getLanguage } from "helper-functions/getLanguage";
import MapMarkerIcon from "../assets/MapMarkerIcon";
import dynamic from "next/dynamic";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { notifyHeaderSessionSync } from "helper-functions/headerSessionSync";
const MapModal = dynamic(() => import("../../Map/MapModal"));
const HeroLocationForm = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down(600));
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(undefined);
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(false);
  const [placeId, setPlaceId] = useState("");
  const [placeDescription, setPlaceDescription] = useState(undefined);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false);
  const [openModuleSelection, setOpenModuleSelection] = useState(false);
  const [pickLocation, setPickLocation] = useState(false);
  const [isSelectedByGps, setIsSelectedByGps] = useState(false);
  const dispatch = useDispatch();
  const { configData } = useSelector((state) => state.configData);
  const divId = useId();
  const excludedDivRef = useRef(null);
  const hasAutoRequestedLocation = useRef(false);
  const hasAutoAppliedLocation = useRef(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);

  //****getting current location/***/
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    getPosition,
    positionError,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 8000,
    isGeolocationEnabled: true,
  });

  const applyDefaultLocationFromConfig = useCallback(() => {
    if (hasAutoAppliedLocation.current) {
      return false;
    }
    const defaults = normalizeConfigDefaultLocation(configData?.default_location);
    if (!defaults) {
      return false;
    }
    setLocation(defaults);
    setOpenLocation(false);
    setShowCurrentLocation(true);
    setGeoLocationEnable(true);
    setZoneIdEnabled(true);
    hasAutoAppliedLocation.current = true;
    return true;
  }, [configData?.default_location]);

  const handleCloseLocation = () => {
    setOpenLocation(false);
    setShowCurrentLocation(false);
    setGeoLocationEnable(false);
    setCurrentLocation(undefined);
    setZoneIdEnabled(false);
    setLocation(undefined);
    setIsSelectedByGps(false);
    if (typeof window !== "undefined") {
      if (zoneData) {
        localStorage.removeItem("zoneid");
      }
    }
  };
  const handleCloseLocation1 = () => {
    setPlaceId("");
    setShowCurrentLocation(false);
    setPlaceDescription(undefined);
    setZoneIdEnabled(true);
    setGeoLocationEnable(false);
    setCurrentLocation(undefined);
    setPlaceDetailsEnabled(false);
    setLocation(false);
  };
  const handleAgreeLocation = (e) => {
    e.stopPropagation();
    if (coords) {
      setLocation({ lat: coords?.latitude, lng: coords?.longitude });
      setOpenLocation(false);
      setShowCurrentLocation(true);
      setGeoLocationEnable(true);
      setZoneIdEnabled(true);
      setIsSelectedByGps(true);
    } else {
      setOpenLocation(true);
    }
  };

  const HandleChangeForSearch = (event) => {
    setSearchKey(event.target.value);
    if (event.target.value) {
      setEnabled(true);
      setGeoLocationEnable(true);
      setCurrentLocation(event.target.value);
    } else {
      setEnabled(false);
      setCurrentLocation(undefined);
    }
  };
  const handleChange = (event, value) => {
    if (value) {
      setPlaceId(value?.place_id);
      setPlaceDescription(value?.description);
      setZoneIdEnabled(false);
      setGeoLocationEnable(true);
    }
    setPlaceDetailsEnabled(true);
  };
  const { data: places, isLoading } = useGetAutocompletePlace(
    searchKey,
    enabled
  );

  useEffect(() => {
    if (places) {
      const tempData = places?.suggestions?.map((item) => ({
        place_id: item.placePrediction.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions(tempData);
    }
  }, [places]);

  const {
    data: geoCodeResults,
    refetch,
    isRefetching,
    isLoading: isLoadingGeoCode,
  } = useGetGeoCode(location, geoLocationEnable);
  const { data: zoneData } = useGetZoneId(location, zoneIdEnabled);

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  useEffect(() => {
    if (!showCurrentLocation || !location) {
      return;
    }
    const formatted = geoCodeResults?.results?.[0]?.formatted_address;
    if (formatted) {
      setCurrentLocation(formatted);
      return;
    }
    const zoneLabel = zoneData?.zone_data?.[0]?.display_name;
    if (zoneLabel) {
      setCurrentLocation((prev) => prev || zoneLabel);
    }
  }, [geoCodeResults, location, showCurrentLocation, zoneData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        // dispatch(setZoneData(zoneData?.data?.zone_data));
        localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  //
  // //********************Pick Location */
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    placeId,
    placeDetailsEnabled
  );
  //
  useEffect(() => {
    if (placeDetails) {
      setLocation({
        lat: placeDetails?.location?.latitude,
        lng: placeDetails?.location?.longitude,
      });
    }
  }, [placeDetails]);

  useEffect(() => {
    if (placeDescription) {
      setCurrentLocation(placeDescription);
    }
  }, [placeDescription]);

  const moduleType = getCurrentModuleType();

  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
  };
  const { refetch: wishlistRefetch } = useWishListGet(onSuccessHandler);
  const setLocationEnable = async () => {
    setGeoLocationEnable(true);
    setZoneIdEnabled(true);
    if (currentLocation && location) {
      if (getToken()) {
        if (moduleType === "rental") {
          await rentalWishlistRefetch();
        } else {
          await wishlistRefetch();
        }
      }
      localStorage.setItem("location", currentLocation);
      localStorage.setItem("currentLatLng", JSON.stringify(location));
      notifyHeaderSessionSync();
      //handleModalClose();

      toast.success(t("New location has been set."));
      setOpenModuleSelection(true);
    } else {
      toast.error(t("Location is required."), {
        id: "id",
      });
    }
  };
  const handleCloseModuleModal = (item) => {
    if (item) {
      toast.success(t(module_select_success));
      router.push("/home", undefined, { shallow: true });
    }
    setOpenModuleSelection(false);
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedLocation = window.localStorage.getItem("location");
    const savedLatLng = window.localStorage.getItem("currentLatLng");

    if (savedLocation) {
      setCurrentLocation(savedLocation);
      setShowCurrentLocation(true);
      hasAutoAppliedLocation.current = true;
    }

    if (savedLatLng) {
      try {
        const parsedLatLng = JSON.parse(savedLatLng);
        if (parsedLatLng?.lat && parsedLatLng?.lng) {
          setLocation(parsedLatLng);
          setGeoLocationEnable(true);
          setZoneIdEnabled(true);
          setShowCurrentLocation(true);
          hasAutoAppliedLocation.current = true;
        }
      } catch (error) {
        // Ignore malformed stored location data.
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || hasAutoRequestedLocation.current) {
      return;
    }

    const savedLocation = window.localStorage.getItem("location");
    if (savedLocation) {
      hasAutoRequestedLocation.current = true;
      return;
    }

    hasAutoRequestedLocation.current = true;
    getPosition();
  }, [getPosition]);

  useEffect(() => {
    if (!coords || hasAutoAppliedLocation.current) {
      return;
    }

    setLocation({ lat: coords?.latitude, lng: coords?.longitude });
    setOpenLocation(false);
    setShowCurrentLocation(true);
    setGeoLocationEnable(true);
    setZoneIdEnabled(true);
    setIsSelectedByGps(true);
    hasAutoAppliedLocation.current = true;
  }, [coords]);

  useEffect(() => {
    if (typeof window === "undefined" || window.localStorage.getItem("location")) {
      return;
    }
    if (coords || hasAutoAppliedLocation.current) {
      return;
    }
    if (isGeolocationAvailable === false || positionError) {
      applyDefaultLocationFromConfig();
      return;
    }
    const timer = setTimeout(() => {
      if (!hasAutoAppliedLocation.current) {
        applyDefaultLocationFromConfig();
      }
    }, 9000);
    return () => clearTimeout(timer);
  }, [
    coords,
    positionError,
    isGeolocationAvailable,
    applyDefaultLocationFromConfig,
  ]);

  useEffect(() => {
    if (
      !hasAutoAppliedLocation.current ||
      !currentLocation ||
      !location ||
      openModuleSelection
    ) {
      return;
    }

    const savedLocation =
      typeof window !== "undefined"
        ? window.localStorage.getItem("location")
        : null;

    if (!savedLocation) {
      setLocationEnable();
    }
  }, [currentLocation, location, openModuleSelection]);

  useEffect(() => {
    if (!currentLocation || !location || !zoneData || openModuleSelection) {
      return;
    }

    setOpenModuleSelection(true);
  }, [currentLocation, location, zoneData, openModuleSelection]);

  useEffect(() => {
    // Handle clicks outside of excludedDivRef
    const handleClickOutside = (event) => {
      if (
        excludedDivRef.current &&
        !excludedDivRef.current.contains(event.target)
      ) {
        setPickLocation(false);
        // setClickedOutside(true);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [excludedDivRef]);

  const handlePickLocation = (e) => {
    setPickLocation((prev) => !prev);
  };
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  return (
    <>
      <CustomStackFullWidth
        sx={{
          backgroundColor: theme.palette.mode === "dark" 
            ? alpha(theme.palette.neutral[100], 0.05)
            : theme.palette.neutral[100],
          padding: { xs: "12px", sm: "16px", md: "20px" },
          borderRadius: { xs: "4px", md: "4px" },
          boxShadow: theme.palette.mode === "dark"
            ? "0px 4px 20px rgba(0, 0, 0, 0.3), inset 0px 1px 0px rgba(255, 255, 255, 0.05)"
            : "0px 4px 20px rgba(21, 46, 110, 0.08), inset 0px 1px 0px rgba(255, 255, 255, 0.8)",
          border: theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(21, 46, 110, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: theme.palette.mode === "dark"
              ? "0px 6px 24px rgba(0, 0, 0, 0.4), inset 0px 1px 0px rgba(255, 255, 255, 0.06)"
              : "0px 6px 24px rgba(21, 46, 110, 0.12), inset 0px 1px 0px rgba(255, 255, 255, 0.9)",
          },
        }}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          sx={{ position: "relative", zIndex: 999 }}
        >
          <Grid container spacing={0}>
            <Grid item xs={9} sm={9.9}>
              <HeroFormInputWrapper>
                <CustomMapSearch
                  isLoading={isLoadingGeoCode}
                  showCurrentLocation={showCurrentLocation}
                  predictions={predictions}
                  handleChange={handleChange}
                  HandleChangeForSearch={HandleChangeForSearch}
                  handleAgreeLocation={handleAgreeLocation}
                  handleCloseLocation1={handleCloseLocation1}
                  currentLocation={currentLocation}
                  placeId={placeId}
                  handleCloseLocation={handleCloseLocation}
                  frommap="false"
                  fromparcel="false"
                  isLanding={true}
                  isRefetching={isRefetching}
                  handleOpen={handleOpen}
                />
                {!currentLocation && !showCurrentLocation && (
                  <HeroFormItem ref={excludedDivRef}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.neutral[300], 0.3)
                          : theme.palette.neutral[300],
                        alignItems: "center",
                        justifyContent: "center",
                        display: !isSelectedByGps ? "flex" : "none",
                        padding: {
                          xs: "10px",
                          sm: lanDirection === "rtl" ? "0rem" : "10px",
                        },
                        position: "relative",
                        top: {
                          xs: "6px",
                          md: lanDirection === "rtl" ? "9px" : "2px"
                        },
                        cursor: "pointer",
                        borderRadius: {
                          xs: pickLocation ? "4px 4px 0 0" : "0px",
                          sm: "0px",
                        },
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.2)
                            : alpha(theme.palette.primary.main, 0.1),
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <CustomStackFullWidth
                        alignItems="center"
                        justifyContent="space-between"
                        direction="row"
                        gap="10px"
                        sx={{
                          color: theme.palette.primary.main,
                          "&:hover": {
                            color: theme.palette.primary.dark,
                          },
                        }}
                      >
                        {!isSelectedByGps && (
                          <GpsFixedIcon
                            id="gps-locate-icon"
                            onClick={handleAgreeLocation}
                            size={22}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </CustomStackFullWidth>
                    </Box>
                  </HeroFormItem>
                )}
              </HeroFormInputWrapper>
            </Grid>
            <Grid item xs={3} sm={2.1}>
              <StyledButton
                id="hero-explore-button"
                sx={{
                  height: { xs: "42px", sm: "44px" },
                  minHeight: { xs: "42px", sm: "44px" },
                  width: "100%",
                  borderRadius: { xs: "0px 4px 4px 0px", sm: "0px 4px 4px 0px" },
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: { xs: "14px", sm: "16px" },
                  textTransform: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0px 2px 8px rgba(21, 46, 110, 0.2)",
                  "&:hover:not(:disabled)": {
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 12px rgba(21, 46, 110, 0.3)",
                  },
                  "&:active:not(:disabled)": {
                    transform: "translateY(0px)",
                    boxShadow: "0px 2px 8px rgba(21, 46, 110, 0.2)",
                  },
                  "&:disabled": {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                    opacity: 0.6,
                    boxShadow: "none",
                    "&:hover": {
                      cursor: "not-allowed !important",
                      transform: "none",
                    },
                  },
                }}
                onClick={() => setLocationEnable()}
                radiuschange={isXSmall ? "false" : "true"}
                disabled={!location?.lat || isLoadingGeoCode}
              >
                {t("Discover")}
              </StyledButton>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        {open && (
          <MapModal
            open={open}
            handleClose={handleClose}
            coords={coords}
            selectedLocation={location}
            disableAutoFocus
            userLocation={location}
          />
        )}
        {openLocation && (
          <AllowLocationDialog
            handleCloseLocation={handleCloseLocation}
            openLocation={openLocation}
            isGeolocationEnabled={isGeolocationEnabled}
          />
        )}
      </CustomStackFullWidth>
      {zoneData && openModuleSelection && (
        <Box
          sx={{
            width: "100%",
            mt: { xs: 2, sm: 2.5 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ModuleSelectionRaw />
        </Box>
      )}
    </>
  );
};
export default HeroLocationForm;
