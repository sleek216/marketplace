import React, { useMemo } from "react";
import { useRouter } from "next/router";
import PromotionalBannerGrid from "./PromotionalBannerGrid";
import { toBannerSlides } from "./bannerSlideUtils";

import banner1 from "./assets/banner.webp";
import banner2 from "./assets/ecommerce_top_bg.png";
import banner3 from "./assets/food.png";
import banner4 from "./assets/pharmacy.png";
import banner5 from "./assets/parcelBg.png";
import promotionalBannerImg from "./assets/promotional_banner.png";

const FALLBACK_MAIN = [banner1.src, banner2.src, promotionalBannerImg.src, banner3.src];
const FALLBACK_SIDE = [banner4.src, banner5.src];

const LandingPromotionalBanners = ({ promotionalBanner }) => {
  const router = useRouter();

  const slides = useMemo(() => {
    const source =
      promotionalBanner?.length > 0 ? promotionalBanner : FALLBACK_MAIN;
    return toBannerSlides(source);
  }, [promotionalBanner]);

  const fallbackSideSlides = useMemo(() => toBannerSlides(FALLBACK_SIDE), []);

  return (
    <PromotionalBannerGrid
      slides={slides}
      fallbackSideSlides={fallbackSideSlides}
      alwaysShowSideColumn
      onSlideClick={() => router.push("/search?search=")}
      wrapSection
    />
  );
};

export default LandingPromotionalBanners;
