import { MapPin as RoomIcon } from "lucide-react";
import { Grid, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import AddressReselectPopover from "./AddressReselectPopover";
import { getModule } from "helper-functions/getLanguage";
import { notifyHeaderSessionSync } from "helper-functions/headerSessionSync";

const AddressReselect = ({ location, setOpenDrawer }) => {
  const theme = useTheme();
  const router = useRouter();
  const [openReselectModal, setOpenReselectModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [address, setAddress] = useState(null);
  const { t } = useTranslation();
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  let currentLatLngForMar;
  if (typeof localStorage.getItem("currentLatLng") !== undefined) {
    currentLatLngForMar = JSON.parse(localStorage.getItem("currentLatLng"));
  }
  let locationLabel = "";
  if (typeof window !== "undefined") {
    locationLabel = localStorage.getItem("locationLabel") || "";
  }

  let currentLatLng;
  useEffect(() => {
    let currentLatLng;
    if (typeof localStorage.getItem("currentLatLng") !== undefined) {
      currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
      const location = localStorage.getItem("location");
    }
  }, []);

  useEffect(() => {
    if (address) {
      localStorage.setItem("location", address?.address);
      localStorage.setItem(
        "locationLabel",
        address?.address_type || address?.contact_person_name || address?.address || ""
      );
      const values = { lat: address?.lat, lng: address?.lng };
      localStorage.setItem("currentLatLng", JSON.stringify(values));
      notifyHeaderSessionSync();
      if (address.zone_ids && address.zone_ids.length > 0) {
        const value = [address.zone_ids];

        localStorage.setItem("zoneid", JSON.stringify(address.zone_ids));
        toast.success(t(`New ${getModule()?.module_type==="rental" ? "Pickup" : "Delivery"} address selected.`));
        handleClosePopover();
      }
    }
  }, [address]);
  const handleClickToLandingPage = () => {
    setOpenPopover(true);
    setOpenDrawer(false);
  };

  const anchorRef = useRef(null);
  const handleClosePopover = () => {
    setOpenPopover(false);
  };
  const formatLocationText = (loc) => {
    if (!loc) return "";
    if (typeof loc === "string" && loc.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(loc);
        if (parsed?.address) return parsed.address;
      } catch {
        return loc;
      }
    }
    return loc;
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          color: (theme) => theme.palette.neutral[1000],
          maxWidth: { xs: "230px", sm: "280px" },
        }}
        ref={anchorRef}
        onClick={handleClickToLandingPage}
      >
        <Grid item xs={12} align="left">
          <CustomStackFullWidth direction="row" alignItems="center" spacing={0.7}>
            <RoomIcon
              size={18}
              strokeWidth={2}
              style={{
                color: theme.palette.primary.main,
                minWidth: "18px",
              }}
            />
            <Typography
              fontSize={{ xs: "12px", sm: "16px" }}
              align="center"
              color={theme.palette.neutral[1000]}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                textAlign: "left",
                transition: "all ease 0.5s",
                wordBreak: "break-all",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
                // width: "210px",
              }}
            >
              {locationLabel &&
               locationLabel !== "Current location" &&
               locationLabel !== "Default Location"
                ? t(locationLabel)
                : location &&
                  location !== "Default Location"
                  ? formatLocationText(location)
                  : t("Select location")}
            </Typography>
          </CustomStackFullWidth>
        </Grid>
      </Grid>
      <AddressReselectPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
        t={t}
        location={location}
        address={address}
        setAddress={setAddress}
        token={token}
        currentLatLngForMar={currentLatLngForMar}
      />
    </>
  );
};

AddressReselect.propTypes = {};

export default AddressReselect;
