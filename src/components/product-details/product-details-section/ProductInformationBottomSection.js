import React, { useEffect } from "react";
import { Stack, styled } from "@mui/system";
import { PrimaryButton } from "../../Map/map.style";
import {
  alpha,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { HeartOff as FavoriteBorderOutlinedIcon } from "lucide-react";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
import { Heart as FavoriteIcon } from "lucide-react";
import {
  setBuyNowItemList,
  setCampaignItemList,
} from "../../../redux/slices/cart";
import toast from "react-hot-toast";
import { useWishListDelete } from "../../../api-manage/hooks/react-query/wish-list/useWishListDelete";
import { removeWishListItem } from "../../../redux/slices/wishList";
import NotAvailableCard from "./NotAvailableCard";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import Loading from "../../custom-loading/Loading";
import { isVariationAvailable } from "components/product-details/product-details-section/helperFunction";
import { getToken, hasValidAuthToken } from "helper-functions/getToken";
import { not_logged_in_message } from "utils/toasterMessages";
import { OPEN_AUTH_MODAL_EVENT } from "components/header/second-navbar/SecondNavbar";

export const BottomStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    boxShadow: "0px -4px 4px 0px rgba(0, 0, 0, 0.05)",
    borderRadius: "0px 0px 2px 2px",
    padding: "14px",
  },
}));

const btnBaseSx = (marketplaceLayout) =>
  marketplaceLayout
    ? {
        borderRadius: "2px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: { xs: "12px", md: "14px" },
        minHeight: 40,
        boxShadow: "none",
      }
    : {};

