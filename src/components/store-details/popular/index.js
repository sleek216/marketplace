/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useEffect } from "react";
import Slider from "react-slick";
import usePopularProductsInStore from "../../../api-manage/hooks/react-query/product-details/usePopularProductsInStore";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import MarketplaceSectionHeader from "../../home/MarketplaceSectionHeader";
import ModuleMarketplaceProductCard from "../../home/ModuleMarketplaceProductCard";
import { settings } from "./settings";
import useGetCommonConditionStore from "../../../api-manage/hooks/react-query/common-conditions/useGetCommonConditionStore";

const sliderSx = {
  width: "100%",
  minWidth: 0,
  "& .slick-list": { margin: "0 -8px", overflow: "hidden" },
  "& .slick-track": {
    display: "flex !important",
    alignItems: "stretch",
  },
  "& .slick-slide": {
    height: "auto !important",
    display: "flex !important",
    padding: "0 8px",
  },
  "& .slick-slide > div": {
    display: "flex",
    flex: 1,
    height: "100%",
    width: "100%",
  },
};

const getSectionCopy = (storeShare) => {
  const moduleType = getCurrentModuleType() || storeShare?.moduleType;

  switch (moduleType) {
    case ModuleTypes.PHARMACY:
      return {
        title: "Common Conditions",
        subtitle: "Popular medicines for common needs",
      };
    case ModuleTypes.FOOD:
      return {
        title: "Recommended for you",
        subtitle: "Popular picks from this restaurant",
      };
    case ModuleTypes.ECOMMERCE:
      return {
        title: "Recommended for you",
        subtitle: "Top picks from this store",
      };
    default:
      return {
        title: "Recommended for you",
        subtitle: "Popular picks from this store",
      };
  }
};

const PopularInTheStore = ({ id, storeShare }) => {
  const offset = 1;
  const limit = 10;
  const { title, subtitle } = getSectionCopy(storeShare);

  const { data, refetch, isLoading } = usePopularProductsInStore({
    id,
    ...storeShare,
  });
  const {
    data: commonConditionitems,
    refetch: refetchCommonCondition,
    isLoading: isLoddingCondition,
  } = useGetCommonConditionStore({
    id,
    ...storeShare,
    offset,
    limit,
  });

  useEffect(() => {
    refetchCommonCondition();
    refetch();
  }, []);

  const isPharmacy = getCurrentModuleType() === "pharmacy";
  const products = isPharmacy
    ? commonConditionitems?.products
    : data?.items;
  const loading = isPharmacy ? isLoddingCondition : isLoading;

  if (!products?.length) return null;

  return (
    <CustomBoxFullWidth sx={{ mt: { xs: 1, md: 1.5 } }}>
      <CustomStackFullWidth spacing={1.5}>
        <MarketplaceSectionHeader title={title} subtitle={subtitle} mb={0} />
        <SliderCustom nopadding="true" sx={sliderSx}>
          {!loading && (
            <Slider {...settings}>
              {products.map((item, index) => (
                <Box key={item?.id || index} sx={{ width: "100%", height: "100%" }}>
                  <ModuleMarketplaceProductCard item={item} />
                </Box>
              ))}
            </Slider>
          )}
        </SliderCustom>
      </CustomStackFullWidth>
    </CustomBoxFullWidth>
  );
};

PopularInTheStore.propTypes = {};

export default PopularInTheStore;
