import React, { useEffect, useMemo, useReducer, useState } from "react";
import CustomSearch from "../../custom-search/CustomSearch";
import {
  alpha,
  Badge,
  Grid,
  IconButton,
  NoSsr,
  Skeleton,
  Stack,
  Typography, useMediaQuery, useTheme,
} from "@mui/material";
import Sidebar from "./Sidebar";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Filter as FilterIcon } from "lucide-react";
import useGetStoresCategoriesItem from "../../../api-manage/hooks/react-query/stores-categories/useGetStoresCategoriesItem";
import ProductCard, { CardWrapper } from "../../cards/ProductCard";
import ModuleMarketplaceProductCard from "../../home/ModuleMarketplaceProductCard";
import { useRouter } from "next/router";
import useGetSearchedStoreItems from "../../../api-manage/hooks/react-query/store/useGetSearchedStoreItems";
import { ACTION, initialState, reducer } from "./states";
import CustomEmptyResult from "../../custom-empty-result";
import notFoundImage from "../../../../public/static/empty.png";
import { useTranslation } from "react-i18next";
import VegNonVegCheckBox from "../../group-buttons/OutlinedGroupButtons";
import { getModuleId } from "helper-functions/getModuleId";
import HighToLow from "../../../sort/HighToLow";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useSelector } from "react-redux";


import { getDiscountedAmount } from "helper-functions/CardHelpers";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { removeDuplicates } from "utils/CustomFunctions";
import CustomPagination from "../../custom-pagination";
import DotSpin from "../../DotSpin";
import { Search as SearchIcon } from "lucide-react";
import StoreFilter from "components/store-details/middle-section/StoreFilter";
import {filterTypeItems} from "components/search/filterTypes";
import { Grid2x2 as GridViewIcon, List as ListViewIcon } from "lucide-react";

export const handleShimmerProducts = () => {
  return (
    <>
      {[...Array(3)].map((item, index) => {
        return (
          <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
            <CardWrapper>
              <CustomStackFullWidth
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Skeleton
                  variant="rectangular"
                  animation="pulse"
                  width="100%"
                  height={170}
                />
                <CustomStackFullWidth
                  padding="1rem"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="80%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="40%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="30%"
                  />
                  {/*<RatingStarIcon fontSize="small" color="#808080" />*/}
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={70}
                      height={20}
                    />

                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={70}
                      height={20}
                    />
                  </Stack>
                </CustomStackFullWidth>
              </CustomStackFullWidth>
            </CardWrapper>
          </Grid>
        );
      })}
    </>
  );
};

export const getDiscountedPriceAmount = (item) => {
  return getDiscountedAmount(
    item?.price,
    item?.discount,
    item?.discount_type,
    item?.store_discount,
    item?.quantity
  );
};