const ProductInformationBottomSection = ({
  addToCard,
  productDetailsData,
  selectedOptions,
  handleUpdateToCart,
  dispatchRedux,
  addToFavorite,
  wishListCount,
  setWishListCount,
  cartItemQuantity,
  handleModalClose,
  isLoading,
  t,
  addToCartMutate,
  updateIsLoading,
  marketplaceLayout,
}) => {
  const theme = useTheme();
  const isFoodModuleItem =
    productDetailsData?.module_type === "food" ||
    productDetailsData?.module?.module_type === "food" ||
    getCurrentModuleType() === "food";
  const { cartList } = useSelector((state) => state.cart);
  const { wishLists } = useSelector((state) => state.wishList);
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const variationErrorToast = () =>
    toast.error(
      t(
        "This variation is out of stock. Choose another variation to proceed further."
      )
    );

  const isInCart = (id) => {
    if (cartList?.length > 0) {
      const isInCart = cartList?.find(
        (item) =>
          item?.id === id &&
          JSON.stringify(item?.selectedOption) ===
            JSON.stringify(productDetailsData?.selectedOption)
      );
      if (isInCart) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const router = useRouter();

  const requireLoginForCheckout = () => {
    if (hasValidAuthToken(getToken())) return true;
    toast.error(t(not_logged_in_message));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(OPEN_AUTH_MODAL_EVENT));
    }
    return false;
  };

  const handleRedirect = () => {
    if (!requireLoginForCheckout()) return;

    if (productDetailsData?.isCampaignItem) {
      dispatchRedux(setCampaignItemList(productDetailsData));
      router.push("/checkout?page=campaign", undefined, { shallow: true });
    } else {
      dispatchRedux(setBuyNowItemList(productDetailsData));

      // const isExist = isInCart(productDetailsData?.id);
      // if (isExist) {
      //   dispatchRedux(setUpdateItemToCart(productDetailsData));
      // } else {
      //   dispatchRedux(setCart(productDetailsData));
      // }
      router.push(
        {
          pathname: "/checkout",
          query: {
            page: "buy_now",
            // id: productDetailsData?.id,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleRedirectToCheckoutClick = () => {
    if (productDetailsData?.selectedOption?.length > 0) {
      if (productDetailsData?.selectedOption?.[0]?.stock === 0) {
        variationErrorToast();
      } else {
        handleRedirect();
        handleModalClose();
      }
    } else {
      handleRedirect();
    }
  };
  const isInWishList = (id) => {
    return !!wishLists?.item?.find((wishItem) => wishItem.id === id);
  };

  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListItem(productDetailsData?.id));
    setWishListCount(wishListCount - 1);
    toast.success(res.message, {
      id: "wishlist",
    });
  };
  const { mutate } = useWishListDelete();
  const deleteWishlistItem = (id) => {
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };
  useEffect(() => {}, [wishListCount]);

  const handleVariationAvailability = (checkFor, cartItem) => {
    if (productDetailsData?.selectedOption?.length > 0) {
      if (productDetailsData?.selectedOption?.[0]?.stock === 0) {
        variationErrorToast();
      } else {
        checkFor === "add" ? addToCard() : handleUpdateToCart(cartItem);
      }
    } else {
      checkFor === "add" ? addToCard() : handleUpdateToCart(cartItem);
    }
  };

  const handleWishlist = () => (
    <>
      {isInWishList(productDetailsData?.id) && (
        <Button
          variant="outlined"
          onClick={() => deleteWishlistItem(productDetailsData?.id)}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FavoriteIcon />
            <Typography>{wishListCount}</Typography>
          </Stack>
        </Button>
      )}
      {!isInWishList(productDetailsData?.id) && (
        <Button variant="outlined" onClick={addToFavorite}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FavoriteBorderOutlinedIcon />
            <Typography>{wishListCount}</Typography>
          </Stack>
        </Button>
      )}
    </>
  );

  const actionsHandler = () => (
    <BottomStack direction="row" width="100%" gap={marketplaceLayout ? 1.5 : 2.5}>
      {(isFoodModuleItem ||
        productDetailsData?.stock > 0) &&
      isVariationAvailable(productDetailsData) ? (
        <PrimaryButton
          onClick={() => handleRedirectToCheckoutClick()}
          sx={{
            ...(marketplaceLayout
              ? {
                  ...btnBaseSx(true),
                  flex: 1,
                }
              : {
                  flex: 1,
                }),
          }}
        >
          {productDetailsData?.isCampaignItem ? t("Order Now") : t("Buy Now")}
        </PrimaryButton>
      ) : (
        <PrimaryButton
          onClick={() => handleRedirectToCheckoutClick()}
          sx={{
            ...btnBaseSx(marketplaceLayout),
            backgroundColor: marketplaceLayout
              ? theme.palette.primary.main
              : theme.palette.customColor.buyButton,
            color: marketplaceLayout ? theme.palette.primary.contrastText : "black",
            width: "50%",
          }}
          disabled={
            (!isFoodModuleItem && productDetailsData?.stock === 0) ||
            !isVariationAvailable(productDetailsData)
          }
        >
          <Typography color={alpha(theme.palette.error.main, 0.7)} variant="h7">
            {t("Out of Stock")}
          </Typography>
        </PrimaryButton>
      )}
      {!productDetailsData?.isCampaignItem && (
        <>
          {!isInCart(productDetailsData?.id) &&
            (isFoodModuleItem || productDetailsData?.stock > 0) &&
            isVariationAvailable(productDetailsData) && (
              <PrimaryButton
                onClick={() => handleVariationAvailability("add")}
                sx={{
                  ...btnBaseSx(marketplaceLayout),
                  flex: 1,
                  fontSize: { xs: "12px", md: "14px" },
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
                disabled={!isFoodModuleItem && productDetailsData?.stock === 0}
              >
                {isLoading ? <Loading /> : t("Add to Cart")}
              </PrimaryButton>
            )}
          {isInCart(productDetailsData?.id) && (
            <PrimaryButton
              onClick={() =>
                handleVariationAvailability(
                  "update",
                  isInCart(productDetailsData?.id)
                )
              }
              sx={{
                ...btnBaseSx(marketplaceLayout),
                width: 200,
                fontSize: { xs: "12px", md: "14px" },
              }}
            >
              {updateIsLoading ? <Loading /> : t("Update To Cart")}
            </PrimaryButton>
          )}
        </>
      )}
    </BottomStack>
  );
  const handleUnavailability = () => (
    <Stack spacing={2}>
      {getCurrentModuleType() !== "ecommerce" && (
        <NotAvailableCard
          endTime={productDetailsData?.available_time_ends}
          startTime={productDetailsData?.available_time_starts}
          moduleType={productDetailsData?.module?.module_type}
        />
      )}
      {productDetailsData?.schedule_order && <>{actionsHandler()}</>}
    </Stack>
  );

  // here unavailability checking is not necessary for modules except food , food modules also don't have details page

  return (
    <>
      {actionsHandler()}
      {productDetailsData?.is_prescription_required == 1 && (
        <Typography
          color={theme.palette.error.main}
          fontSize="13px"
          textTransform="capitalize"
        >
          {t("prescription is required")}
        </Typography>
      )}
    </>
  );
};

export default ProductInformationBottomSection;
