import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Scrollbar } from "../../srollbar";
import {
  alpha,
  Drawer,
  Skeleton,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomSlider from "../../search/CustomSlider";
import { useTheme } from "@emotion/react";
import CheckboxWithChild from "./CheckboxWithChild";
import HighToLow from "../../../sort/HighToLow";
import VegNonVegCheckBox from "../../group-buttons/OutlinedGroupButtons";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { useSelector } from "react-redux";
import StoreFilter from "components/store-details/middle-section/StoreFilter";
import { debounce } from "utils/CustomFunctions";

export const CustomPaperBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
  borderRadius: "2px",
  color: theme.palette.text.primary,
  boxShadow: "none",
}));

const SectionTitle = ({ children }) => (
  <Typography
    component="h3"
    sx={{
      fontWeight: 700,
      fontSize: { xs: "14px", md: "15px" },
      lineHeight: 1.2,
      color: "text.primary",
    }}
  >
    {children}
  </Typography>
);

const priceFieldSx = {
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
  "& .MuiOutlinedInput-root": {
    borderRadius: "2px",
    fontWeight: 500,
    fontSize: "13px",
    minHeight: 36,
    bgcolor: "background.paper",
  },
  "& .MuiOutlinedInput-input": {
    py: "8px",
  },
};

const initialState = {
  categories: [],
  isSelected: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setCategories":
      return {
        ...state,
        categories: action.payload,
      };
    case "setIsSelected":
      return {
        ...state,
        isSelected: action.payload,
      };
    default:
      return state;
  }
};

const ACTION = {
  setCategories: "setCategories",
  setIsSelected: "setIsSelected",
};

const Sidebar = (props) => {
  const {
    open,
    onClose,
    ownCategories,
    handleCategoryId,
    handleChangePrice,
    priceFilterRange,
    storeId,
    handleSortBy,
    sortBy,
    isSmall,
    selectedCategories,
    handleSelection,
    checkState,
    setCheckState,
    setRatingCount,
    setFilterData,
    ratingCount,
    filterItem,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { configData } = useSelector((state) => state.configData);
  const { t } = useTranslation();
  const theme = useTheme();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    noSsr: true,
  });
  const [minMax, setMinMax] = useState([0, 0]);

  const handleOnSuccess = (res) => {
    if (ownCategories?.length > 0 && res?.data?.length > 0) {
      const common = res?.data?.filter((item) =>
        ownCategories.some((oItem) => oItem === item?.id)
      );
      dispatch({ type: ACTION.setCategories, payload: common });
    }
  };

  const searchKey = "";
  const queryKey = "stores-categories";
  const { refetch, isFetching } = useGetCategories(
    searchKey,
    handleOnSuccess,
    queryKey
  );

  useEffect(() => {
    refetch();
  }, [storeId]);

  const handleMinMax = (value) => {
    if (value[0] === 0) {
      value[0] = priceFilterRange?.[0]?.min_price;
    }
    setMinMax(value);
    handleChangePrice(value);
  };

  const handleMinChange = useMemo(
    () =>
      debounce((value) => {
        setMinMax([+value, minMax[1]]);
      }, 200),
    [minMax]
  );

  const handleMaxChange = useMemo(
    () =>
      debounce((value) => {
        setMinMax([minMax[0], +value]);
      }, 200),
    [minMax]
  );

  useEffect(() => {
    if (minMax[1] > 0) {
      handleChangePrice(minMax);
    }
  }, [minMax]);

  const categoriesCheckBoxHandler = (data) => {
    handleCategoryId?.(data);
  };

  const content = (
    <CustomStackFullWidth sx={{ padding: { xs: "1rem", lg: "0 0.25rem" } }} spacing={2}>
      {isSmall && (
        <CustomBoxFullWidth sx={{ mt: "3rem" }}>
          <HighToLow handleSortBy={handleSortBy} sortBy={sortBy} />
          <StoreFilter
            setRatingCount={setRatingCount}
            ratingCount={ratingCount}
            filterTypeItems={filterItem}
            setFilterData={setFilterData}
          />
        </CustomBoxFullWidth>
      )}

      {(state.categories?.length > 0 || isFetching) && (
        <CustomStackFullWidth spacing={1.25}>
          <SectionTitle>{t("Categories")}</SectionTitle>
          <CustomPaperBox>
            <Box sx={{ px: 1.25, py: 1 }}>
              {isFetching && state.categories?.length === 0 ? (
                <CustomStackFullWidth spacing={1}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      height={28}
                      sx={{ borderRadius: "2px" }}
                    />
                  ))}
                </CustomStackFullWidth>
              ) : (
                <Scrollbar style={{ maxHeight: "280px" }} scrollbarMinSize={5}>
                  <CustomStackFullWidth spacing={0.25}>
                    {state.categories?.map((item, index) => (
                      <CheckboxWithChild
                        key={item?.id || index}
                        item={item}
                        checkHandler={categoriesCheckBoxHandler}
                        selectedItems={selectedCategories}
                      />
                    ))}
                  </CustomStackFullWidth>
                </Scrollbar>
              )}
            </Box>
          </CustomPaperBox>
        </CustomStackFullWidth>
      )}

      {getCurrentModuleType() === ModuleTypes.FOOD && isSmall && (
        <VegNonVegCheckBox
          selected={state.type}
          handleSelection={handleSelection}
          checkState={checkState}
          setCheckState={setCheckState}
        />
      )}

      <CustomStackFullWidth spacing={1.25}>
        <SectionTitle>{t("Price Range")}</SectionTitle>
        <CustomPaperBox>
          <CustomStackFullWidth p={1.5} spacing={1.25}>
            <CustomSlider
              handleChangePrice={handleMinMax}
              minMax={minMax}
              priceFilterRange={
                priceFilterRange?.length > 0 && priceFilterRange[0]
              }
              store
            />
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              spacing={1}
              pt={0.5}
            >
              <TextField
                type="number"
                size="small"
                fullWidth
                value={minMax[0] <= 0 ? "" : minMax[0]}
                onChange={(e) => handleMinChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box
                      component="span"
                      sx={{
                        mr: 0.75,
                        fontSize: "12px",
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {configData?.currency_symbol}
                    </Box>
                  ),
                }}
                sx={priceFieldSx}
              />
              <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
                –
              </Typography>
              <TextField
                type="number"
                size="small"
                fullWidth
                value={minMax[1] === 0 ? "" : minMax[1]}
                onChange={(e) => handleMaxChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box
                      component="span"
                      sx={{
                        mr: 0.75,
                        fontSize: "12px",
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {configData?.currency_symbol}
                    </Box>
                  ),
                }}
                sx={priceFieldSx}
              />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </CustomPaperBox>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );

  if (lgUp) {
    return (
      <Box
        sx={{
          width: "100%",
          py: "3px",
          height: "100%",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          width: 300,
          borderRadius: 0,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

Sidebar.propTypes = {};

export default React.memo(Sidebar);
