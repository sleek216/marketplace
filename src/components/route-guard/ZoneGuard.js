import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageBootLoader from "../PageBootLoader";

const ZoneGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    try {
      const zoneId = JSON.parse(localStorage.getItem("zoneid") || "null");
      const location = localStorage.getItem("location");
      if ((zoneId?.length > 0 && location) || (Array.isArray(zoneId) && zoneId.length > 0)) {
        setChecked(true);
      } else {
        // Fallback: If no location/zone set yet, assign default zone so user can browse modules
        const defaultZone = [1, 2];
        const defaultLoc = "Default Location";
        const defaultLatLng = JSON.stringify({ lat: "23.8103", lng: "90.4125" });
        localStorage.setItem("zoneid", JSON.stringify(defaultZone));
        localStorage.setItem("location", defaultLoc);
        localStorage.setItem("currentLatLng", defaultLatLng);
        setChecked(true);
      }
    } catch {
      setChecked(true);
    }
  }, [router.isReady]);

  if (!checked) {
    return <PageBootLoader message="Checking your location..." />;
  }

  return <>{children}</>;
};

export default ZoneGuard;