export const getHighToLow = (data) => {
  if (data?.length > 0) {
    return data.sort(
      (a, b) => getDiscountedPriceAmount(b) - getDiscountedPriceAmount(a)
    );
  } else {
    return data;
  }
};
// Sort products by low to high value
export const getLowToHigh = (data) => {
  if (data?.length > 0) {
    return data.sort(
      (a, b) => getDiscountedPriceAmount(a) - getDiscountedPriceAmount(b)
    );
  } else {
    return data;
  }
};
const MiddleSection = (props) => {
  const { storeDetails, ownCategories, isSmall, storeShare, setExpanded } =
    props;
  const theme =useTheme()
  const isSmallSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filterData,setFilterData] = useState([])
  const [ratingCount,setRatingCount] = useState(0)
  const [currentView, setCurrentView] = useState(0); // 0: grid, 1: list
  const [checkState, setCheckState] = React.useState({
    veg: false,
    non_veg: false,
  });
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const router = useRouter();
  const { id } = router.query;
  const storeId = storeDetails?.id;
  const limit = 10;
  const [offset, setOffset] = useState(1);
  const pageParams = {
    storeId: storeId,
    categoryId: state.categoryId,
    offset: offset,
    minMax: state.minMax,
    type: state.type,
    limit: limit,
    filterData: filterData,
    ratingCount:ratingCount,
    ...storeShare,
  };
  const searchPageParams = {
    storeId: storeId,
    searchKey: state.searchKey,
    offset: offset,
    type: "all",
    limit: limit,
    ...storeShare,
  };
  const handleSearchSuccess = (res) => {
    if (res) {
      dispatch({
        type: ACTION.setData,
        payload: res,
      });
    }
  };

  const {
    data: searchData,
    refetch: refetchSearchData,
    isRefetching: isRefetchingSearch,
  } = useGetSearchedStoreItems(searchPageParams);

  const handleLocalStorageSave = (resProducts) => {
    if (offset === 1) {
      let visitedStoresProducts = JSON.parse(
        localStorage.getItem("visitedStoresProducts")
      );
      if (visitedStoresProducts) {
        if (visitedStoresProducts?.length > 0) {
          const isThisStoresProductExist = visitedStoresProducts?.filter(
            (item) => item?.store_id === storeDetails?.id
          );
          if (isThisStoresProductExist?.length > 0) {
            return null;
          } else {
            resProducts
              ?.slice(0, 5)
              ?.forEach((item) => visitedStoresProducts.push(item));
          }
          localStorage.setItem(
            "visitedStoresProducts",
            JSON.stringify(visitedStoresProducts)
          );
        }
      } else {
        const products =
          resProducts?.length > 5 ? resProducts?.slice(0, 5) : resProducts;
        localStorage.setItem("visitedStoresProducts", JSON.stringify(products));
      }
    }
  };

  const handleSuccess = (res) => {
    if (res) {
      if (res?.products?.length > 0) {
        handleLocalStorageSave(res?.products);
      }
      const sortedProducts = getHighToLow(res?.products || []);
      const withoutDuplicacy = removeDuplicates(sortedProducts, "id");
      dispatch({
        type: ACTION.setData,
        payload: {
          ...res,
          products: withoutDuplicacy,
        },
      });
      dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
    }
  };
  const {
    data,
    refetch,
    isRefetching,
    isLoading: isLoadingStoresCategories,
  } = useGetStoresCategoriesItem(pageParams);
  useEffect(() => {
    if (state.searchKey === "" || !state.searchKey) {
      refetch();
    }
  }, [state.categoryId, state.type, id,pageParams?.filterData,ratingCount]);
  useEffect(() => {
    if (state.searchKey) {
      const pages = searchData?.pages;
      if (pages?.length > 0) {
        handleSuccess(pages[pages.length - 1]);
      }
    } else {
      const pages = data?.pages;
      if (pages?.length > 0) {
        handleSuccess(pages[pages.length - 1]);
      }
    }
  }, [data, searchData, state.categoryId]);

  useEffect(() => {
    setOffset(1);
  }, [storeId]);

  useEffect(() => {
    setOffset(1);
  }, [JSON.stringify(filterData), ratingCount]);

  const handleCategoryId = (id) => {
    setOffset(1);
    if (id?.checked) {
      const newIds = [...state.categoryId, id?.id];
      dispatch({
        type: ACTION.setCategoryId,
        payload: [...new Set(newIds)],
      });
    } else {
      const newIds = state.categoryId?.filter((item) => item !== id?.id);
      dispatch({
        type: ACTION.setCategoryId,
        payload: newIds,
      });
    }
    dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
  };

  useEffect(() => {
    if (state.searchKey && state.searchKey !== "") {
      refetchSearchData();
    } else if (!state.searchKey) {
      refetch();
    }
  }, [state.searchKey, offset]);
  useEffect(() => {
    if (JSON.stringify(state.minMax) !== JSON.stringify([0, 1])) {
      refetch();
    }
  }, [state.minMax]);

  useEffect(() => {
    if (state?.data?.products?.length > 0) {
      sortWiseDataHandle();
    }
  }, [state.sortBy]);

  const handleChangePrice = (value) => {
    dispatch({ type: ACTION.setMinMax, payload: value });
    setOffset(1);
  };
  const handleSelection = () => {
    if (checkState?.veg && !checkState?.non_veg) {
      dispatch({
        type: ACTION.setType,
        payload: "veg",
      });
    } else if (checkState?.non_veg && !checkState?.veg) {
      dispatch({
        type: ACTION.setType,
        payload: "non_veg",
      });
    } else if (checkState?.veg && checkState?.non_veg) {
      dispatch({
        type: ACTION.setType,
        payload: "all",
      });
    } else {
      dispatch({
        type: ACTION.setType,
        payload: "all",
      });
    }
  };
  useEffect(() => {
    handleSelection();
    setOffset(1);
  }, [checkState?.veg, checkState.non_veg]);

  let moduleId = getModuleId()
    ? getModuleId()
    : parseInt(router.query.module_id);
  const handleSearchResult = (value) => {
    setOffset(1);
    dispatch({ type: ACTION.setOffSet, payload: 1 });
    if (value !== "") {
      dispatch({ type: ACTION.setSearchKey, payload: value });
      dispatch({ type: ACTION.setMinMax, payload: [0, 1] });
    } else {
      dispatch({ type: ACTION.setSearchKey, payload: null });
    }
  };

  const sortWiseDataHandle = () => {
    let newData;
    if (state.sortBy === "high") {
      newData = {
        ...state.data,
        products: getHighToLow(state.data.products),
      };
    } else {
      newData = {
        ...state.data,
        products: getLowToHigh(state.data.products),
      };
    }
    dispatch({ type: ACTION.setData, payload: newData });
  };

  const handleSortBy = (value) => {
    dispatch({
      type: ACTION.setSortBy,
      payload: value,
    });
    dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
  };

  const priceRangeWiseSorted = (products) => {
    if (products.length > 0) {
      return products?.filter(
        (newItem) =>
          newItem?.price >= state.minMax[0] && newItem?.price <= state.minMax[1]
      );
    }
  };

  const minMaxWiseSorted = (products) => {
    if (state.minMax[0] === 0 && state.minMax[1] === 1) {
      return products;
    } else {
      return priceRangeWiseSorted(products);
    }
  };

  const getCategoryWiseProduct = (products) => {
    const isAllExist = state.categoryId?.length === 0 ? true : false;
    if (isAllExist) {
      return minMaxWiseSorted(products);
    } else {
      const categoryToString = state.categoryId?.map(String);
      const filteredData = products?.filter((item) =>
        item?.category_ids.filter((item) => categoryToString?.includes(item.id))
      );

      return minMaxWiseSorted(filteredData);
    }
  };

  const handleOpenSerach = () => {
    setOpen(!open);
  };

  const browseTotalSize = data?.pages?.[0]?.total_size ?? state?.data?.total_size ?? 0;
  const searchTotalSize =
    searchData?.pages?.[searchData.pages.length - 1]?.total_size ??
    state?.data?.total_size ??
    0;
  const paginationTotalSize = state.searchKey ? searchTotalSize : browseTotalSize;
  const showPagination =
    paginationTotalSize > limit &&
    Math.ceil(paginationTotalSize / limit) > 1;

  const checkModuleWiseFilterItem= () => {
    if(getCurrentModuleType() === ModuleTypes.FOOD){
      return filterTypeItems
    }else{
      return filterTypeItems?.filter((item)=>item.value!=="available_now")

    }
  }

  const appliedFilterCount = useMemo(() => {
    let count = filterData?.length ?? 0;
    if (ratingCount > 0) count += 1;
    count += state.categoryId?.length ?? 0;
    if (state.sortBy && state.sortBy !== "Default") count += 1;
    if (state.type && state.type !== "all") count += 1;
    if (JSON.stringify(state.minMax) !== JSON.stringify([0, 1])) count += 1;
    return count;
  }, [
    filterData,
    ratingCount,
    state.categoryId,
    state.sortBy,
    state.type,
    state.minMax,
  ]);

  return (
    <NoSsr>
      <CustomBoxFullWidth>
        {moduleId && (
          <Grid container sx={{ mt: { xs: "5px", sm: "20px" } }}>
            <Grid
              item
              xs={12}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={3} md={5} align="left">
                {getCurrentModuleType() === "pharmacy" ? (
                  <Typography
                    fontSize={{ xs: "13px", md: "15px" }}
                    textAlign="start"
                    fontWeight="600"
                  >
                    {t("All Items")}
                  </Typography>
                ) : (
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: "16px", md: "18px" },
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: "text.primary",
                    }}
                  >
                    {t("All Products")}
                    {data?.pages[0]?.total_size
                      ? ` (${data?.pages[0]?.total_size})`
                      : ""}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={9} md={7} container spacing={3}>
                {isSmall ? (
                  <Grid item xs={12}>
                    <CustomStackFullWidth
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      // spacing={1}
                    >
                      {!open ? (
                        <IconButton
                          onClick={handleOpenSerach}
                          sx={{
                            color: "primary.main",
                            display: { lg: "none" },
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      ) : (
                        <CustomBoxFullWidth
                          sx={{
                            width: open ? "200px" : "0px",
                            transition: "width 0.5s ease-in-out",
                          }}
                        >
                          {open && (
                            <CustomSearch
                              label={t("Search for items...")}
                              selectedValue={state.searchKey}
                              handleSearchResult={handleSearchResult}
                              type2
                            />
                          )}
                        </CustomBoxFullWidth>
                      )}
                      <Badge
                        color="primary"
                        badgeContent={appliedFilterCount}
                        invisible={appliedFilterCount === 0}
                        overlap="circular"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "10px",
                            fontWeight: 700,
                            minWidth: "18px",
                            height: "18px",
                            padding: "0 4px",
                          },
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            dispatch({
                              type: ACTION.setIsSidebarOpen,
                              payload: true,
                            })
                          }
                          aria-label={t("Filter")}
                          sx={{
                            color: "primary.main",
                            display: { lg: "none" },
                            border: (theme) =>
                              appliedFilterCount > 0
                                ? `1px solid ${theme.palette.primary.main}`
                                : "none",
                            borderRadius: "8px",
                          }}
                        >
                          <FilterIcon size={20} />
                        </IconButton>
                      </Badge>
                      <Stack direction="row" spacing={0.5} sx={{ ml: 0.5 }}>
                        <IconButton
                          onClick={() => setCurrentView(0)}
                          sx={{
                            color: currentView === 0 ? "primary.main" : "text.secondary",
                            border: (theme) =>
                              `1px solid ${
                                currentView === 0
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.neutral[400], 0.5)
                              }`,
                            borderRadius: "8px",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <GridViewIcon size={16} />
                        </IconButton>
                        <IconButton
                          onClick={() => setCurrentView(1)}
                          sx={{
                            color: currentView === 1 ? "primary.main" : "text.secondary",
                            border: (theme) =>
                              `1px solid ${
                                currentView === 1
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.neutral[400], 0.5)
                              }`,
                            borderRadius: "8px",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <ListViewIcon size={16} />
                        </IconButton>
                      </Stack>
                      {getCurrentModuleType() === "food" && !isSmall && (
                        <VegNonVegCheckBox
                          selected={state.type}
                          handleSelection={handleSelection}
                          checkState={checkState}
                          setCheckState={setCheckState}
                        />
                      )}
                    </CustomStackFullWidth>
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={7} md={getCurrentModuleType() === ModuleTypes.FOOD?4:6} >
                      {getCurrentModuleType() === ModuleTypes.FOOD ? (
                        <VegNonVegCheckBox
                          selected={state.type}
                          handleSelection={handleSelection}
                          checkState={checkState}
                          setCheckState={setCheckState}
                        />
                      ) : (
                        <CustomSearch
                          label={t("Search for items...")}
                          selectedValue={state.searchKey}
                          handleSearchResult={handleSearchResult}
                          type2
                        />
                      )}
                    </Grid>
                    <Grid item xs={7}  md={getCurrentModuleType() === ModuleTypes.FOOD?8:6}  align="right">
                      {getCurrentModuleType() === ModuleTypes.FOOD ? (
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="right">
                          <CustomSearch
                            label={t("Search for items...")}
                            selectedValue={state.searchKey}
                            handleSearchResult={handleSearchResult}
                            type2
                          />
                          <StoreFilter
                            key={storeId}
                            setRatingCount={setRatingCount}
                            ratingCount={ratingCount}
                            filterTypeItems={checkModuleWiseFilterItem()}
                            setFilterData={setFilterData}
                          />
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              onClick={() => setCurrentView(0)}
                              sx={{
                                color: currentView === 0 ? "primary.main" : "text.secondary",
                                border: (theme) =>
                                  `1px solid ${
                                    currentView === 0
                                      ? theme.palette.primary.main
                                      : alpha(theme.palette.neutral[400], 0.5)
                                  }`,
                                borderRadius: "2px",
                                width: 34,
                                height: 34,
                              }}
                            >
                              <GridViewIcon size={17} />
                            </IconButton>
                            <IconButton
                              onClick={() => setCurrentView(1)}
                              sx={{
                                color: currentView === 1 ? "primary.main" : "text.secondary",
                                border: (theme) =>
                                  `1px solid ${
                                    currentView === 1
                                      ? theme.palette.primary.main
                                      : alpha(theme.palette.neutral[400], 0.5)
                                  }`,
                                borderRadius: "2px",
                                width: 34,
                                height: 34,
                              }}
                            >
                              <ListViewIcon size={17} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <HighToLow
                            handleSortBy={handleSortBy}
                            sortBy={state.sortBy}
                          />
                          <StoreFilter
                            key={storeId}
                            setRatingCount={setRatingCount}
                            ratingCount={ratingCount}
                            filterTypeItems={checkModuleWiseFilterItem()}
                            setFilterData={setFilterData}
                          />
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              onClick={() => setCurrentView(0)}
                              sx={{
                                color: currentView === 0 ? "primary.main" : "text.secondary",
                                border: (theme) =>
                                  `1px solid ${
                                    currentView === 0
                                      ? theme.palette.primary.main
                                      : alpha(theme.palette.neutral[400], 0.5)
                                  }`,
                                borderRadius: "2px",
                                width: 34,
                                height: 34,
                              }}
                            >
                              <GridViewIcon size={17} />
                            </IconButton>
                            <IconButton
                              onClick={() => setCurrentView(1)}
                              sx={{
                                color: currentView === 1 ? "primary.main" : "text.secondary",
                                border: (theme) =>
                                  `1px solid ${
                                    currentView === 1
                                      ? theme.palette.primary.main
                                      : alpha(theme.palette.neutral[400], 0.5)
                                  }`,
                                borderRadius: "2px",
                                width: 34,
                                height: 34,
                              }}
                            >
                              <ListViewIcon size={17} />
                            </IconButton>
                          </Stack>
                        </Stack>

                      )}

                    </Grid>{" "}
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Stack
                width="100%"
                sx={{
                  mt: "20px",
                  mb: "20px",
                  borderBottom: (theme) =>
                    `2px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
                }}
              ></Stack>
            </Grid>
            <Grid item xs={0} sm={0} md={0} lg={3}>
              <Sidebar
                {...props}
                onClose={() =>
                  dispatch({ type: ACTION.setIsSidebarOpen, payload: false })
                }
                open={state.isSidebarOpen}
                handleCategoryId={handleCategoryId}
                handleChangePrice={handleChangePrice}
                selectedCategories={state.categoryId}
                // priceFilterRange={handlePriceFilterRange(
                //   storeDetails?.price_range
                // )}
                ownCategories={ownCategories}
                priceFilterRange={storeDetails?.price_range}
                storesApiLoading={isRefetching}
                searchIsLoading={refetchSearchData}
                storeId={id}
                handleSortBy={handleSortBy}
                sortBy={state.sortBy}
                isSmall={isSmall}
                selected={state.type}
                handleSelection={handleSelection}
                checkState={checkState}
                setCheckState={setCheckState}
                filterItem={checkModuleWiseFilterItem()}
                setFilterData={setFilterData}
                ratingCount={ratingCount}
                setRatingCount={setRatingCount}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={9}
              container
              spacing={3}
              alignItems="flex-start"
            >
              <Grid item xs={12} container spacing={2}>
                {isLoadingStoresCategories && !state?.data?.products?.length ? (
                  handleShimmerProducts()
                ) : (
                  <>
                    {state.data &&
                      state.data?.products?.length > 0 &&
                      getCategoryWiseProduct(state.data?.products)?.map(
                        (item, index) => {
                          return (
                            <Grid
                              item
                              key={index}
                              xs={currentView === 0 ? 6 : 12}
                              sm={currentView === 0 ? 4 : 6}
                              md={currentView === 0 ? 3 : 6}
                              lg={currentView === 0 ? 3 : 6}
                              sx={currentView === 0 ? { display: "flex" } : undefined}
                            >
                              {currentView === 0 ? (
                                <ModuleMarketplaceProductCard item={item} />
                              ) : (
                                <ProductCard
                                  key={item?.id}
                                  item={item}
                                  cardheight="150px"
                                  cardFor="list-view"
                                  cardType="vertical-type"
                                  horizontalcard="true"
                                />
                              )}
                            </Grid>
                          );
                        }
                      )}
                  </>
                )}
                {((isRefetching || isRefetchingSearch) &&
                  (state?.data?.products?.length > 0 || offset > 1)) && (
                  <Grid item container xs={12}>
                    <Grid item xs={12}>
                      <Stack sx={{ minHeight: "120px", marginTop: "1rem" }}>
                        <DotSpin />
                      </Stack>
                    </Grid>
                  </Grid>
                )}
                {state.data?.products?.length === 0 && !isRefetching && (
                  <Stack width="100%" paddingTop={{ xs: "0px", md: "30px" }}>
                    <CustomEmptyResult
                      image={notFoundImage}
                      label="Nothing found"
                      width="200px"
                      height="200px"
                    />
                  </Stack>
                )}
              </Grid>

              {showPagination && (
                <Grid item xs={12}>
                  <CustomPagination
                    total_size={paginationTotalSize}
                    page_limit={limit}
                    offset={offset}
                    setOffset={(page) => {
                      setOffset(page);
                      setExpanded?.(false);
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </CustomBoxFullWidth>
    </NoSsr>
  );
};

export default  React.memo(MiddleSection);
