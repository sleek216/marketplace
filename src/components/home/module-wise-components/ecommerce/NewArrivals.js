/* eslint-disable react-hooks/exhaustive-deps */
import styled from "@emotion/styled";
import {
  Grid,
  Skeleton,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import useNewArrivals from "../../../../api-manage/hooks/react-query/product-details/useNewArrivals";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../../CustomImageContainer";
import MenuSimmer from "../../../Shimmer/MenuSimmer";
import ProductCardSimmer from "../../../Shimmer/ProductCardSimmer";
import {
  marketplaceProductGridColumns,
  marketplaceProductGridGap,
} from "../../../landing-page/marketplaceCardLayout";
import ModuleMarketplaceProductCard from "../../ModuleMarketplaceProductCard";
import MarketplaceSectionHeader from "../../MarketplaceSectionHeader";
import { HomeComponentsWrapper } from "../../HomePageComponents";
import TabMenu from "../../best-reviewed-items/TabMenu";

const NewArrivals = ({ bannerData }) => {
  const [menu, setMenu] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const { data, refetch, isLoading } = useNewArrivals();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.only("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const showSectionBanner =
    isLargeScreen && bannerData?.new_arrival_section_banner;
  const bannerCount = showSectionBanner ? 8 : 10;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      setMenu(["All", ...data?.categories?.map((item) => item.name)]);
      setFilteredData(data?.products);
    }
  }, [data]);

  useEffect(() => {
    if (selectedMenuIndex == 0) {
      setFilteredData(data?.products);
    } else {
      setFilteredData(
        data?.products?.filter(
          (item) =>
            item.category_id === data.categories[selectedMenuIndex - 1]?.id
        )
      );
    }
  }, [selectedMenuIndex]);

  const itemArrayManage = (itemArray) => {
    if (isMedium) {
      return itemArray?.slice?.(0, 6);
    }
    return itemArray?.slice?.(0, 8);
  };

  const sectionHeader = (
    <MarketplaceSectionHeader
      title="New on GIFT Marketplace"
      subtitle="Fresh arrivals just for you"
      mb={0}
      rightSlot={
        !isSmall ? (
          <ScrollBox>
            {isLoading ? (
              <MenuSimmer count={5} />
            ) : (
              menu?.length > 0 &&
              data?.categories?.length > 0 && (
                <TabMenu
                  selectedMenuIndex={selectedMenuIndex}
                  setSelectedMenuIndex={setSelectedMenuIndex}
                  menus={menu}
                />
              )
            )}
          </ScrollBox>
        ) : null
      }
    />
  );

  if (isSmall) {
    return (
      <HomeComponentsWrapper
        justifyContent="flex-start"
        alignItems="flex-start"
        mt="16px"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {isLoading ? (
              <Skeleton variant="text" width="180px" height={28} />
            ) : (
              data?.products && sectionHeader
            )}
            <ScrollBox sx={{ mt: 1.5 }}>
              {isLoading ? (
                <Skeleton variant="rectangular" width="50px" />
              ) : (
                menu?.length > 0 && (
                  <TabMenu
                    selectedMenuIndex={selectedMenuIndex}
                    setSelectedMenuIndex={setSelectedMenuIndex}
                    menus={menu}
                  />
                )
              )}
            </ScrollBox>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            {filteredData?.length > 0 &&
              filteredData?.slice(0, 4).map((product) => (
                <Grid item xs={6} key={product?.id} sx={{ display: "flex" }}>
                  <ModuleMarketplaceProductCard item={product} />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </HomeComponentsWrapper>
    );
  }

  return (
    <HomeComponentsWrapper
      justifyContent="flex-start"
      alignItems="stretch"
      mt="16px"
    >
      <Box sx={{ width: "100%", mb: 1.5 }}>
        {isLoading ? (
          <Skeleton variant="text" width="220px" height={28} />
        ) : (
          data?.products && sectionHeader
        )}
      </Box>

      <Box sx={{ width: "100%" }}>
        <CustomStackFullWidth>
          <Grid container spacing={2}>
            {showSectionBanner && (
              <Grid
                item
                lg={2.4}
                sx={{ display: { xs: "none", lg: "block" } }}
              >
                <CustomBoxFullWidth
                  sx={{
                    position: "relative",
                    height: "100%",
                    minHeight: "300px",
                    borderRadius: "2px",
                    overflow: "hidden",
                    "&:hover": {
                      img: { transform: "scale(1.02)" },
                    },
                  }}
                >
                  {isLoading ? (
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      height="100%"
                      width="100%"
                    />
                  ) : (
                    <CustomImageContainer
                      width="100%"
                      height="100%"
                      objectfit="cover"
                      borderRadius="2px"
                      src={bannerData?.new_arrival_section_banner_full_url}
                    />
                  )}
                </CustomBoxFullWidth>
              </Grid>
            )}
            {isLoading ? (
              <Grid item sm={12} md={9.6} container spacing={2}>
                {[...Array(8)].map((_, index) => (
                  <Grid item sm={4} md={3} key={index} sx={{ display: "flex" }}>
                    <ProductCardSimmer marginBottom="10px" />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid item xs={12} lg={showSectionBanner ? 9.6 : 12}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: marketplaceProductGridColumns,
                    gap: marketplaceProductGridGap,
                    minWidth: 0,
                  }}
                >
                  {filteredData?.slice(0, bannerCount)?.length > 0 &&
                    itemArrayManage(filteredData).map((product) => (
                      <Box key={product?.id} sx={{ display: "flex", minWidth: 0 }}>
                        <ModuleMarketplaceProductCard item={product} />
                      </Box>
                    ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </CustomStackFullWidth>
      </Box>
    </HomeComponentsWrapper>
  );
};

export const ScrollBox = styled(Box)({
  ".MuiTypography-root": { whiteSpace: "pre" },
  position: "relative",
  zIndex: "3",
});

NewArrivals.propTypes = {};

export default NewArrivals;
