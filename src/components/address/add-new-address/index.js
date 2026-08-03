import React, { useEffect, useReducer, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomModal from "../../modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  AddressTypeStack,
  CustomIconButton,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { ACTIONS, initialState, reducer } from "../states";
import { useGeolocated } from "react-geolocated";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import GoogleMapComponent from "../../Map/GoogleMapComponent";
import AddressForm from "./AddressForm";
import CustomImageContainer from "../../CustomImageContainer";
import home from "../../checkout/assets/image 1256.png";
import office from "../assets/office.png";
import plusIcon from "../assets/plus.png";
import { useDispatch, useSelector } from "react-redux";
import { setOpenAddressModal } from "redux/slices/addAddress";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import {
  coordsFromSavedAddress,
  DEFAULT_ADDRESS_TYPE,
  normalizeAddressTypeKey,
} from "./addressTypeUtils";

const AddNewAddress = (props) => {
  const {
    configData,
    refetch,
    t,
    openAddressModal,
    editAddress,
    setEditAddress,
  } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const [editAddressLocation, setEditAddressLocation] = useState(() => {
    const saved = coordsFromSavedAddress(editAddress);
    if (saved) return saved;
    return {
      lat: configData?.default_location?.lat,
      lng: configData?.default_location?.lng,
    };
  });
  const token = localStorage.getItem("token");
  const reduxDispatch = useDispatch();
  const [addressType, setAddressType] = useState(() => {
    if (editAddress?.address_type) {
      return normalizeAddressTypeKey(editAddress.address_type);
    }
    if (guestUserInfo?.address_type) {
      return normalizeAddressTypeKey(guestUserInfo.address_type);
    }
    return DEFAULT_ADDRESS_TYPE;
  });
  const [mapLocationConfirmed, setMapLocationConfirmed] = useState(
    () => !!editAddress
  );
  const personName = `${profileInfo?.f_name} ${profileInfo?.l_name}`;

  //useEffect calls for getting data
  //****getting current location/***/
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });

  useEffect(() => {
    setEditAddressLocation(state?.location);
  }, [state?.location]);

  useEffect(() => {
    if (!openAddressModal) return;
    const saved = coordsFromSavedAddress(editAddress);
    dispatch({
      type: ACTIONS.setLocation,
      payload: saved ?? configData?.default_location ?? null,
    });
  }, [openAddressModal, editAddress?.id, configData?.default_location]);

  useEffect(() => {
    if (!openAddressModal) return;
    setMapLocationConfirmed(!!editAddress);
    if (!editAddress) {
      setAddressType(DEFAULT_ADDRESS_TYPE);
    } else if (editAddress.address_type) {
      setAddressType(normalizeAddressTypeKey(editAddress.address_type));
    }
  }, [openAddressModal, editAddress?.id]);

  const { data: places, isLoading } = useGetAutocompletePlace(
    state.searchKey,
    state.enabled
  );
  useEffect(() => {
    if (places) {
      const tempData = places?.data?.suggestions?.map((item) => ({  
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      dispatch({ type: ACTIONS.setPredictions, payload: tempData });
    }
  }, [places]);
  const { data: geoCodeResults, isFetching: isFetchingGeoCode } = useGetGeoCode(
    state.location,
    state.geoLocationEnable
  );
  useEffect(() => {
    if (geoCodeResults?.results) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: geoCodeResults?.results[0]?.formatted_address,
      });
    }
  }, [geoCodeResults, state.location]);
  const { data: zoneData } = useGetZoneId(state.location, state.zoneIdEnabled);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        //localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  // //********************Pick Location */
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    state.placeId,
    state.placeDetailsEnabled
  );
  //
  useEffect(() => {
    if (placeDetails) {
      const locObj = {
        lat: placeDetails?.data?.location?.latitude,
        lng: placeDetails?.data?.location?.longitude,
      };
      dispatch({
        type: ACTIONS.setLocation,
        payload: locObj,
      });
    }
  }, [placeDetails]);

  // const orangeColor = theme.palette.primary.main;

  useEffect(() => {
    if (state.placeDescription) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: state.placeDescription,
      });
    }
  }, [state.placeDescription]);

  const handleClick = (name) => {
    setAddressType(name);
    if (editAddress?.id != null) {
      setEditAddress({ ...editAddress, address_type: name });
    }
  };
  const closePopover = () => {
    reduxDispatch(setOpenAddressModal(false));
  };

  const getCurrentLocation = () => {
    const locObj = { lat: coords?.latitude, lng: coords?.longitude };
    dispatch({
      type: ACTIONS.setLocation,
      payload: locObj,
    });
    setMapLocationConfirmed(true);
  };

  const selectedAddressTypeKey = normalizeAddressTypeKey(
    editAddress?.address_type || addressType
  );

  return (
    <Box>
      {openAddressModal && (
        <CustomModal
          openModal={openAddressModal}
          handleClose={() => reduxDispatch(setOpenAddressModal(false))}
        >
          <Paper
            sx={{
              position: "relative",
              width: { xs: "300px", sm: "450px", md: "550px", lg: "730px" },
              maxHeight: { xs: "90vh", md: "88vh" },
              overflow: "hidden",
              p: { xs: "0.9rem", md: "1.2rem" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <IconButton
              onClick={() => reduxDispatch(setOpenAddressModal(false))}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>

            <Stack
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.neutral[300]}`,
                pb: 1,
                mb: 1,
              }}
            >
              <Typography fontSize={{ xs: "15px", md: "18px" }} fontWeight="700">
                {editAddress ? t("Update Delivery Address") : t("Add Delivery Address")}
              </Typography>
              <Typography fontSize="12px" color={(theme) => theme.palette.neutral[600]}>
                {t("Pin your location and fill the address details")}
              </Typography>
            </Stack>

            <Stack
              sx={{
                overflowY: "auto",
                pr: { xs: 0, md: 0.5 },
              }}
            >
            <Stack position="relative">
              <GoogleMapComponent
                height="236px"
                key={state.rerenderMap}
                setLocation={(values) => {
                  dispatch({
                    type: ACTIONS.setLocation,
                    payload: values,
                  });
                }}
                location={
                  editAddress
                    ? editAddressLocation
                    : state.location
                    ? state.location
                    : {
                        lat: configData?.default_location?.lat,
                        lng: configData?.default_location?.lng,
                      }
                }
                setPlaceDetailsEnabled={(value) =>
                  dispatch({
                    type: ACTIONS.setPlaceDetailsEnabled,
                    payload: value,
                  })
                }
                placeDetailsEnabled={state.placeDetailsEnabled}
                locationEnabled={state.locationEnabled}
                emphasizePickLocation={!mapLocationConfirmed}
                onLocationAdjusted={() => setMapLocationConfirmed(true)}
              />
              {!mapLocationConfirmed && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
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
              <IconButton
                onClick={getCurrentLocation}
                sx={{
                  position: "absolute",
                  bottom: "30%",
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

            <CustomStackFullWidth pt="20px">
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
                  <CustomImageContainer
                    src={home.src}
                    width="24px"
                    height="24px"
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight:
                        selectedAddressTypeKey === "home" ? 700 : 500,
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
                      fontWeight:
                        selectedAddressTypeKey === "office" ? 700 : 500,
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
                      fontWeight:
                        selectedAddressTypeKey === "other" ? 700 : 500,
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
            <CustomStackFullWidth mt="1.3rem">
              <AddressForm
                atModal="true"
                stickyActions
                setAddressType={setAddressType}
                addressType={
                  editAddress?.address_type
                    ? editAddress?.address_type
                    : addressType
                }
                configData={configData}
                deliveryAddress={
                  geoCodeResults?.results?.[0]?.formatted_address ||
                  state?.currentLocation ||
                  editAddress?.address ||
                  ""
                }
                personName={
                  editAddress ? editAddress?.contact_person_name : personName
                }
                phone={
                  editAddress
                    ? editAddress?.contact_person_number
                    : profileInfo?.phone
                }
                email={profileInfo?.email}
                lat={
                  editAddress
                    ? editAddress?.lat ?? editAddress?.latitude
                    : state.location?.lat
                }
                lng={
                  editAddress
                    ? editAddress?.lng ?? editAddress?.longitude
                    : state.location?.lng
                }
                popoverClose={closePopover}
                refetch={refetch}
                isRefetcing={isFetchingGeoCode}
                editAddress={editAddress}
              />
            </CustomStackFullWidth>
            </Stack>
          </Paper>
        </CustomModal>
      )}
    </Box>
  );
};

AddNewAddress.propTypes = {};

export default AddNewAddress;
