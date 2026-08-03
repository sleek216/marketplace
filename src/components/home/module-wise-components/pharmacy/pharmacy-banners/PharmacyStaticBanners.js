import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import useGetBasicCampaigns from "../../../../../api-manage/hooks/react-query/useGetBasicCampaigns";
import { getModuleId } from "helper-functions/getModuleId";
import PromotionalBannerGrid from "../../../PromotionalBannerGrid";
import { toBannerSlides } from "../../../bannerSlideUtils";
import CustomContainer from "../../../../container";

const PharmacyStaticBanners = () => {
  const router = useRouter();
  const { data, isLoading } = useGetBasicCampaigns();

  const slides = useMemo(() => toBannerSlides(data || []), [data]);

  const handleSlideClick = (slide) => {
    const banner = slide?.data;
    if (!banner?.id) return;

    router
      .push(
        {
          pathname: "/campaigns/[id]",
          query: { id: `${banner.id}`, module_id: `${getModuleId()}` },
        },
        undefined,
        { shallow: true }
      )
      .then(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      });
  };

  if (isLoading) {
    return (
      <Box sx={{ mt: { xs: 1, sm: 1.5 } }}>
        <CustomContainer>
          <PromotionalBannerGrid loading wrapSection={false} />
        </CustomContainer>
      </Box>
    );
  }

  if (!slides.length) {
    return null;
  }

  return (
    <Box sx={{ mt: { xs: 1, sm: 1.5 } }}>
      <CustomContainer>
        <PromotionalBannerGrid
          slides={slides}
          onSlideClick={handleSlideClick}
          wrapSection={false}
        />
      </CustomContainer>
    </Box>
  );
};

export default PharmacyStaticBanners;
