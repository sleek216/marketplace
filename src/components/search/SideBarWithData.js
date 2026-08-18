import React, { forwardRef, useEffect, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Grid, Skeleton, Stack, Box } from "@mui/material";
import SearchFilter from "./search-filter";
import ProductCard, { CardWrapper } from "../cards/ProductCard";
import ModuleMarketplaceProductCard from "../home/ModuleMarketplaceProductCard";
import StoreCard from "../cards/StoreCard";
import EmptySearchResults from "../EmptySearchResults";
import AppliedFilters from "./AppliedFilters";
import DotSpin from "components/DotSpin";

// eslint-disable-next-line react/display-name
const SideBarWithData = forwardRef((props, ref) => {
  const {
    sidebarRef,
    sidebarScrollEnabled,
    searchValue,
    pageData,
    id,
    brand_id,
    currentTab,
    configData,
    isFetchingNextPage,
    currentView,
    filterData,
    setFilterData,
    selectedCategoriesHandler,
    selectedBrandsHandler,
    fromNav,
    linkRouteTo,
    toolbar,
  } = props;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Use setTimeout to set the state to true after 1 second (1000 milliseconds)
    const timeoutId = setTimeout(() => {
      setLoading(true);
    }, 5000);
    // Clear the timeout if the component unmounts before it fires
    return () => clearTimeout(timeoutId);
  }, []);

  const getProductShimmer = () => (
    <Grid item xs={6} sm={4} md={3}>
      <CardWrapper sx={{ height: "100%", minHeight: "320px" }}>
        <Stack spacing={1}>
          <Skeleton variant="rectangular" animation="pulse" height={150} />
          <Stack alignItems="center" justifyContent="center" padding="1rem">
            <Skeleton variant="text" animation="wave" height={20} width="80%" />
            <Skeleton variant="text" animation="wave" height={20} />
            <Skeleton variant="text" animation="wave" height={20} width="80%" />
          </Stack>
        </Stack>
      </CardWrapper>
    </Grid>
  );
  const getLayoutHandler = () => {
    if (currentTab === 0) {
      return (
        <>
          {currentView === 0 ? (
            <>
              {pageData?.pages?.length > 0 && (
                <>
                  {pageData?.pages?.map((page, pageIndex) =>
                    page?.products?.map((product, index) => (
                      <Grid
                        key={`search-item-${pageIndex}-${product?.id ?? index}`}
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        sx={{ display: "flex", "& > *": { width: "100%" } }}
                      >
                        <ModuleMarketplaceProductCard item={product} />
                      </Grid>
                    ))
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {pageData?.pages?.length > 0 && (
                <>
                  {pageData?.pages?.map((page, pageIndex) =>
                    page?.products?.map((product, index) => (
                      <Grid
                        key={`search-list-${pageIndex}-${product?.id ?? index}`}
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        sx={{ display: "flex", "& > *": { width: "100%" } }}
                      >
                        <ProductCard
                          item={product}
                          cardheight="150px"
                          cardType="vertical-type"
                          horizontalcard="true"
                          cardFor="list-view"
                        />
                      </Grid>
                    ))
                  )}
                </>
              )}
            </>
          )}
        </>
      );
    } else {
      return (
        <>
          {pageData?.pages?.length > 0 && (
            <>
              {pageData?.pages?.map((page) =>
                page?.stores?.map((item) => (
                  <Grid
                    key={item?.id ?? item?.slug}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ display: "flex", "& > *": { width: "100%" } }}
                  >
                    <StoreCard
                      item={item}
                      imageUrl={item?.cover_photo_full_url}
                    />
                  </Grid>
                ))
              )}

            </>
          )}
        </>
      );
    }
  };

  const emptyHandler = () => {
    if (currentTab === 0) {
      if (!isFetchingNextPage && pageData?.pages[0]?.products?.length === 0) {
        return (
          <Grid item xs={12}>
            <EmptySearchResults text="Items Not Found!" isItems />
          </Grid>
        );
      }
    } else {
      if (!isFetchingNextPage && pageData?.pages[0]?.stores?.length === 0) {
        return (
          <Grid item xs={12}>
            <EmptySearchResults text="Stores Not Found!" />
          </Grid>
        );
      }
    }
  };

  return (
    <CustomBoxFullWidth>
      <Grid container columnSpacing={{ xs: 0, lg: 3 }} alignItems="flex-start">
        <Grid
          item
          xs={0}
          sm={0}
          md={0}
          lg={3}
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <CustomBoxFullWidth
            ref={sidebarRef}
            sx={{
              position: "sticky",
              top: { lg: "84px" },
              maxHeight: "calc(100vh - 110px)",
              overflowY: "auto",
              pr: 0.5,
              scrollbarWidth: "thin",
            }}
          >
            <SearchFilter
              searchValue={searchValue}
              id={id}
              brand_id={brand_id}
              selectedCategoriesHandler={selectedCategoriesHandler}
              fromNav={fromNav}
              selectedBrandsHandler={selectedBrandsHandler}
              currentTab={currentTab}
              linkRouteTo={linkRouteTo}
            />
          </CustomBoxFullWidth>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={9}>
          <CustomStackFullWidth spacing={1.5} sx={{ minWidth: 0 }}>
            {toolbar}
            <AppliedFilters
              filterData={filterData}
              //setFilterData={setFilterData}
            />
            <CustomBoxFullWidth ref={ref}>
              <Grid container spacing={2} alignItems="stretch">
                {getLayoutHandler()}
                {isFetchingNextPage && (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{
                      paddingBlockEnd: "30px",
                      paddingBlockStart: "30px",
                    }}
                  >
                    <Stack sx={{ marginTop: "2rem" }}>
                      <DotSpin />
                    </Stack>
                  </Grid>
                )}
                {emptyHandler()}
              </Grid>
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </Grid>
      </Grid>
    </CustomBoxFullWidth>
  );
});

SideBarWithData.propTypes = {};

export default SideBarWithData;
