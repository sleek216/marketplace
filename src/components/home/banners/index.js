import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import useGetBanners from "../../../api-manage/hooks/react-query/useGetBanners";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModuleId } from "helper-functions/getModuleId";
import { setBanners } from "redux/slices/storedData";
import FoodDetailModal from "../../food-details/foodDetail-modal/FoodDetailModal";
import PromotionalBannerGrid from "../PromotionalBannerGrid";
import { toBannerSlides } from "../bannerSlideUtils";

/** @deprecated Use PromotionalBannerGrid — kept for legacy imports */
export const BannersWrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "8px",
  width: "100%",
  minHeight: "160px",
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const Banners = ({ feature }) => {
  const router = useRouter();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { banners } = useSelector((state) => state.storedData);
  const { data, isFetched, isLoading } = useGetBanners(feature);
  const [bannersData, setBannersData] = useState([]);
  const [foodBanner, setFoodBanner] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setBanners(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const source = data || banners;
    if (source) {
      handleBannersData(source);
    }
  }, [banners, data]);

  const handleBannersData = (source) => {
    const mergedBannerData = [];

    if (getCurrentModuleType() === "food") {
      source?.banners?.forEach((item) => mergedBannerData.push(item));
      source?.campaigns?.forEach((item) =>
        mergedBannerData.push({ ...item, isCampaign: true })
      );
    } else {
      source?.banners?.forEach((item) => mergedBannerData.push(item));
    }

    setBannersData(mergedBannerData);
  };

  const slides = useMemo(() => toBannerSlides(bannersData), [bannersData]);

  const handleBannerClick = (banner) => {
    if (banner?.isCampaign) {
      router
        .push(
          {
            pathname: "/campaigns/[id]",
            query: { id: `${banner?.id}`, module_id: `${getModuleId()}` },
          },
          undefined,
          { scroll: false }
        )
        .then(() => {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        });
      return;
    }

    if (banner?.type === "default") {
      if (banner?.link) {
        window.open(banner.link, "_blank");
      }
      return;
    }

    if (banner?.type === "store_wise") {
      router.push(
        {
          pathname: "/store/[id]",
          query: {
            id: `${banner?.store?.slug ? banner?.store?.slug : banner?.store?.id}`,
            module_id: `${getModuleId()}`,
            store_zone_id: `${banner?.store?.zone_id}`,
          },
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    if (banner?.type === "item_wise") {
      if (selectedModule?.module_type !== "ecommerce") {
        setFoodBanner(banner?.item);
        setOpenModal(true);
      } else {
        router.push(
          {
            pathname: "/product/[id]",
            query: {
              id: `${banner?.item?.slug ? banner?.item?.slug : banner?.item?.id}`,
              module_id: `${getModuleId()}`,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  };

  const handleSlideClick = (slide) => {
    const banner = slide?.data;
    if (!banner) return;
    if (banner?.type === "default" && banner?.link === null) return;
    handleBannerClick(banner);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  if (!isFetched && isLoading) {
    return <PromotionalBannerGrid loading wrapSection />;
  }

  if (!slides.length) {
    return null;
  }

  return (
    <>
      <PromotionalBannerGrid
        slides={slides}
        onSlideClick={handleSlideClick}
        alwaysShowSideColumn
        wrapSection
      />

      {openModal && foodBanner && (
        <FoodDetailModal
          product={foodBanner}
          image={`${configData?.base_urls?.item_image_url}/${foodBanner?.image}`}
          open={openModal}
          handleModalClose={handleModalClose}
          setOpen={setOpenModal}
        />
      )}
    </>
  );
};

export default Banners;
