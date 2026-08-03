import { Grid, Stack, Typography, useMediaQuery } from "@mui/material";

import {
  CustomFavICon,
  FoodSubTitleTypography,
} from "../food-card/FoodCard.style";
import { Heart as FavoriteIcon, HeartOff as FavoriteBorderIcon } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import {
  CustomOverlayBox,
  CustomStackForFoodModal,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { isAvailable } from "utils/CustomFunctions";
import CustomImageContainer from "../../CustomImageContainer";
import CustomRatingBox from "../../CustomRatingBox";
import { FoodHalalHaram, FoodVegNonVegFlag } from "../../cards/SpecialCard";
import NotAvailableCard from "./NotAvailableCard";
import React from "react";
import ManualExpectedDeliveryInfo from "../../product-details/ManualExpectedDeliveryInfo";

const FoodDetailsManager = (props) => {
  const {
    configData,
    handleDiscountChip,
    modalData,
    product,
    t,
    router,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    theme,
    handleRouteToStore,
  } = props;
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Grid container direction="row">
      {/* ── IMAGE SECTION ── */}
      <Grid
        item
        xs={12}
        md={12}
        sx={{ position: "relative", overflow: "hidden" }}
      >
        {handleDiscountChip(product, t)}
        {modalData?.length > 0 &&
          !isAvailable(
            modalData[0]?.available_time_starts,
            modalData[0]?.available_time_ends
          ) && (
            <CustomOverlayBox height="40%" top="126px">
              <NotAvailableCard
                endTime={modalData.length > 0 && modalData[0].available_time_ends}
                startTime={modalData.length > 0 && modalData[0].available_time_starts}
              />
            </CustomOverlayBox>
          )}

        <CustomImageContainer
          src={modalData[0]?.image_full_url}
          borderRadius=".3rem"
          width="100%"
          height="200px"
          alt={modalData[0]?.name || "product image"}
          objectfit="cover"
        />

        {/* Overlay: hidden on xs via CSS display, shown on sm+ */}
        <CustomStackForFoodModal
          width="100%"
          spacing={2}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <Stack spacing={1.4} alignItems="start">
            {!product?.available_date_ends && (
              <CustomRatingBox rating={product?.avg_rating} />
            )}
            {router.pathname !== `/store/[id]` ? (
              <Typography
                sx={{ cursor: "pointer" }}
                fontSize="14px"
                fontWeight="400"
                color={theme.palette.whiteContainer.main}
                onClick={handleRouteToStore}
              >
                {product?.store_name}
              </Typography>
            ) : null}
          </Stack>
          {!product?.available_date_ends && (
            <>
              {!isWishlisted ? (
                <CustomFavICon>
                  <IconButton onClick={addToWishlistHandler}>
                    <FavoriteBorderIcon color="primary" />
                  </IconButton>
                </CustomFavICon>
              ) : (
                <CustomFavICon>
                  <IconButton onClick={(e) => removeFromWishlistHandler(e)}>
                    <FavoriteIcon color="primary" />
                  </IconButton>
                </CustomFavICon>
              )}
            </>
          )}
        </CustomStackForFoodModal>

        {/* Mobile only: small wishlist icon at top-right of image */}
        {!product?.available_date_ends && (
          <IconButton
            onClick={isWishlisted ? removeFromWishlistHandler : addToWishlistHandler}
            sx={{
              display: { xs: "flex", sm: "none" },
              position: "absolute",
              top: 8,
              right: 40,
              zIndex: 2,
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(4px)",
              width: 30,
              height: 30,
              padding: 0,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.95)" },
            }}
          >
            {isWishlisted ? (
              <FavoriteIcon size={15} color={theme.palette.primary.main} />
            ) : (
              <FavoriteBorderIcon size={15} color={theme.palette.primary.main} />
            )}
          </IconButton>
        )}
      </Grid>

      {/* ── DETAILS SECTION ── */}
      <Grid item md={12} sm={12} xs={12}>
        <Stack
          paddingX="1rem"
          width="100%"
          spacing={0.5}
          paddingTop="0.75rem"
          paddingBottom="0.25rem"
        >
          {/* Mobile only: store name + rating shown below image */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={0.5}
            mb={0.25}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            {router.pathname !== `/store/[id]` && product?.store_name && (
              <Typography
                fontSize="12px"
                fontWeight="500"
                color="primary.main"
                sx={{
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "75%",
                }}
                onClick={handleRouteToStore}
              >
                {product?.store_name}
              </Typography>
            )}
            {!product?.available_date_ends && (
              <CustomRatingBox rating={product?.avg_rating} />
            )}
          </Stack>

          <CustomStackFullWidth>
            <CustomStackFullWidth
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              flexWrap="wrap"
              spacing={0.5}
            >
              <Typography
                fontSize={isMobile ? "15px" : "16px"}
                fontWeight="600"
              >
                {modalData.length > 0 && modalData[0].name}
              </Typography>
              {modalData.length > 0 &&
                modalData[0]?.module?.module_type === "food" &&
                configData?.toggle_veg_non_veg && (
                  <FoodVegNonVegFlag
                    veg={modalData[0]?.veg === 0 ? "false" : "true"}
                  />
                )}
              {modalData[0]?.halal_tag_status && modalData[0]?.is_halal ? (
                <FoodHalalHaram position="relative" />
              ) : null}
            </CustomStackFullWidth>
          </CustomStackFullWidth>

          {modalData[0]?.generic_name?.[0] && (
            <Typography
              fontSize={{ xs: "12px", sm: "12px" }}
              fontWeight="400"
              color="customColor.textGray"
              component="h2"
            >
              {modalData[0]?.generic_name[0]}.
            </Typography>
          )}
          <FoodSubTitleTypography
            color={theme.palette.neutral[400]}
            sx={{ textAlign: "left", fontSize: "12px" }}
          >
            {modalData.length > 0 && modalData[0].description}
          </FoodSubTitleTypography>

          <ManualExpectedDeliveryInfo item={modalData[0]} />

          {modalData[0]?.nutritions_name?.length > 0 && (
            <>
              <Typography fontSize="14px" fontWeight="500" mt="5px">
                {t("Nutrition Details")}
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {modalData[0]?.nutritions_name?.map((item, index) => (
                  <Typography fontSize="12px" key={index}>
                    {item}
                    {index !== modalData[0]?.nutritions_name.length - 1 ? "," : "."}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
          {modalData[0]?.allergies_name?.length > 0 && (
            <>
              <Typography fontSize="14px" fontWeight="500" mt="5px">
                {t("Allergic Ingredients")}
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {modalData[0]?.allergies_name?.map((item, index) => (
                  <Typography fontSize="12px" key={index}>
                    {item}
                    {index !== modalData[0]?.allergies_name.length - 1 ? "," : "."}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

FoodDetailsManager.propTypes = {};

export default FoodDetailsManager;
