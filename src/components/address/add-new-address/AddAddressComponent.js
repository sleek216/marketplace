import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { BackIconButton } from "../../profile/basic-information/BasicInformationForm";
import { t } from "i18next";
import { initialState, reducer } from "../states";
import { useGeolocated } from "react-geolocated";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import GoogleMapComponent from "../../Map/GoogleMapComponent";
import CustomMapSearch from "../../Map/CustomMapSearch";
import { handleAgreeLocation, handleCloseLocation } from "../HelperFunctions";
import {
  AddressTypeStack,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import home from "../../checkout/assets/image 1256.png";
import office from "../assets/office.png";
import plusIcon from "../assets/plus.png";
import AddressForm from "./AddressForm";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import {
  coordsFromSavedAddress,
  DEFAULT_ADDRESS_TYPE,
  normalizeAddressTypeKey,
} from "./addressTypeUtils";
export const AddAddressSearchBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  zIndex: "999",
  width: "85%",
  top: "10%",
  marginLeft: "20px",
  [theme.breakpoints.down("md")]: {
    marginLeft: "13px",
  },
}));
const AddAddressComponent = ({
  setAddAddress,

  editAddress,
  userData,
  addressRefetch,
  setEditAddress,
}) => {
  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [addressType, setAddressType] = useState(() =>
    editAddress?.address_type
      ? normalizeAddressTypeKey(editAddress.address_type)
      : DEFAULT_ADDRESS_TYPE
  );
  const [mapLocationConfirmed, setMapLocationConfirmed] = useState(
    () => !!editAddress
  );
  const { configData } = useSelector((state) => state.configData);
  const [isDisablePickButton, setDisablePickButton] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(() =>
    Boolean(
      coordsFromSavedAddress(editAddress) || configData?.default_location
    )
  );
  const [location, setLocation] = useState(() => {
    const saved = coordsFromSavedAddress(editAddress);
    if (saved) return saved;
    return configData?.default_location ?? null;
  });
  const [searchKey, setSearchKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(true);
  const [placeDescription, setPlaceDescription] = useState(undefined);
  const [predictions, setPredictions] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [searchInputText, setSearchInputText] = useState(
    () => editAddress?.address ?? ""
  );
  const [autocompleteSelection, setAutocompleteSelection] = useState(null);
  const skipGeoSearchSyncRef = useRef(false);

  //****getting current location/***/
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });

  const { data: places, isLoading } = useGetAutocompletePlace(
    searchKey,
    enabled
  );

  useEffect(() => {
    if (places) {
      const tempData= places?.suggestions?.map((item) => ({
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
        // dispatch(setZoneData(zoneData?.data?.zone_data));
        localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    placeId,
    placeDetailsEnabled
  );
  //

  useEffect(() => {
    if (editAddress?.address_type) {
      setAddressType(normalizeAddressTypeKey(editAddress.address_type));
    } else if (!editAddress) {
      setAddressType(DEFAULT_ADDRESS_TYPE);
    }
    setMapLocationConfirmed(!!editAddress);

    const saved = coordsFromSavedAddress(editAddress);
    if (saved) {
      setLocation(saved);
      setLocationEnabled(true);
      setSearchInputText(editAddress?.address ?? "");
      setAutocompleteSelection(null);
      setPlaceId("");
      skipGeoSearchSyncRef.current = false;
    } else if (!editAddress) {
      setLocation(configData?.default_location ?? null);
      setLocationEnabled(Boolean(configData?.default_location));
      setSearchInputText("");
      setAutocompleteSelection(null);
      setPlaceId("");
      skipGeoSearchSyncRef.current = false;
    }
  }, [
    editAddress?.id,
    editAddress?.address,
    editAddress?.lat,
    editAddress?.latitude,
    editAddress?.lng,
    editAddress?.longitude,
    configData?.default_location,
  ]);

  const { data: geoCodeResults, isFetching: isFetchingGeoCode } =
    useGetGeoCode(location, locationEnabled);

  const applyLocationFromMapOrGps = useCallback((loc) => {
    skipGeoSearchSyncRef.current = false;
    setLocation(loc);
    setLocationEnabled(true);
  }, []);

  useEffect(() => {
    if (placeDetails) {
      applyLocationFromMapOrGps({
        lat: placeDetails?.location?.latitude,
        lng: placeDetails?.location?.longitude,
      });
      setLocationEnabled(true);
      if (placeId) {
        setMapLocationConfirmed(true);
      }
    }
  }, [placeDetails, placeId, applyLocationFromMapOrGps]);

  useEffect(() => {
    const addr = geoCodeResults?.results?.[0]?.formatted_address;
    if (!addr) return;
    if (skipGeoSearchSyncRef.current) return;
    setSearchInputText(addr);
    setAutocompleteSelection(null);
  }, [geoCodeResults]);

  const handleClick = (name) => {
    setAddressType(name);
    if (editAddress?.id != null) {
      setEditAddress({ ...editAddress, address_type: name });
    }
  };

  const selectedAddressTypeKey = normalizeAddressTypeKey(
    editAddress?.address_type || addressType
  );
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
    handleCloseLocation(dispatch);
  };

  const getCurrentLocation = () => {
    if (!coords?.latitude || !coords?.longitude) return;
    applyLocationFromMapOrGps({
      lat: coords.latitude,
      lng: coords.longitude,
    });
    setLocationEnabled(true);
    setMapLocationConfirmed(true);
  };

  return (
    <>
      <Grid item md={12} xs={12} alignSelf="center">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle2" fontWeight="700">
            {t("Add Address")}
          </Typography>
          <BackIconButton onClick={() => setAddAddress(false)}>
            <ArrowBackIosNewIcon
              sx={{
                fontSize: "10px",
                color: (theme) => theme.palette.primary.main,
                fontWeight: "700",
                marginRight: "3px",
              }}
            />
            {t("Go Back")}
          </BackIconButton>
        </Stack>
      </Grid>
      <Grid item xs={12} md={5} position="relative" align="center">
        <AddAddressSearchBox>
          <CustomMapSearch
            predictions={predictions}
            handleChange={handleAutocompleteChange}
            handleAgreeLocation={() => handleAgreeLocation(coords, dispatch)}
            currentLocation={state.currentLocation}
            currentLocationValue={autocompleteSelection}
            inputValue={searchInputText}
            onInputChange={handleSearchInputChange}
            handleCloseLocation={handleCloseSearchBar}
          />
        </AddAddressSearchBox>
        <Stack position="relative">
          {location && (
            <>
              <GoogleMapComponent
                setLocation={applyLocationFromMapOrGps}
                location={location}
                setPlaceDetailsEnabled={setPlaceDetailsEnabled}
                placeDetailsEnabled={placeDetailsEnabled}
                locationEnabled={locationEnabled}
                setPlaceDescription={setPlaceDescription}
                setLocationEnabled={setLocationEnabled}
                setDisablePickButton={setDisablePickButton}
                height="350px"
                emphasizePickLocation={!mapLocationConfirmed}
                onLocationAdjusted={() => setMapLocationConfirmed(true)}
              />
              {!mapLocationConfirmed && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxWidth: "92%",
                    zIndex: 6,
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    variant="caption"
                    align="center"
                    display="block"
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(0,0,0,0.55)"
                          : "rgba(255,255,255,0.92)",
                      color: "warning.main",
                      fontWeight: 600,
                      boxShadow: 1,
                    }}
                  >
                    {t("Map pin hint")}
                  </Typography>
                </Box>
              )}
            </>
          )}
          <IconButton
            onClick={getCurrentLocation}
            sx={{
              position: "absolute",
              bottom: "25%",
              right: "10px",
              borderRadius: "50%",
              color: (theme) => theme.palette.primary.main,
              backgroundColor: "background.paper",
              zIndex: 7,
            }}
          >
            <GpsFixedIcon sx={{ fontSize: { xs: "18px", md: "24px" } }} />
          </IconButton>
        </Stack>
      </Grid>

      <Grid item xs={12} md={7}>
        <CustomStackFullWidth mb="20px">
          <Typography>{t("Label As")}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 0.5 }}
          >
            {t("Choose home, office, or other for this address.")}
          </Typography>
          <Stack direction="row" spacing={2.5} pt="10px" flexWrap="wrap">
            <AddressTypeStack
              value="home"
              addressType={selectedAddressTypeKey}
              onClick={() => handleClick("home")}
            >
              <CustomImageContainer src={home.src} width="24px" height="24px" />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: selectedAddressTypeKey === "home" ? 700 : 500,
                  color: (theme) =>
                    selectedAddressTypeKey === "home"
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontSize: "11px",
                  textAlign: "center",
                  lineHeight: 1.25,
                }}
              >
                {t("Home")}
              </Typography>
            </AddressTypeStack>
            <AddressTypeStack
              value="office"
              addressType={selectedAddressTypeKey}
              onClick={() => handleClick("office")}
            >
              <CustomImageContainer
                src={office.src}
                width="24px"
                height="24px"
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: selectedAddressTypeKey === "office" ? 700 : 500,
                  color: (theme) =>
                    selectedAddressTypeKey === "office"
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontSize: "11px",
                  textAlign: "center",
                  lineHeight: 1.25,
                }}
              >
                {t("Office")}
              </Typography>
            </AddressTypeStack>
            <AddressTypeStack
              value="other"
              addressType={selectedAddressTypeKey}
              onClick={() => handleClick("other")}
            >
              <CustomImageContainer
                src={plusIcon.src}
                width="24px"
                height="24px"
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: selectedAddressTypeKey === "other" ? 700 : 500,
                  color: (theme) =>
                    selectedAddressTypeKey === "other"
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontSize: "11px",
                  textAlign: "center",
                  lineHeight: 1.25,
                }}
              >
                {t("Others")}
              </Typography>
            </AddressTypeStack>
          </Stack>
        </CustomStackFullWidth>
        <AddressForm
          deliveryAddress={
            geoCodeResults?.results?.[0]?.formatted_address ||
            searchInputText ||
            editAddress?.address ||
            ""
          }
          atModal="false"
          addressType={addressType}
          configData={configData}
          phone={editAddress ? editAddress?.phone : userData?.phone}
          email={editAddress ? editAddress?.email : userData?.email}
          lat={location?.lat || ""}
          lng={location?.lng || ""}
          personName={
            editAddress
              ? editAddress?.contact_person_name
              : userData && `${userData?.f_name} ${userData?.l_name}`
          }
          editAddress={editAddress}
          setAddAddress={setAddAddress}
          refetch={addressRefetch}
        />
      </Grid>
    </>
  );
};

export default AddAddressComponent;
