
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import {
  alpha,
  Button,
  Card,
  CardMedia,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkLocationBeforeCart } from "helper-functions/headerSessionSync";
import { findMatchingCartItem } from "helper-functions/cartItemMatch";
import {
  setCart,
  setCartList,
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "redux/slices/cart";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import {
  CustomBoxFullWidth,
  CustomSpan,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import CustomImageContainer from "../CustomImageContainer";
import FoodDetailModal from "../food-details/foodDetail-modal/FoodDetailModal";
import {
  ACTION,
  initialState,
  reducer,
} from "../product-details/product-details-section/states";
import InStockTag from "../product-details/InStockTag";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import {
  mapApiCartRowsToReduxItems,
  getCartsFromResponse,
} from "helper-functions/normalizeCartListResponse";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getLanguage } from "helper-functions/getLanguage";
import { getModuleId } from "helper-functions/getModuleId";
import { getGuestId } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  not_logged_in_message,
  out_of_limits,
  out_of_stock,
} from "utils/toasterMessages";
import { isAvailable } from "utils/CustomFunctions";
import useAddCartItem from "../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import useDeleteCartItem from "../../api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import { addWishList, removeWishListItem } from "../../redux/slices/wishList";
import AmountWithDiscountedAmount from "../AmountWithDiscountedAmount";
import CustomDialogConfirm from "../custom-dialog/confirm/CustomDialogConfirm";
import CustomMultipleRatings from "../CustomMultipleRatings";
import GetLocationAlert from "../GetLocationAlert";
import { HeartWrapper } from "../home/stores-with-filter/cards-grid/StoresInfoCard";
import CustomLinearProgressbar from "../linear-progressbar";
import CustomModal from "../modal";
import {
  getItemDataForAddToCart,
  getPriceAfterQuantityChange,
} from "../product-details/product-details-section/helperFunction";
import { getCartItemUnitPrice } from "utils/CustomFunctions";
import Body2 from "../typographies/Body2";
import H3 from "../typographies/H3";
import AddWithIncrementDecrement from "./AddWithIncrementDecrement";
import { CustomOverLay } from "./Card.style";
import ModuleModal from "./ModuleModal";
import ProductsUnavailable from "./ProductsUnavailable";
import QuickView, { PrimaryToolTip } from "./QuickView";
import SpecialCard, { FoodHalalHaram, FoodVegNonVegFlag } from "./SpecialCard";
import useProductShare from "hooks/useProductShare";
import StoreShare from "components/store-details/StoreShare";
import ProductShareAction from "components/share/ProductShareAction";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

export const CardWrapper = styled(Card)(
  ({
    theme,
    cardheight,
    horizontalcard,
    wishlistcard,
    nomargin,
    cardType,
    cardFor,
    cardWidth,
    pharmaCommon,
    recentlyViewedMobile,
    landingmarketplacecard,
  }) => ({
    cursor: "pointer",
    backgroundColor:
      getCurrentModuleType() === ModuleTypes.ECOMMERCE ||
      landingmarketplacecard === "true"
        ? theme.palette.background.paper
        : recentlyViewedMobile === "true"
          ? theme.palette.background.paper
          : theme.palette.background.custom6,

    padding:
      getCurrentModuleType() === ModuleTypes.ECOMMERCE ||
      landingmarketplacecard === "true"
        ? 0
        : recentlyViewedMobile === "true"
          ? 0
          : horizontalcard !== "true" && "10px",
    maxWidth:
      cardFor === "list-view"
        ? "100%"
        : horizontalcard === "true"
          ? "440px"
          : "320px",
    width:
      cardType === "vertical-type" || cardType === "list-view"
        ? "100%"
        : horizontalcard === "true" && "440px",
    margin:
      wishlistcard === "true"
        ? "0rem"
        : nomargin === "true"
          ? "0rem"
          : cardType === "vertical-type"
            ? "0rem"
            : ".7rem",
    borderRadius: "4px",
    height:
      landingmarketplacecard === "true" || recentlyViewedMobile === "true"
        ? "auto"
        : cardheight
          ? cardheight
          : "220px",
    overflow: "hidden",
    transition: "all 0.25s ease-in-out",
    boxShadow: "none",
    border: `2px solid ${
      getCurrentModuleType() === ModuleTypes.ECOMMERCE ||
      landingmarketplacecard === "true"
        ? theme.palette.divider
        : alpha(theme.palette.divider, 0.18)
    }`,
    marginBottom: pharmaCommon && "20px !important",

    ...(landingmarketplacecard === "true" && {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }),

    "&:hover": {
      // Daraz/AliExpress style: card stays in place, only shadow lifts
      transform: "none",
      boxShadow: theme.palette.mode !== "dark"
            ? `0px 6px 20px 0px ${alpha(theme.palette.neutral[1000], 0.12)}`
            : "0px 6px 20px 0px rgba(88, 110, 125, 0.2)",
      borderColor:
        getCurrentModuleType() === ModuleTypes.ECOMMERCE ||
        landingmarketplacecard === "true"
          ? theme.palette.divider
          : theme.palette.primary.main,
      img: {
        transform: recentlyViewedMobile === "true" ? "none" : "scale(1.03)",
      },
    },

    "&:hover .MuiTypography-subtitle1, &:hover .name": {},
    [theme.breakpoints.down("sm")]: {
      height:
        landingmarketplacecard === "true" || recentlyViewedMobile === "true"
          ? "auto"
          : horizontalcard !== "true"
            ? "320px"
            : cardheight
              ? cardheight
              : "150px",
      width:
        horizontalcard === "true"
          ? cardFor === "list-view"
            ? "100%"
            : cardWidth
              ? cardWidth
              : "95%"
          : "100%",
      margin:
        wishlistcard === "true"
          ? "0rem"
          : nomargin === "true"
            ? "0rem"
            : ".4rem",
    },
    [theme.breakpoints.up("sm")]: {
      height:
        landingmarketplacecard === "true" || recentlyViewedMobile === "true"
          ? "auto"
          : cardheight
            ? cardheight
            : "330px",
    },
    [theme.breakpoints.up("md")]: {
      height:
        landingmarketplacecard === "true" || recentlyViewedMobile === "true"
          ? "auto"
          : cardheight
            ? cardheight
            : "350px",
    },
  })
);
const CustomCardMedia = styled(CardMedia)(
  ({ theme, horizontalcard, loveItem, mobilerecentcard, landingmarketplacecard }) => ({
    position: "relative",
    padding: horizontalcard === "true" ? ".5rem" : "0rem",
    margin: 0,
    height:
      mobilerecentcard === "true" || landingmarketplacecard === "true"
        ? "auto"
        : horizontalcard === "true"
          ? "100%"
          : "220px",
    ...(mobilerecentcard === "true" && {
      "& > .mobile-recent-image-shell": {
        width: "100%",
        display: "block",
      },
      "& .mobile-recent-image-shell img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      },
      "& .mobile-recent-image-actions": {
        position: "absolute",
        right: "8px",
        bottom: "8px",
        left: "auto",
        top: "auto",
        width: "auto",
        height: "auto",
        zIndex: 6,
      },
    }),
    width: horizontalcard === "true" ? "215px" : "100%",
    display: "flex",
    alignItems: mobilerecentcard === "true" ? "stretch" : "center",
    justifyContent: mobilerecentcard === "true" ? "flex-start" : "center",
    overflow: "hidden",
    borderRadius: "0px",
    ...(landingmarketplacecard === "true" && {
      alignItems: "stretch",
      justifyContent: "flex-start",
      flexShrink: 0,
      "& > .landing-marketplace-image-shell": {
        width: "100%",
        flexShrink: 0,
        display: "block",
      },
      "& .landing-marketplace-image-shell::before": {
        content: '""',
        display: "block",
        paddingTop: "100%",
      },
      "& .landing-marketplace-image-shell img": {
        objectFit: "contain",
      },
    }),
    ...(mobilerecentcard !== "true" &&
      landingmarketplacecard !== "true" && {
      ".MuiBox-root": {
        overflow: "hidden",
        borderRadius: "4px",
      },
    }),
    backgroundColor:
      horizontalcard === "true" ? theme.palette.neutral[100] : "none",
    [theme.breakpoints.down("sm")]:
      mobilerecentcard === "true" || landingmarketplacecard === "true"
        ? {}
        : {
            width: horizontalcard === "true" ? "185px" : "100%",
            height: horizontalcard === "true" ? "100%" : "175px",
            minHeight: horizontalcard === "true" ? "140px" : "auto",
          },
  })
);
export const CustomCardButton = styled(CustomButtonPrimary)(
  ({ theme, disabled }) => ({
    background: disabled
      ? alpha(theme.palette.secondary.light, 0.3)
      : theme.palette.secondary.light,
  })
);

