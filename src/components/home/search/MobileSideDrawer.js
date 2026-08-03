import { X as CloseIcon } from "lucide-react";
import {
  Checkbox,
  Drawer,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
  alpha,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import HighToLow from "../../../sort/HighToLow";
import CustomRatings from "../../search/CustomRatings";
import SearchFilter from "../../search/search-filter";
import NewSortBy from "components/search/NewSortBy";

const MobileSideDrawer = (props) => {
  const {
    open,
    onClose,
    handleSortBy,
    sortBy,
    searchValue,
    id,
    brand_id,
    setPageData,
    selectedCategoriesHandler,
    selectedBrandsHandler,
    currentTab,
    handleChangeRatings,
    filterData,
    setFilterData,
    handleCheckbox,
    ratingValue,
    handleSortByNew,
    newSort,
  } = props;
  const { t } = useTranslation();
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: { xs: "88%", sm: "380px" },
          maxWidth: "420px",
          borderRadius: "16px 0 0 16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: (theme) =>
            `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          flexShrink: 0,
        }}
      >
        <Typography fontSize="16px" fontWeight="700">
          {t("Filter By")}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.12),
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.22),
            },
          }}
        >
          <CloseIcon size={16} />
        </IconButton>
      </Box>

      {/* ── Scrollable body ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2 }}>
        <Stack spacing={2.5}>

          {/* Sort By */}
          {currentTab !== 1 && (
            <Stack spacing={1}>
              <Typography fontSize="13px" fontWeight="600" color="text.secondary" textTransform="uppercase" letterSpacing="0.5px">
                {t("Sort By")}
              </Typography>
              <HighToLow handleSortBy={handleSortBy} sortBy={sortBy} />
            </Stack>
          )}
          {currentTab !== 0 && (
            <Stack spacing={1}>
              <Typography fontSize="13px" fontWeight="600" color="text.secondary" textTransform="uppercase" letterSpacing="0.5px">
                {t("Sort By")}
              </Typography>
              <NewSortBy handleSortBy={handleSortByNew} sortBy={newSort} />
            </Stack>
          )}

          <Divider />

          {/* Filter checkboxes */}
          <Stack spacing={0.5}>
            <Typography fontSize="13px" fontWeight="600" color="text.secondary" textTransform="uppercase" letterSpacing="0.5px">
              {t("Filter")}
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                {currentTab === 0 ? (
                  filterData?.slice(1, 4)?.map?.((item, index) => (
                    <FormControlLabel
                      key={index}
                      sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px", fontWeight: item?.checked ? "600" : "400" } }}
                      control={
                        <Checkbox
                          size="small"
                          checked={item?.checked}
                          onChange={(e) => handleCheckbox(item, e)}
                          name={item?.label}
                        />
                      }
                      label={item?.label}
                    />
                  ))
                ) : (
                  filterData?.filter((_, i) => i >= 0 && i <= 3)?.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px", fontWeight: item?.checked ? "600" : "400" } }}
                      control={
                        <Checkbox
                          size="small"
                          checked={item?.checked}
                          onChange={(e) => handleCheckbox(item, e)}
                          name={item?.label}
                        />
                      }
                      label={item?.label}
                    />
                  ))
                )}
              </Grid>
              {currentTab !== 0 && (
                <Grid item xs={6}>
                  {filterData?.filter((_, i) => i >= 4 && i <= 7)?.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px", fontWeight: item?.checked ? "600" : "400" } }}
                      control={
                        <Checkbox
                          size="small"
                          checked={item?.checked}
                          onChange={(e) => handleCheckbox(item, e)}
                          name={item?.label}
                        />
                      }
                      label={item?.label}
                    />
                  ))}
                </Grid>
              )}
            </Grid>
          </Stack>

          <Divider />

          {/* Ratings */}
          <Stack spacing={1} alignItems="flex-start">
            <Typography fontSize="13px" fontWeight="600" color="text.secondary" textTransform="uppercase" letterSpacing="0.5px">
              {t("Ratings")}
            </Typography>
            <CustomRatings
              ratingValue={ratingValue}
              fontSize="24px"
              handleChangeRatings={handleChangeRatings}
            />
          </Stack>

          <Divider />

          {/* Categories / Brands */}
          <SearchFilter
            searchValue={searchValue}
            id={id}
            brand_id={brand_id}
            sideDrawer
            selectedBrandsHandler={selectedBrandsHandler}
            selectedCategoriesHandler={selectedCategoriesHandler}
            currentTab={currentTab}
          />

        </Stack>
      </Box>
    </Drawer>
  );
};

MobileSideDrawer.propTypes = {};

export default MobileSideDrawer;
