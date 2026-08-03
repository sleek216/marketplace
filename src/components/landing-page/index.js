import { NoSsr } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import CookiesConsent from "../CookiesConsent";
import PushNotificationLayout from "../PushNotificationLayout";
import HeroSection from "./hero-section/HeroSection";
import MarketplaceRecentlyViewedSection from "./MarketplaceRecentlyViewedSection";
import MarketplaceProductsSection from "./MarketplaceProductsSection";

const MapModal = dynamic(() => import("../Map/MapModal"));

const LandingPage = ({ configData, landingPageData }) => {
  const [open, setOpen] = useState(false);
  const [zoneEpoch, setZoneEpoch] = useState(0);

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });

  useEffect(() => {
    // Re-read zone when tab becomes visible again (e.g. after address change).
    const onFocus = () => setZoneEpoch((n) => n + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setZoneEpoch((n) => n + 1);
  };

  const handleRequestLocation = () => {
    setOpen(true);
  };

  return (
    <>
      <PushNotificationLayout>
        <HeroSection
          landingPageDataheroSection={landingPageData?.hero_section}
          promotionalBanner={
            landingPageData?.promotional_banner_section
              ?.promotion_banners_full_url
          }
        />
        <MarketplaceRecentlyViewedSection key={`rv-${zoneEpoch}`} />
        <MarketplaceProductsSection
          key={zoneEpoch}
          onRequestLocation={handleRequestLocation}
        />
        {open && (
          <MapModal
            open={open}
            handleClose={handleClose}
            coords={coords}
            disableAutoFocus
          />
        )}
        <NoSsr>
          <CookiesConsent text={configData?.cookies_text} />
        </NoSsr>
      </PushNotificationLayout>
    </>
  );
};

export default LandingPage;