const TooltipTypography = ({ children, text, placement, arrow }) => {
  const [isEllipsis, setIsEllipsis] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const isOverflowing = element.scrollWidth < element.clientWidth;
      setIsEllipsis(isOverflowing);
    }
  }, [text]);
  console.log({ isEllipsis });
  return (
    <PrimaryToolTip
      text={isEllipsis ? text : ""}
      placement={placement}
      arrow={arrow}
    >
      {React.cloneElement(children, { ref: textRef })}
    </PrimaryToolTip>
  );
};

const ProductCard = (props) => {
  const {
    loveItem,
    item,
    cardheight,
    horizontalcard,
    changed_bg,
    wishlistcard,
    deleteWishlistItem,
    cardFor,
    noMargin,
    cardType,
    specialCard,
    cardWidth,
    sold,
    stock,
    pharmaCommon,
    noRecommended,
    showStoreName,
    recentlyViewedDesktop,
    recentlyViewedMobile,
    disableHoverOverlay,
    useImageActionsRow,
    actionsOutsideImage,
    /** When set, detail modal is rendered by parent (e.g. Recently Viewed) so list refetch does not close it. */
    onRequestDetailModal,
    landingMarketplaceCard,
  } = props;
  const { ref: textRef, isEllipsed } = useTextEllipsis(item?.name);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openModal, setOpenModal] = React.useState(false);
  const [openLocationAlert, setOpenLocationAlert] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopRecentCard =
    Boolean(showStoreName && recentlyViewedDesktop) && isDesktop;
  const isMobileRecentCard = Boolean(recentlyViewedMobile);
  const isRecentlyViewedCompactActions =
    isMobileRecentCard || isDesktopRecentCard;
  const recentActionIconSize = isRecentlyViewedCompactActions ? "24px" : "30px";
  const recentActionButtonSize = isRecentlyViewedCompactActions ? "24px" : "32px";
  const recentActionBorderRadius = isRecentlyViewedCompactActions ? "7px" : "10px";
  const recentWishlistIconSize = isRecentlyViewedCompactActions ? "14px" : "17px";
  const recentShareIconSize = isRecentlyViewedCompactActions ? "14px" : "17px";
  const useShopCornerActions =
    cardFor === "vertical" &&
    !isMobileRecentCard &&
    !isDesktopRecentCard &&
    !disableHoverOverlay &&
    !landingMarketplaceCard;
  const shopCornerActionsVisible =
    useShopCornerActions && (state.isTransformed || isSmall);
  const showImageActionsRow = Boolean(isDesktopRecentCard || useImageActionsRow);
  const showImageCornerActionsRow = Boolean(showImageActionsRow && !actionsOutsideImage);
  const showCardCornerActionsRow = Boolean(showImageActionsRow && actionsOutsideImage);
  const reduxDispatch = useDispatch();
  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const cartList = getCartListModuleWise(aliasCartList);
  const classes = textWithEllipsis();
  const { t } = useTranslation();
  const { wishLists } = useSelector((state) => state.wishList);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate } = useWishListDelete();
  const [isProductExist, setIsProductExist] = useState(false);
  const [count, setCount] = useState(0);
  const { mutate: addToMutate, isLoading } = useAddCartItem();
  const { mutate: updateMutate, isLoading: updateLoading } =
    useCartItemUpdate();
  const { mutate: cartItemRemoveMutate } = useDeleteCartItem();
  const {
    openShareModal,
    setOpenShareModal,
    shareUrl,
    handleCopy,
    handleShareClick,
  } = useProductShare(
    item?.id,
    item?.name,
    item?.module_id || item?.module?.id
  );
  useEffect(() => {
    const isInCart = getItemFromCartlist();
    if (isInCart) {
      setIsProductExist(true);
      setCount(Number(isInCart?.quantity) || 1);
    } else {
      setIsProductExist(false);
      setCount(0);
    }
  }, [aliasCartList, item?.id]);
  const getItemFromCartlist = () => {
    const candidate = {
      ...item,
      selectedOption: state?.modalData?.[0]?.selectedOption || item?.selectedOption || [],
      food_variations: item?.food_variations,
      selectedAddons: item?.selectedAddons,
    };
    const moduleCart = getCartListModuleWise(aliasCartList);
    return (
      findMatchingCartItem(moduleCart, candidate) ||
      findMatchingCartItem(aliasCartList, candidate)
    );
  };
  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);
  const wishlistItemExistHandler = () => {
    if (wishLists?.item?.find((wishItem) => wishItem.id === item?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };

  const detailHandlersRef = useRef({});
  const openViaParentRef = useRef(() => false);

  const handleBadge = () => null;
  const handleClick = () => {
    router.push({
      pathname: "/product/[id]",
      query: {
        id: `${item?.slug ? item?.slug : item?.id}`,
        module_id: `${getModuleId()}`,
      },
    }).then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top after navigation
    });
  };

  useEffect(() => {
    if (item) {
      dispatch({
        type: ACTION.setModalData,
        payload: {
          ...item,
          quantity: 1,
          price: item?.price,
          totalPrice: item?.price,
        },
      });
    }
  }, [item]);
  const isInCart = cartList?.find((cart) => String(cart?.id) === String(item?.id));
  const resolvedModuleType = item?.module_type || item?.module?.module_type;
  const resolvedStock = Number(item?.stock ?? state?.modalData?.[0]?.stock);
  const hasFiniteStock = Number.isFinite(resolvedStock);
  const isFoodItem = resolvedModuleType === "food" || getCurrentModuleType() === "food";
  const isOutOfStock = !isFoodItem && hasFiniteStock && resolvedStock <= 0;
  const handleSuccess = (res) => {
    if (res) {
      let product = {};
      res?.forEach((item) => {
        product = {
          ...item?.item,
          cartItemId: item?.id,
          quantity: item?.quantity,
          totalPrice: item?.price,
          selectedOption: [],
        };
      });
      // Do NOT pass isUpdate:true — let cart slice auto-increment quantity
      reduxDispatch(setCart({ ...product }));
      toast.success(t("Item added to cart"));
    }
  };

  const addToCartHandler = () => {
    if (!checkLocationBeforeCart()) {
      return;
    }
    if (isOutOfStock) {
      toast.error(t(out_of_stock));
      return;
    }

    const modalItem = state.modalData[0] || item;
    const addQty = Number(modalItem?.quantity || 1);
    const resolvedPrice = Number(modalItem?.price ?? modalItem?.unit_price ?? item?.price ?? item?.unit_price ?? 0) || 0;
    const existingCartItem = getItemFromCartlist();
    const currentQty = Number(existingCartItem?.quantity || 0);
    const remainingStock = hasFiniteStock ? resolvedStock - currentQty : null;

    if (remainingStock !== null && remainingStock <= 0) {
      toast.error(t(out_of_stock));
      return;
    }

    dispatch({
      type: ACTION.setModalData,
      payload: {
        ...modalItem,
        quantity: 1,
        totalPrice: resolvedPrice,
      },
    });
    setCount(1);
    setIsProductExist(true);

    if (!existingCartItem) {
      const itemModuleId = item?.module_id || item?.module?.id || modalItem?.module_id || modalItem?.module?.id;
      const itemModuleType = item?.module_type || item?.module?.module_type || modalItem?.module_type || modalItem?.module?.module_type;

      const tempProduct = {
        ...modalItem,
        id: modalItem?.id || item?.id,
        cartItemId: modalItem?.cartItemId || `temp_${modalItem?.id || item?.id}_${Date.now()}`,
        quantity: addQty,
        price: resolvedPrice,
        totalPrice: resolvedPrice * addQty,
        selectedOption: [],
        module_id: itemModuleId,
        module_type: itemModuleType,
        module: item?.module || modalItem?.module,
      };

      // Optimistic instant 0ms Add to Cart
      reduxDispatch(setCart(tempProduct));
      setCount(1);
      setIsProductExist(true);

      const itemObject = {
        guest_id: getGuestId(),
        model: modalItem?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids: [],
        add_on_qtys: [],
        item_id: modalItem?.id || item?.id,
        price: resolvedPrice,
        quantity: addQty,
        variation: [],
        moduleIdOverride: itemModuleId,
      };

      addToMutate(itemObject, {
        onSuccess: (res) => {
          toast.success(t("Item added to cart"), { id: "cart-toast" });
          if (res) {
            const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
            const currentModuleId = itemModuleId || getModuleId();
            const currentModuleType = itemModuleType || getCurrentModuleType();
            const otherModulesItems = aliasCartList.filter((c) => {
              const cModuleId = c?.module_id || c?.module?.id;
              const cModuleType = c?.module_type || c?.module?.module_type;
              if (currentModuleId && cModuleId) return String(cModuleId) !== String(currentModuleId);
              if (currentModuleType && cModuleType) return cModuleType !== currentModuleType;
              return true;
            });
            const normalizedApiItems = mappedFromApi.map((apiItem) => ({
              ...apiItem,
              module_id: apiItem?.module_id || currentModuleId,
              module_type: apiItem?.module_type || currentModuleType,
            }));
            reduxDispatch(setCartList([...otherModulesItems, ...normalizedApiItems]));
          }
        },
        onError: (err) => {
          const msg = (err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || "").toLowerCase();
          const isAlreadyInCart =
            msg.includes("already") ||
            msg.includes("exist") ||
            err?.response?.status === 422 ||
            err?.response?.status === 403;
          if (!isAlreadyInCart) {
            reduxDispatch(setRemoveItemFromCart(tempProduct));
            setIsProductExist(false);
            setCount(0);
            onErrorResponse(err);
          }
        },
      });
    } else {
      const itemModuleId = item?.module_id || item?.module?.id || existingCartItem?.module_id || existingCartItem?.module?.id;
      const itemModuleType = item?.module_type || item?.module?.module_type || existingCartItem?.module_type || existingCartItem?.module?.module_type;

      const finalAddQty = remainingStock !== null ? Math.min(addQty, remainingStock) : addQty;
      if (finalAddQty <= 0) {
        toast.error(t(out_of_stock));
        return;
      }
      const updateQuantity = currentQty + finalAddQty;
      const itemObject = {
        ...getItemDataForAddToCart(
          existingCartItem,
          updateQuantity,
          getCartItemUnitPrice(existingCartItem) || resolvedPrice,
          getGuestId()
        ),
        moduleIdOverride: itemModuleId,
      };

      const updatedProduct = {
        ...existingCartItem,
        quantity: updateQuantity,
        totalPrice: resolvedPrice * updateQuantity,
        module_id: itemModuleId,
        module_type: itemModuleType,
        isUpdate: true,
      };

      reduxDispatch(setCart(updatedProduct));
      setCount(1);
      setIsProductExist(true);

      updateMutate(itemObject, {
        onSuccess: (res) => {
          toast.success(t("Item added to cart"), { id: "cart-toast" });
          if (res) {
            const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
            const currentModuleId = itemModuleId || getModuleId();
            const currentModuleType = itemModuleType || getCurrentModuleType();
            const otherModulesItems = aliasCartList.filter((c) => {
              const cModuleId = c?.module_id || c?.module?.id;
              const cModuleType = c?.module_type || c?.module?.module_type;
              if (currentModuleId && cModuleId) return String(cModuleId) !== String(currentModuleId);
              if (currentModuleType && cModuleType) return cModuleType !== currentModuleType;
              return true;
            });
            const normalizedApiItems = mappedFromApi.map((apiItem) => ({
              ...apiItem,
              module_id: apiItem?.module_id || currentModuleId,
              module_type: apiItem?.module_type || currentModuleType,
            }));
            reduxDispatch(setCartList([...otherModulesItems, ...normalizedApiItems]));
          }
        },
        onError: (err) => {
          const status = err?.response?.status;
          const msg = (err?.response?.data?.message || err?.response?.data?.errors?.[0]?.message || "").toLowerCase();
          const isNotFound = status === 404 || msg.includes("not found") || msg.includes("notfound");
          const isAlreadyInCart = msg.includes("already") || msg.includes("exist");
          if (!isNotFound && !isAlreadyInCart) {
            onErrorResponse(err);
          }
        },
      });
    }
  };

  const addToCart = (e) => {
    if (isOutOfStock) {
      e?.stopPropagation?.();
      toast.error(t(out_of_stock));
      return;
    }

    if (item?.module_type === "ecommerce") {
      if (item?.variations?.length > 0 || item?.has_variant) {
        e?.stopPropagation?.();
        router.push({
          pathname: "/product/[id]",
          query: {
            id: `${item?.slug ? item?.slug : item?.id}`,
            module_id: `${getModuleId()}`,
          },
        }).then(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else {
        e.stopPropagation();
        addToCartHandler();

      }
    } else {
      if (item?.module_type === "food") {
        const foodAvailable = isAvailable(
          item?.available_time_starts,
          item?.available_time_ends
        );
        if (!foodAvailable && !item?.schedule_order) {
          e?.stopPropagation?.();
          toast.error(t("This food is not available right now."));
          return;
        }
        if (item?.food_variations?.length > 0 || item?.has_variant) {
          router.push({
            pathname: "/product/[id]",
            query: {
              id: `${item?.slug ? item?.slug : item?.id}`,
              module_id: `${getModuleId()}`,
            },
          }).then(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        } else {
          e.stopPropagation();
          addToCartHandler();
        }
      } else if (item?.variations?.length > 0 || item?.has_variant) {
        router.push({
          pathname: "/product/[id]",
          query: {
            id: `${item?.slug ? item?.slug : item?.id}`,
            module_id: `${getModuleId()}`,
          },
        }).then(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else {
        e.stopPropagation();
        addToCartHandler();
      }
    }
  };

  const quickViewHandleClick = () => { };
  const handleIncrement = () => {
    const isExisted = getItemFromCartlist();
    if (!isExisted) return;

    const updateQuantity = (isInCart?.quantity || isExisted?.quantity || 1) + 1;
    const unitPrice =
      getCartItemUnitPrice(isInCart) ||
      Number(getPriceAfterQuantityChange(isInCart, 1)) ||
      Number(isInCart?.price) ||
      0;
    const lineTotal = unitPrice * updateQuantity;

    if (item?.maximum_cart_quantity && item.maximum_cart_quantity < updateQuantity) {
      toast.error(t(out_of_limits));
      return;
    }
    if (getCurrentModuleType() !== "food" && hasFiniteStock && updateQuantity > resolvedStock) {
      toast.error(t(out_of_stock));
      return;
    }

    setCount(updateQuantity);
    reduxDispatch(
      setIncrementToCartItem({
        ...isInCart,
        quantity: updateQuantity,
        price: unitPrice,
        itemBasePrice: unitPrice,
        totalPrice: lineTotal || unitPrice * updateQuantity,
        isUpdate: true,
      })
    );

    const itemObject = getItemDataForAddToCart(
      isInCart,
      updateQuantity,
      unitPrice,
      getGuestId()
    );
    updateMutate(itemObject, {
      onError: onErrorResponse,
    });
  };
  const handleClose = () => {
    dispatch({ type: ACTION.setOpenModal, payload: false });
  };

  const handleDecrement = () => {
    const isExisted = getItemFromCartlist();
    if (!isExisted) return;
    const updateQuantity = (isInCart?.quantity || isExisted?.quantity || 1) - 1;

    if (isExisted?.quantity === 1 || updateQuantity < 1) {
      reduxDispatch(setRemoveItemFromCart(isInCart));
      setCount(0);
      setIsProductExist(false);
      cartItemRemoveMutate(
        {
          cart_id: isInCart?.cartItemId,
          guestId: getGuestId(),
        },
        {
          onError: onErrorResponse,
        }
      );
      return;
    }

    const unitPrice =
      getCartItemUnitPrice(isInCart) ||
      Number(getPriceAfterQuantityChange(isInCart, 1)) ||
      Number(isInCart?.price) ||
      0;
    const lineTotal = unitPrice * updateQuantity;
    setCount(updateQuantity);
    reduxDispatch(
      setDecrementToCartItem({
        ...isInCart,
        quantity: updateQuantity,
        price: unitPrice,
        itemBasePrice: unitPrice,
        totalPrice: lineTotal,
        isUpdate: true,
      })
    );

    const itemObject = getItemDataForAddToCart(
      isInCart,
      updateQuantity,
      unitPrice,
      getGuestId()
    );
    updateMutate(itemObject, {
      onError: onErrorResponse,
    });
  };
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const popularCardUi = () => {
    const getReadableValue = (value) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string" || typeof value === "number") {
        return String(value);
      }
      if (typeof value === "object") {
        return (
          value?.name ||
          value?.label ||
          value?.value ||
          value?.unit ||
          value?.unit_value ||
          value?.amount ||
          ""
        );
      }
      return "";
    };
    const unitValue = getReadableValue(
      item?.unit || item?.minimum_purchase_qty || item?.item_unit
    );
    const unitTypeText = getReadableValue(item?.unit_type);
    const unitDetails =
      unitValue && unitTypeText && unitValue !== unitTypeText
        ? `${unitValue} ${unitTypeText}`
        : unitValue || unitTypeText;
    const parsedRating = Number(item?.avg_rating ?? item?.avgRating ?? 0);
    const hasRating = Number.isFinite(parsedRating) && parsedRating > 0;

    const storeName = item?.store_name || item?.store?.name;
    const reviewCount = Number(item?.rating_count ?? item?.review_count ?? 0);
    const unitLabel =
      unitTypeText && unitTypeText !== unitValue
        ? `(${unitTypeText})`
        : unitValue
          ? `(${unitValue})`
          : "";

    if (isMobileRecentCard) {
      return (
        <CustomStackFullWidth
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            px: 1.25,
            pb: 1.25,
            pt: 0.75,
            width: "100%",
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", sm: "15px" },
              lineHeight: 1.3,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item?.name}
          </Typography>
          {hasRating && (
            <Stack direction="row" alignItems="center" spacing={0.35} sx={{ mt: 0.5 }}>
              <StarIcon sx={{ fontSize: "14px", color: "warning.main" }} />
              <Typography
                component="span"
                sx={{ fontSize: "12px", fontWeight: 600, lineHeight: 1 }}
              >
                {parsedRating.toFixed(1)}
              </Typography>
              {reviewCount > 0 && (
                <Typography
                  component="span"
                  sx={{ fontSize: "12px", color: "text.secondary", lineHeight: 1 }}
                >
                  ({reviewCount})
                </Typography>
              )}
            </Stack>
          )}
          {unitLabel && (
            <Typography
              component="span"
              sx={{
                mt: 0.25,
                fontSize: "11px",
                color: "text.secondary",
                lineHeight: 1.2,
              }}
            >
              {unitLabel}
            </Typography>
          )}
        <Stack spacing={0.15} sx={{ mt: 0.75, width: "100%" }}>
            <AmountWithDiscountedAmount item={item} compact />
          </Stack>
        </CustomStackFullWidth>
      );
    }

    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="flex-start"
        sx={{
          position: "relative",
          padding: "12px",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {showStoreName && !showImageActionsRow ? (
          <Stack
            spacing={0.5}
            alignItems="center"
            sx={{
              position: "absolute",
              top: "6px",
              right: "6px",
              zIndex: 2,
            }}
          >
            <HeartWrapper
              onClick={(e) =>
                isWishlisted
                  ? removeFromWishlistHandler(e)
                  : addToWishlistHandler(e)
              }
              top="0"
              right="0"
              sx={{
                width: "26px",
                height: "26px",
                backgroundColor: (theme) =>
                  alpha(theme.palette.background.paper, 0.85),
                backdropFilter: "blur(4px)",
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.background.paper, 1),
                },
              }}
            >
              {isWishlisted ? (
                <FavoriteIcon sx={{ fontSize: "14px", color: "primary.main" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: "14px", color: "text.secondary" }} />
              )}
            </HeartWrapper>
            <ProductShareAction
              onClick={handleShareClick}
              size="26px"
              iconSize="14px"
            />
          </Stack>
        ) : (
          !showStoreName &&
          isWishlisted && (
            <Box
              sx={{
                color: "primary.main",
                position: "absolute",
                top: 20,
                right: 10,
              }}
            >
              <FavoriteIcon sx={{ fontSize: "15px" }} />
            </Box>
          )
        )}
        {isEllipsed ? (
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Typography
              ref={textRef}
              variant={horizontalcard === "true" ? "subtitle2" : "h6"}
              marginBottom="4px"
              sx={{
                lineHeight: 1.25,
                textAlign: lanDirection === "rtl" && "end",
                color: (theme) => theme.palette.text.custom,
                fontSize: { xs: "13px", sm: "14px" },
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                height: "2.5em",
                width: "100%",
                mt: "2px",
              }}
              className="name"
              component="h3"
            >
              {item?.name}
            </Typography>
          </PrimaryToolTip>
        ) : (
          <Typography
            ref={textRef}
            variant={horizontalcard === "true" ? "subtitle2" : "h6"}
            marginBottom="4px"
            sx={{
              lineHeight: 1.25,
              textAlign: lanDirection === "rtl" && "end",
              color: (theme) => theme.palette.text.custom,
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              height: "2.5em",
              width: "100%",
              mt: "2px",
            }}
            className="name"
            component="h3"
          >
            {item?.name}
          </Typography>
        )}
        {showStoreName && (
          <Typography
            variant="caption"
            sx={{
              mt: 0.25,
              color: (theme) => alpha(theme.palette.primary.main, 0.9),
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              px: "6px",
              py: "2px",
              borderRadius: "6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
              maxWidth: "100%",
              fontSize: { xs: "9px", sm: "10px" },
              fontWeight: 600,
              lineHeight: 1.2,
            }}
            component="p"
          >
            {storeName || t("Unknown store")}
          </Typography>
        )}
        {hasRating && (
          <Box sx={{ mt: 0.5, mb: 0.2 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.3}
              sx={{ display: "inline-flex" }}
            >
              <StarIcon sx={{ fontSize: "12px", color: "warning.main" }} />
              <Typography component="span" sx={{ fontSize: "11px", fontWeight: 600, lineHeight: 1, color: "text.secondary" }}>
                {parsedRating.toFixed(1)}
              </Typography>
            </Stack>
          </Box>
        )}
        <Stack mt={showStoreName ? "8px" : "5px"} spacing={0.2}>
          <AmountWithDiscountedAmount item={item} />
        </Stack>
        <CustomStackFullWidth
          direction="row"
          alignItems={isDesktopRecentCard ? "center" : "flex-end"}
          justifyContent="space-between"
          spacing={showStoreName ? 0.5 : 2}
          mb="3px"
          mt={showStoreName ? "4px" : 0}
          paddingRight="3px"
        >
          <Stack spacing={showStoreName ? 0.5 : 0.4} sx={{ minWidth: 0 }}>
            <Typography
              color="text.secondary"
              variant={isSmall ? "body2" : "body1"}
              sx={{
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            >
              {showStoreName && (unitDetails || item?.unit_type)
                ? `Unit: ${unitDetails || item?.unit_type}`
                : unitDetails || item?.unit_type || "-"}
            </Typography>
            {/* Stock tag hidden for food module */}
            {/* {resolvedModuleType === "food" && (
              <InStockTag stock={undefined} compact />
            )} */}
          </Stack>
          {!showImageActionsRow && (
            <AddWithIncrementDecrement
              onHover={state.isTransformed}
              addToCartHandler={addToCart}
              isProductExist={isProductExist}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              count={count}
              isLoading={isLoading}
              updateLoading={updateLoading}
              stacked={showStoreName && !isDesktopRecentCard}
              desktopPillMode={isDesktopRecentCard}
              compactActions={isRecentlyViewedCompactActions}
            />
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };

  const listViewCardUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
        p="1rem"
      >
        {isWishlisted && (
          <Box
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 20,
              right: 10,
            }}
          >
            <FavoriteIcon sx={{ fontSize: "15px" }} />
          </Box>
        )}

        {isEllipsed ? (
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Box ref={textRef}>
              <H3 text={item?.name} component="h3" />
            </Box>
          </PrimaryToolTip>
        ) : (
          <Box ref={textRef}>
            <H3 text={item?.name} component="h3" />
          </Box>
        )}
        <CustomBoxFullWidth>
          {item?.module_type === "pharmacy" ? (
            <Typography
              className={classes.singleLineEllipsis}
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: "break-word" }}
              component="h4"
            >
              {item?.generic_name[0]}
            </Typography>
          ) : (
            <Body2 text={item?.store_name} component="h4" />
          )}
        </CustomBoxFullWidth>
        {item?.unit_type ? (
          <Typography
            sx={{
              color: (theme) => theme.palette.customColor.textGray,
            }}
          >
            {item?.unit_type}
          </Typography>
        ) : (
          <Typography
            sx={{
              color: (theme) => theme.palette.customColor.textGray,
            }}
          >
            {t("No unit type")}
          </Typography>
        )}

        <CustomStackFullWidth
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ pb: "15px" }}
        >
          <AmountWithDiscountedAmount item={item} />
          <AddWithIncrementDecrement
            onHover={state.isTransformed}
            addToCartHandler={addToCart}
            isProductExist={isProductExist}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            count={count}
            isLoading={isLoading}
            updateLoading={updateLoading}
          />
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const foodHorizontalCardUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="flex-start"
        sx={{ position: "relative", padding: "13px 16px 16px 13px" }}
      >
        {isWishlisted && (
          <Box
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 20,
              right: 10,
            }}
          >
            <FavoriteIcon sx={{ fontSize: "15px" }} />
          </Box>
        )}
        {/* <CustomStackFullWidth> */}
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={0.8}
        >
          {isEllipsed ? (
            <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
              <Typography
                ref={textRef}
                variant={horizontalcard === "true" ? "subtitle2" : "h6"}
                marginBottom="4px"
                sx={{
                  color: (theme) => theme.palette.text.custom,
                  fontSize: { xs: "13px", sm: "inherit" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.2", // Adjust this value to control line height
                  mt: "5px",
                }}
                className="name"
                component="h3"
              >
                {item?.name}
              </Typography>
            </PrimaryToolTip>
          ) : (
            <Typography
              ref={textRef}
              variant={horizontalcard === "true" ? "subtitle2" : "h6"}
              marginBottom="4px"
              sx={{
                color: (theme) => theme.palette.text.custom,
                fontSize: { xs: "13px", sm: "inherit" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                lineHeight: "1.2", // Adjust this value to control line height
                mt: "5px",
              }}
              className="name"
              component="h3"
            >
              {item?.name}
            </Typography>
          )}
          {configData?.toggle_veg_non_veg ? (
            <FoodVegNonVegFlag veg={item?.veg === 0 ? "false" : "true"} />
          ) : null}
        </CustomStackFullWidth>
        <Typography
          color="text.secondary"
          variant={isSmall ? "body2" : "body1"}
          component="h4"
        >
          {item?.store_name}
        </Typography>
        {/* Stock tag hidden for food module */}
        {/* {resolvedModuleType === "food" && (
          <InStockTag stock={undefined} compact />
        )} */}
        {/* </CustomStackFullWidth> */}
        <CustomStackFullWidth
          direction="row"
          alignItems="flex-start"
          // justifyContent="space-between"
          spacing={13}
          mb="3px"
          mt="10px"
        >
          <AmountWithDiscountedAmount item={item} />
        </CustomStackFullWidth>
        <CustomStackFullWidth
          alignItems="flex-end"
          sx={{ paddingRight: "6px" }}
        >
          <Box>
            <AddWithIncrementDecrement
              onHover={state.isTransformed}
              addToCartHandler={addToCart}
              isProductExist={isProductExist}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              count={count}
              isLoading={isLoading}
              updateLoading={updateLoading}
            />
          </Box>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };

  const verticalCardUi = () => {
    // Daraz/AliExpress-style layout for ecommerce: left-aligned, title first,
    // then price, then rating — tight padding, no centering.
    if (
      getCurrentModuleType() === ModuleTypes.ECOMMERCE ||
      landingMarketplaceCard
    ) {
      const titleNode = (
        <Typography
          ref={textRef}
          component="h3"
          fontSize={{ xs: "14px", md: "15px" }}
          fontWeight="600"
          sx={{
            color: "text.primary",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: landingMarketplaceCard ? "2.35em" : "2.7em",
            width: "100%",
            textAlign: "left",
          }}
        >
          {item?.name}
        </Typography>
      );
      return (
        <Stack
          className="landing-marketplace-card-body"
          width="100%"
          alignItems="flex-start"
          spacing={landingMarketplaceCard ? 0.35 : 0.5}
          sx={{
            p: landingMarketplaceCard ? "6px 8px 8px" : "8px 10px 12px",
            textAlign: "left",
            flex: 1,
            minHeight: landingMarketplaceCard ? 102 : undefined,
          }}
        >
          {isEllipsed ? (
            <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
              {titleNode}
            </PrimaryToolTip>
          ) : (
            titleNode
          )}
          <AmountWithDiscountedAmount item={item} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            flexWrap="wrap"
          >
            <CustomMultipleRatings rating={item?.avg_rating} withCount />
          </Stack>
          {!landingMarketplaceCard && (
            <Typography
              fontSize="11px"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
                textAlign: "left",
              }}
            >
              {item?.store_name}
            </Typography>
          )}
          {item?.stock !== undefined && item?.stock <= 10 && (
            <InStockTag stock={item?.stock} compact />
          )}
          {landingMarketplaceCard && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{ width: "100%", mt: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                onClick={(e) =>
                  isWishlisted
                    ? removeFromWishlistHandler(e)
                    : addToWishlistHandler(e)
                }
                sx={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "6px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.22)}`,
                  color: isWishlisted
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
                  bgcolor: isWishlisted
                    ? alpha(theme.palette.error.main, 0.06)
                    : theme.palette.background.paper,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    color: theme.palette.error.main,
                    borderColor: alpha(theme.palette.error.main, 0.28),
                  },
                }}
              >
                {isWishlisted ? (
                  <FavoriteIcon sx={{ fontSize: 17 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 17 }} />
                )}
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {isProductExist ? (
                  <AddWithIncrementDecrement
                    compactActions
                    onHover={state.isTransformed}
                    addToCartHandler={addToCart}
                    isProductExist={isProductExist}
                    handleIncrement={handleIncrement}
                    handleDecrement={handleDecrement}
                    count={count}
                    isLoading={isLoading}
                    updateLoading={updateLoading}
                  />
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled={isLoading}
                    onClick={addToCart}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "11px",
                      lineHeight: 1.2,
                      borderRadius: "6px",
                      py: 0.55,
                      minHeight: 32,
                      borderColor: alpha(theme.palette.primary.main, 0.32),
                      color: theme.palette.primary.main,
                      bgcolor: theme.palette.background.paper,
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    {t("Add to Cart")}
                  </Button>
                )}
              </Box>
            </Stack>
          )}
        </Stack>
      );
    }
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={0.6}
        p={item?.module_type === "pharmacy" ? "5px 16px 16px 16px" : "1rem"}
      >
        <Body2 text={item?.store_name} component="h4" />


        {isEllipsed ? (
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Typography
              ref={textRef}
              className={classes.singleLineEllipsis}
              fontSize={{ xs: "14px", md: "15px" }}
              fontWeight="500"
              component="h3"
            >
              {item?.name}
            </Typography>
          </PrimaryToolTip>
        ) : (
          <Typography
            ref={textRef}
            className={classes.singleLineEllipsis}
            fontSize={{ xs: "14px", md: "15px" }}
            fontWeight="500"
            component="h3"
          >
            {item?.name}
          </Typography>
        )}
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {cardType === "vertical-type" ? (
            <Typography>{item?.unit_type}</Typography>
          ) : (
            <CustomMultipleRatings rating={item?.avg_rating} withCount />
          )}

          <AmountWithDiscountedAmount item={item} />
          {/* Stock tag hidden for food module */}
          {item?.stock !== undefined && item?.stock <= 10 && resolvedModuleType !== "food" && (
            <InStockTag stock={item?.stock} compact />
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const verticalCardFlashUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        // p="1rem"
        p="0 4px"
      >
        <Body2 text={item?.store_name} />
        {isEllipsed ? (
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Box ref={textRef}>
              <H3 text={item?.name} component="h3" />
            </Box>
          </PrimaryToolTip>
        ) : (
          <Box ref={textRef}>
            <H3 text={item?.name} component="h3" />
          </Box>
        )}
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {cardType === "vertical-type" ? (
            <Typography>{item?.unit_type}</Typography>
          ) : (
            <CustomMultipleRatings rating={4.5} withCount />
          )}

          {stock === 0 ? (
            <Typography
              variant="h5"
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              gap="5px"
              sx={{
                fontSize: { xs: "13px", sm: "18px" },
                color: alpha(theme.palette.error.deepLight, 0.7),
              }}
            >
              {t("Out of Stock")}
            </Typography>
          ) : (
            <AmountWithDiscountedAmount item={item} />
          )}
          <CustomStackFullWidth mt="100px" spacing={1}>
            <CustomLinearProgressbar value={(sold / stock) * 100} height={3} />
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                fontSize="11px"
                fontWeight="bold"
                lineHeight="16px"
                variant="body2"
              >
                <CustomSpan>{t("Sold")}</CustomSpan> : {sold} {t("items")}
              </Typography>
              <Typography
                fontSize="11px"
                fontWeight="bold"
                lineHeight="16px"
                variant="body2"
              >
                <CustomSpan>{t("Available")}</CustomSpan> : {stock} {t("items")}
              </Typography>
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const verticalCardFlashSliderUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        p="1rem"

      >
        <Body2 paddingTop="5px" text={item?.store_name} component="h4" />
        {isEllipsed ? (
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Box ref={textRef}>
              <H3 text={item?.name} component="h3" />
            </Box>
          </PrimaryToolTip>
        ) : (
          <Box ref={textRef}>
            <H3 text={item?.name} component="h3" />
          </Box>
        )}
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {cardType === "vertical-type" ? (
            <Typography>{item?.unit_type}</Typography>
          ) : (
            <CustomMultipleRatings rating={4.5} withCount />
          )}
          <AmountWithDiscountedAmount item={item} />
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      addFavoriteMutation(item?.id, {
        onSuccess: (response) => {
          if (response) {
            reduxDispatch(addWishList(item));
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      reduxDispatch(removeWishListItem(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    mutate(item?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const handleHoverOnCartIcon = (value) => {
    dispatch({ type: ACTION.setIsTransformed, payload: value });
  };

  detailHandlersRef.current = {
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    imageBaseUrl,
    cardFor,
    stock,
  };

  openViaParentRef.current = () => {
    if (!onRequestDetailModal) return false;
    const h = detailHandlersRef.current;
    onRequestDetailModal({
      item,
      addToWishlistHandler: h.addToWishlistHandler,
      removeFromWishlistHandler: h.removeFromWishlistHandler,
      isWishlisted: h.isWishlisted,
      imageBaseUrl: h.imageBaseUrl,
      cardFor: h.cardFor,
      stock: h.stock,
    });
    return true;
  };

  return (
    <> {!onRequestDetailModal && state.openModal && getCurrentModuleType() === "food" && item ? (
      <FoodDetailModal
        product={item}
        imageBaseUrl={imageBaseUrl}
        open={state.openModal}
        handleModalClose={handleClose}
        setOpen={(value) =>
          dispatch({ type: ACTION.setOpenModal, payload: value })
        }
        addToWishlistHandler={addToWishlistHandler}
        removeFromWishlistHandler={removeFromWishlistHandler}
        isWishlisted={isWishlisted}
      />
    ) : (
      <>
        {cardFor === "flashSale" ? (
          <>
            {!onRequestDetailModal && stock !== 0 && state.openModal && (
              <ModuleModal
                open={state.openModal}
                handleModalClose={handleClose}
                configData={configData}
                productDetailsData={item}
                addToWishlistHandler={addToWishlistHandler}
                removeFromWishlistHandler={removeFromWishlistHandler}
                isWishlisted={isWishlisted}
              />
            )}
          </>
        ) : (
          !onRequestDetailModal && item && state.openModal && (
            <ModuleModal
              open={state.openModal}
              handleModalClose={handleClose}
              configData={configData}
              productDetailsData={item}
              addToWishlistHandler={addToWishlistHandler}
              removeFromWishlistHandler={removeFromWishlistHandler}
              isWishlisted={isWishlisted}
            />
          )
        )}
      </>
    )}
      <Stack sx={{ position: "relative" }}>

        {wishlistcard === "true" && (
          <HeartWrapper onClick={() => setOpenModal(true)} top="5px" right="5px">
            <DeleteIcon style={{ color: theme.palette.error.light }} />
          </HeartWrapper>
        )}

        {specialCard === "true" ? (
          <SpecialCard
            item={item}
            imageBaseUrl={imageBaseUrl}
            quickViewHandleClick={quickViewHandleClick}
            addToCart={addToCart}
            handleBadge={handleBadge}
            addToCartHandler={addToCart}
            isProductExist={isProductExist}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            count={count}
            handleClick={handleClick}
            isLoading={isLoading}
            updateLoading={updateLoading}
            setOpenLocationAlert={setOpenLocationAlert}
            noRecommended={noRecommended}
            configData={configData}
            onShareClick={handleShareClick}
            addToWishlistHandler={addToWishlistHandler}
            removeFromWishlistHandler={removeFromWishlistHandler}
            isWishlisted={isWishlisted}
          />
        ) : (
          <CardWrapper
            cardFor={cardFor}
            cardType={cardType}
            nomargin={noMargin ? "true" : "false"}
            cardheight={cardheight}
            horizontalcard={horizontalcard}
            wishlistcard={wishlistcard}
            cardWidth={cardWidth}
            pharmaCommon={pharmaCommon}
            recentlyViewedMobile={isMobileRecentCard ? "true" : "false"}
            landingmarketplacecard={landingMarketplaceCard ? "true" : "false"}
            onClick={() => handleClick()}
            onMouseEnter={() =>
              dispatch({
                type: ACTION.setIsTransformed,
                payload: true,
              })
            }
            onMouseDown={() =>
              dispatch({
                type: ACTION.setIsTransformed,
                payload: true,
              })
            }
            onMouseLeave={() =>
              dispatch({
                type: ACTION.setIsTransformed,
                payload: false,
              })
            }
          >
            <CustomStackFullWidth
              direction={{
                xs: horizontalcard === "true" ? "row" : "column",
                sm: horizontalcard === "true" ? "row" : "column",
              }}
              justifyContent="flex-start"
              height="100%"
              sx={{
                backgroundColor:
                  horizontalcard === "true" &&
                  changed_bg === "true" &&
                  "primary.semiLight",
                position: "relative",
              }}
            >
              <CustomCardMedia
                horizontalcard={horizontalcard}
                loveItem={loveItem}
                mobilerecentcard={isMobileRecentCard ? "true" : undefined}
                landingmarketplacecard={
                  landingMarketplaceCard ? "true" : undefined
                }
              >
                {isMobileRecentCard ? (
                  <Box
                    className="mobile-recent-image-shell"
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      borderRadius: "16px 16px 0 0",
                    }}
                  >
                    {handleBadge()}
                    <NextImage
                      src={item?.image_full_url}
                      alt={item?.title}
                      height={280}
                      width={280}
                      objectFit="cover"
                      borderRadius="16px 16px 0 0"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                    {item?.module?.module_type === "food" && (
                      <ProductsUnavailable product={item} />
                    )}
                    {item?.halal_tag_status && item?.is_halal ? (
                      <FoodHalalHaram width={30} />
                    ) : null}
                    <Box
                      className="mobile-recent-image-actions"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        position: "absolute",
                        right: "6px",
                        bottom: "6px",
                        zIndex: 6,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AddWithIncrementDecrement
                          onHover={state.isTransformed}
                          addToCartHandler={addToCart}
                          isProductExist={isProductExist}
                          handleIncrement={handleIncrement}
                          handleDecrement={handleDecrement}
                          count={count}
                          isLoading={isLoading}
                          updateLoading={updateLoading}
                          mobileCircularAdd
                          mobileOverlayActions
                          compactActions
                        />
                        <Stack
                          onClick={(e) =>
                            isWishlisted
                              ? removeFromWishlistHandler(e)
                              : addToWishlistHandler(e)
                          }
                          alignItems="center"
                          justifyContent="center"
                          sx={(th) => ({
                            width: recentActionButtonSize,
                            height: recentActionButtonSize,
                            borderRadius: recentActionBorderRadius,
                            cursor: "pointer",
                            border: `1px solid ${alpha(th.palette.neutral[400], 0.35)}`,
                            backgroundColor: alpha(th.palette.neutral[100], 0.78),
                            backdropFilter: "blur(6px)",
                            color: isWishlisted
                              ? th.palette.primary.main
                              : th.palette.text.secondary,
                          })}
                        >
                          {isWishlisted ? (
                            <FavoriteIcon sx={{ fontSize: recentWishlistIconSize }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ fontSize: recentWishlistIconSize }} />
                          )}
                        </Stack>
                        <ProductShareAction
                          onClick={handleShareClick}
                          size={recentActionButtonSize}
                          iconSize={recentShareIconSize}
                          sx={{
                            borderRadius: recentActionBorderRadius,
                            border: `1px solid ${alpha(theme.palette.neutral[300], 0.5)}`,
                            backgroundColor: alpha(theme.palette.common.white, 0.82),
                          }}
                        />
                      </Stack>
                    </Box>
                  </Box>
                ) : landingMarketplaceCard && cardFor === "vertical" ? (
                  <Box
                    className="landing-marketplace-image-shell"
                    sx={{
                      position: "relative",
                      width: "100%",
                      flexShrink: 0,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        p: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "& img": {
                          objectFit: "contain !important",
                        },
                        "& span": {
                          width: "100% !important",
                          height: "100% !important",
                          display: "block !important",
                          position: "relative !important",
                        },
                      }}
                    >
                      <NextImage
                        src={item?.image_full_url}
                        alt={item?.name || item?.title}
                        fill
                        sizes="(max-width: 600px) 72vw, 20vw"
                        objectFit="contain"
                      />
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2,
                        pointerEvents: "none",
                        "& > *": { pointerEvents: "auto" },
                      }}
                    >
                      {handleBadge()}
                    </Box>
                    {item?.module?.module_type === "food" && (
                      <ProductsUnavailable product={item} />
                    )}
                    {item?.halal_tag_status && item?.is_halal ? (
                      <FoodHalalHaram width={30} />
                    ) : null}
                  </Box>
                ) : (
                  <>
                    {handleBadge()}
                    <NextImage
                      src={item?.image_full_url}
                      alt={item?.title}
                      height={horizontalcard ? "144" : "212"}
                      width={horizontalcard ? "131" : "195"}
                      objectFit="cover"
                      borderRadius="3px"
                    />
                    {item?.module?.module_type === "food" && (
                      <ProductsUnavailable product={item} />
                    )}
                    {item?.halal_tag_status && item?.is_halal ? (
                      <FoodHalalHaram width={30} />
                    ) : (
                      ""
                    )}
                  </>
                )}
                {!landingMarketplaceCard &&
                  !useShopCornerActions &&
                  !isMobileRecentCard &&
                  !showImageCornerActionsRow &&
                  !showCardCornerActionsRow && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1001,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ProductShareAction onClick={handleShareClick} />
                  </Box>
                )}
                {useShopCornerActions && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      left: "auto",
                      bottom: "auto",
                      zIndex: 7,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ProductShareAction
                      onClick={handleShareClick}
                      size="32px"
                      iconSize="17px"
                      sx={{
                        borderRadius: "10px",
                        border: `1px solid ${alpha(theme.palette.neutral[300], 0.5)}`,
                        backgroundColor: alpha(theme.palette.common.white, 0.82),
                      }}
                    />
                  </Box>
                )}
                {useShopCornerActions && (
                  <Box
                    className="shop-product-corner-actions"
                    sx={{
                      position: "absolute",
                      right: 8,
                      bottom: 8,
                      left: "auto",
                      top: "auto",
                      zIndex: 6,
                      opacity: shopCornerActionsVisible ? 1 : 0,
                      transition: "opacity 0.25s ease",
                      pointerEvents: shopCornerActionsVisible ? "auto" : "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <QuickView
                        cornerLayout
                        noQuickview
                        quickViewHandleClick={quickViewHandleClick}
                        addToWishlistHandler={addToWishlistHandler}
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        isWishlisted={isWishlisted}
                        addToCartHandler={addToCart}
                        showAddtocart={!isProductExist}
                        isLoading={isLoading}
                        setOpenLocationAlert={setOpenLocationAlert}
                      />
                      {isProductExist && (
                        <AddWithIncrementDecrement
                          mobileCircularAdd
                          mobileOverlayActions
                          onHover={state.isTransformed}
                          addToCartHandler={addToCart}
                          isProductExist={isProductExist}
                          handleIncrement={handleIncrement}
                          handleDecrement={handleDecrement}
                          count={count}
                          isLoading={isLoading}
                          updateLoading={updateLoading}
                        />
                      )}
                    </Stack>
                  </Box>
                )}
                {!useShopCornerActions &&
                  !isMobileRecentCard &&
                  !isDesktopRecentCard &&
                  !disableHoverOverlay &&
                  !landingMarketplaceCard && (
                  <CustomOverLay hover={state.isTransformed} border_radius="10px">
                    <QuickView
                      quickViewHandleClick={quickViewHandleClick}
                      addToWishlistHandler={addToWishlistHandler}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      isWishlisted={isWishlisted}
                      isProductExist={isProductExist}
                      addToCartHandler={addToCart}
                      showAddtocart={cardFor === "vertical" && !isProductExist}
                      isLoading={isLoading}
                      openLocationAlert={openLocationAlert}
                      setOpenLocationAlert={setOpenLocationAlert}
                      onShareClick={handleShareClick}
                    />
                  </CustomOverLay>
                )}
                {cardFor === "vertical" &&
                  isProductExist &&
                  !useShopCornerActions &&
                  !landingMarketplaceCard && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 10,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  >
                    <AddWithIncrementDecrement
                      verticalCard
                      onHover={state.isTransformed}
                      addToCartHandler={addToCart}
                      isProductExist={isProductExist}
                      handleIncrement={handleIncrement}
                      handleDecrement={handleDecrement}
                      setIsHover={handleHoverOnCartIcon}
                      count={count}
                      updateLoading={updateLoading}
                    />
                  </Box>
                )}
                {showImageCornerActionsRow && cardFor === "popular items" && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 6,
                      bottom: 6,
                      zIndex: 1000,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AddWithIncrementDecrement
                        onHover={state.isTransformed}
                        addToCartHandler={addToCart}
                        isProductExist={isProductExist}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                        count={count}
                        isLoading={isLoading}
                        updateLoading={updateLoading}
                        desktopPillMode
                        compactActions={isRecentlyViewedCompactActions}
                      />
                      <Stack
                        onClick={(e) =>
                          isWishlisted
                            ? removeFromWishlistHandler(e)
                            : addToWishlistHandler(e)
                        }
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          width: recentActionIconSize,
                          height: recentActionIconSize,
                          borderRadius: "7px",
                          cursor: "pointer",
                          border: (theme) =>
                            `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                          backgroundColor: (theme) =>
                            alpha(theme.palette.common.white, 0.35),
                          backdropFilter: "blur(6px)",
                          color: (theme) =>
                            isWishlisted
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                          "&:hover": {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.common.white, 0.5),
                          },
                        }}
                      >
                        {isWishlisted ? (
                          <FavoriteIcon
                            sx={{
                              fontSize: isRecentlyViewedCompactActions ? "14px" : "16px",
                            }}
                          />
                        ) : (
                          <FavoriteBorderIcon
                            sx={{
                              fontSize: isRecentlyViewedCompactActions ? "14px" : "16px",
                            }}
                          />
                        )}
                      </Stack>
                      <ProductShareAction
                        onClick={handleShareClick}
                        size={recentActionIconSize}
                        iconSize={isRecentlyViewedCompactActions ? "14px" : "16px"}
                      />
                    </Stack>
                  </Box>
                )}
              </CustomCardMedia>
              <CustomStackFullWidth justifyContent="center">
                {cardFor === "popular items" && popularCardUi()}
                {cardFor === "vertical" && verticalCardUi()}
                {cardFor === "flashSale" && verticalCardFlashUi()}
                {cardFor === "flashSaleSlider" && verticalCardFlashSliderUi()}
                {cardFor === "food horizontal card" && foodHorizontalCardUi()}
                {cardFor === "list-view" && listViewCardUi()}
              </CustomStackFullWidth>
              {showCardCornerActionsRow && cardFor === "popular items" && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                    zIndex: 1000,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <AddWithIncrementDecrement
                      onHover={state.isTransformed}
                      addToCartHandler={addToCart}
                      isProductExist={isProductExist}
                      handleIncrement={handleIncrement}
                      handleDecrement={handleDecrement}
                      count={count}
                      isLoading={isLoading}
                      updateLoading={updateLoading}
                      desktopPillMode
                    />
                    <Stack
                      onClick={(e) =>
                        isWishlisted
                          ? removeFromWishlistHandler(e)
                          : addToWishlistHandler(e)
                      }
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                        backgroundColor: (theme) =>
                          alpha(theme.palette.common.white, 0.35),
                        backdropFilter: "blur(6px)",
                        color: (theme) =>
                          isWishlisted
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.common.white, 0.5),
                        },
                      }}
                    >
                      {isWishlisted ? (
                        <FavoriteIcon sx={{ fontSize: "16px" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ fontSize: "16px" }} />
                      )}
                    </Stack>
                    <ProductShareAction onClick={handleShareClick} />
                  </Stack>
                </Box>
              )}
            </CustomStackFullWidth>
          </CardWrapper>
        )}

        {openShareModal && (
          <StoreShare
            shareUrl={shareUrl}
            handleCopy={handleCopy}
            setOpenShareModal={setOpenShareModal}
            openShareModal={openShareModal}
          />
        )}

        <CustomDialogConfirm
          dialogTexts={t("Are you sure you want to  delete this item?")}
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={() => deleteWishlistItem(item?.id)}
        />
        <CustomModal
          openModal={openLocationAlert}
          handleClose={() => setOpenLocationAlert(false)}
        >
          <GetLocationAlert setOpenAlert={setOpenLocationAlert} />
        </CustomModal>
      </Stack>
    </>
  );
};

ProductCard.propTypes = {};

export default ProductCard;
