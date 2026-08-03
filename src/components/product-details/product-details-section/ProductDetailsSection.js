import { Grid, useMediaQuery, useTheme, Paper, alpha } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
//import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import StoreShare from "components/store-details/StoreShare";
import useProductShare from "hooks/useProductShare";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import CustomImageContainer from "../../CustomImageContainer";
import { OfferTypography } from "../../food-details/food-card/FoodCard.style";
import OrganicTag from "../../organic-tag";
import ProductImageView from "./ProductImageView";
import ProductInformation from "./ProductInformation";
import FoodInformation from "./FoodInformation";
import { getImageUrl } from "utils/CustomFunctions";
import DetailsAndReviews from "../details-and-reviews/DetailsAndReviews";

/** Landing-style sharp discount badge (modal / marketplace) */
const MarketplaceDiscountBadge = ({ children }) => (
  <Box
    sx={{
      position: "absolute",
      top: 8,
      left: 8,
      zIndex: 9,
      bgcolor: "primary.main",
      color: "primary.contrastText",
      fontSize: { xs: "11px", sm: "12px" },
      fontWeight: 700,
      px: 0.9,
      py: 0.35,
      borderRadius: "2px",
      lineHeight: 1.3,
    }}
  >
    {children}
  </Box>
);

export const handleDiscountChip = (product, t, { marketplace } = {}) => {
  if (!product?.discount || product?.discount === 0) return null;

  const label =
    product?.discount_type === "percent"
      ? `-${product.discount}%`
      : `${getAmountWithSign(product?.discount)} ${t("OFF")}`;

  if (marketplace) {
    return <MarketplaceDiscountBadge>{label}</MarketplaceDiscountBadge>;
  }

  if (product?.discount_type === "percent") {
    return (
      <OfferTypography>
        {product?.discount}% {t("OFF")}
      </OfferTypography>
    );
  }
  return (
    <OfferTypography>
      {getAmountWithSign(product?.discount)} {t("OFF")}
    </OfferTypography>
  );
};
const ProductDetailsSection = ({
  productDetailsData,
  configData,
  handleModalClose,
  productUpdate,
  modalmanage,
  addToWishlistHandler,
  removeFromWishlistHandler,
  isWishlisted,
}) => {
  const { t } = useTranslation();
  const productImage = productDetailsData?.image_full_url;
  const productThumbImage = productDetailsData?.images_full_url;
  const imageBaseUrl = productDetailsData?.isCampaignItem
    ? "campaign_image_url"
    : "item_image_url";
  const imageSrcUrl = productImage;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    openShareModal,
    setOpenShareModal,
    shareUrl: productShareUrl,
    handleCopy,
    handleShareClick,
  } = useProductShare(
    productDetailsData?.id,
    productDetailsData?.name,
    productDetailsData?.module_id || productDetailsData?.module?.id
  );
  const handleModal = () => {
    return (
      <Paper elevation={0} sx={{
        p: { xs: 0, md: 0 },
        borderRadius: "0",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      }}>
        <Grid container spacing={{ xs: 2, md: 6 }}>
          <Grid
          item
          xs={12}
          sm={5}
          md={5}
          textAlign="center"
          sx={
            modalmanage === "true"
              ? {
                  position: { xs: "static", sm: "sticky" },
                  top: { sm: 8, md: 12 },
                  alignSelf: "flex-start",
                  zIndex: 2,
                }
              : undefined
          }
        >
          <Box sx={{ position: "relative" }}>
            {handleDiscountChip(productDetailsData, t, {
              marketplace: modalmanage === "true",
            })}
            <OrganicTag
              status={productDetailsData?.organic}
              top={isSmall ? 40 : 50}
              left={0}
            />
          </Box>
          {productDetailsData?.module_type !== "food" && productUpdate ? (
            <CustomImageContainer
              width={isSmall ? "200px" : "100%"}
              height={isSmall ? "200px" : "250px"}
              src={imageSrcUrl}
              objectfit="contained"
              aspectRatio="1/1"
            />
          ) : (
            <ProductImageView
              productImage={imageSrcUrl}
              productThumbImage={productThumbImage}
              imageBaseUrl={imageBaseUrl}
              configData={configData}
              addToWishlistHandler={addToWishlistHandler}
              removeFromWishlistHandler={removeFromWishlistHandler}
              isWishlisted={isWishlisted}
              productDetailsData={productDetailsData}
              onShareClick={handleShareClick}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={7}
          md={7}
          marginTop={productThumbImage?.length > 0 ? "0px" : "0px"}
          sx={
            modalmanage === "true"
              ? {
                  "& .simplebar-content": { paddingRight: "4px" },
                }
              : undefined
          }
        >
          {productDetailsData?.module_type === "food" || productDetailsData?.module?.module_type === "food" ? (
            <FoodInformation
              productDetailsData={productDetailsData}
              configData={configData}
              productUpdate={productUpdate}
              handleModalClose={handleModalClose}
              modalmanage={modalmanage}
              isSmall={isSmall}
            />
          ) : (
            <ProductInformation
              productDetailsData={productDetailsData}
              configData={configData}
              productUpdate={productUpdate}
              handleModalClose={handleModalClose}
              modalmanage={modalmanage}
              isSmall={isSmall}
            />
          )}
          {modalmanage === "true" && (
            <Box sx={{ mt: 2 }}>
              <DetailsAndReviews
                description={productDetailsData?.description}
                configData={configData}
                productId={productDetailsData?.id}
                storename={productDetailsData?.store_name}
                tabsData={["Product Details", "Reviews"]}
                showBackground={false}
              />
            </Box>
          )}
        </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <CustomStackFullWidth>
      {handleModal()}
      {openShareModal && (
        <StoreShare
          shareUrl={productShareUrl}
          handleCopy={handleCopy}
          setOpenShareModal={setOpenShareModal}
          openShareModal={openShareModal}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default ProductDetailsSection;
