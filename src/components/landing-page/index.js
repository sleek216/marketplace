import { NoSsr } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import CookiesConsent from "../CookiesConsent";
import PushNotificationLayout from "../PushNotificationLayout";
import HeroSection from "./hero-section/HeroSection";
import LandingModulesSection from "./LandingModulesSection";
import LandingPromotionalBannerSection from "./LandingPromotionalBannerSection";
import LandingDoorstepDeliveryBanner from "./LandingDoorstepDeliveryBanner";
import LandingFeaturesSection from "./LandingFeaturesSection";
import LandingHowItWorksSection from "./LandingHowItWorksSection";
import ComponentOne from "./ComponentOne";
import Testimonials from "./Testimonials";

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
        {/* Hero Banner */}
        <HeroSection
          landingPageDataheroSection={landingPageData?.hero_section}
          promotionalBanner={
            landingPageData?.promotional_banner_section
              ?.promotion_banners_full_url
          }
        />

        {/* Modules Section (Marketplace Services & Modules) */}
        <LandingModulesSection />

        {/* High-Impact Promotional Grocery Showcase Banner */}
        <LandingPromotionalBannerSection />

        {/* E-Commerce Value Propositions & Platform Features ("Why Shop On Our Marketplace?") */}
        <LandingFeaturesSection />

        {/* Doorstep Delivery Banner (Delivery Guy + Spinning Same Day Delivery Stamp) */}
        <LandingDoorstepDeliveryBanner />

        {/* Simple 3-Step How It Works Guide */}
        <LandingHowItWorksSection />

        {/* Highlight Promo Banner */}
        {landingPageData?.company_title && (
          <ComponentOne landingPageData={landingPageData} />
        )}

        {/* Customer Testimonials & Reviews */}
        {landingPageData?.testimonial_list?.length > 0 && (
          <Testimonials landingPageData={landingPageData} />
        )}

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
