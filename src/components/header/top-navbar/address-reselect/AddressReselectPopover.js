import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Popover, Stack, Typography, useTheme } from "@mui/material";
import toast from "react-hot-toast";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import CustomAlert from "../../../alert/CustomAlert";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import DeliveryAddress from "../../../checkout/delivery-address";
import { useGeolocated } from "react-geolocated";
import { Plus as ControlPointOutlinedIcon } from "lucide-react";
import useGetGeoCode from "../../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../../api-manage/hooks/react-query/google-api/useGetZone";
import dynamic from "next/dynamic";
import { notifyHeaderSessionSync } from "helper-functions/headerSessionSync";
const MapModal = dynamic(() => import("../../../Map/MapModal"));
const AddressReselectPopover = (props) => {
  const { anchorEl, onClose, open, t, location: savedLocation, address, setAddress, token, currentLatLngForMar, ...other } =
    props;
  const theme = useTheme();
  const [openMapModal, setOpenMapModal] = useState(false);
  const [location, setLocation] = useState(undefined);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });

  const handleAgreeLocation = () => {
    setIsGettingLocation(true);

    const applyCoords = (lat, lng) => {
      setLocation({ lat, lng });
      setShowCurrentLocation(true);
      setGeoLocationEnable(true);
      setZoneIdEnabled(true);
    };

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          applyCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setIsGettingLocation(false);
          if (error?.code === 1) {
            toast.error(
              t("Location permission is blocked. Please allow location access in your browser settings.")
            );
          } else {
            toast.error(
              t("Unable to get current location. Please turn on location services.")
            );
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else if (coords?.latitude && coords?.longitude) {
      applyCoords(coords.latitude, coords.longitude);
    } else {
      setIsGettingLocation(false);
      toast.error(t("Geolocation is not supported by your browser."));
    }
  };

  const { data: geoCodeResults, isLoading: isLoadingGeoCode } = useGetGeoCode(
    location,
    geoLocationEnable
  );

  const { data: zoneData } = useGetZoneId(location, zoneIdEnabled);

  useEffect(() => {
    if (geoCodeResults && showCurrentLocation && location) {
      const formattedAddress =
        geoCodeResults.results?.[0]?.formatted_address ||
        `${Number(location.lat).toFixed(4)}, ${Number(location.lng).toFixed(4)}`;
      if (formattedAddress) {
        setCurrentLocation(formattedAddress);
        localStorage.setItem("location", formattedAddress);
        localStorage.removeItem("locationLabel");
        localStorage.setItem("currentLatLng", JSON.stringify(location));

        if (zoneData?.zone_id) {
          const formattedZoneId = Array.isArray(zoneData.zone_id)
            ? JSON.stringify(zoneData.zone_id)
            : typeof zoneData.zone_id === "string" && zoneData.zone_id.startsWith("[")
              ? zoneData.zone_id
              : JSON.stringify([zoneData.zone_id]);
          localStorage.setItem("zoneid", formattedZoneId);
        }

        notifyHeaderSessionSync();
        toast.success(t("Current location selected successfully."));
        setShowCurrentLocation(false);
        setIsGettingLocation(false);
        onClose();
      }
    }
  }, [geoCodeResults, location, showCurrentLocation, zoneData]);

  useEffect(() => {
    if (typeof window !== "undefined" && zoneData?.zone_id) {
      const formattedZoneId = Array.isArray(zoneData.zone_id)
        ? JSON.stringify(zoneData.zone_id)
        : typeof zoneData.zone_id === "string" && zoneData.zone_id.startsWith("[")
          ? zoneData.zone_id
          : JSON.stringify([zoneData.zone_id]);
      localStorage.setItem("zoneid", formattedZoneId);
      notifyHeaderSessionSync();
    }
  }, [zoneData]);

  const handleCloseMapModal = () => {
    setOpenMapModal(false);
    onClose();
  };
  const popOverHeightHandler = () => {
    if (token) {
      return "475px";
    } else {
      return "150px";
    }
  };
  return (
    <>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: { width: { xs: 300, sm: 320, md: 350 }, p: "1rem" },
        }}
        transitionDuration={2}
        {...other}
      >
        <Stack justifyContent="center" textAlign="center" spacing={2}>
          {savedLocation && savedLocation !== "Default Location" && (
            <Typography
              fontSize="14px"
              textAlign="left"
              sx={{
                color: theme.palette.neutral[1000],
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {savedLocation}
            </Typography>
          )}
          <SimpleBar
            className="custom-scrollbar"
            style={{
              maxHeight: popOverHeightHandler(),
              paddingRight: "5px",
            }}
          >
            <Stack width="100%" alignItems="center">
              {token ? (
                open && (
                  <Stack
                    pt="15px"
                    gap={{ xs: "0px", sm: "15px" }}
                    paddingRight="5px"
                  >
                    <Typography
                      fontSize="16px"
                      fontWeight={500}
                      textAlign="left"
                    >
                      {t("Select from saved addresses or pick from map")}
                    </Typography>
                    <DeliveryAddress
                      setAddress={setAddress}
                      address={address}
                      hideAddressSelectionField="true"
                      renderOnNavbar="true"
                    />
                  </Stack>
                )
              ) : (
                <CustomAlert
                  type="info"
                  text={t(
                    "To select from saved addresses, you need to sign in."
                  )}
                />
              )}
            </Stack>
          </SimpleBar>
          <Button
            fullWidth
            disabled={isGettingLocation}
            onClick={handleAgreeLocation}
            startIcon={
              isGettingLocation ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ControlPointOutlinedIcon sx={{ color: theme.palette.primary.main }} />
              )
            }
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}
          >
            {isGettingLocation ? t("Fetching location...") : t("Use Current Location")}
          </Button>
          <Stack width="100%" justifyContent="center" alignItems="center">
            <CustomButtonPrimary onClick={() => setOpenMapModal(true)}>
              {t("Pick from map")}
            </CustomButtonPrimary>
          </Stack>
        </Stack>
      </Popover>
      {openMapModal && (
        <MapModal open={openMapModal} handleClose={handleCloseMapModal}  selectedLocation={currentLatLngForMar}/>
      )}
    </>
  );
};

AddressReselectPopover.propTypes = {};

export default AddressReselectPopover;
