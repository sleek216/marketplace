import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  alpha,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { checkLocationBeforeCart } from "helper-functions/headerSessionSync";
import { useDispatch, useSelector } from "react-redux";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useAddCartItem from "api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import useDeleteCartItem from "api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import NextImage from "components/NextImage";
import AmountWithDiscountedAmount from "../AmountWithDiscountedAmount";
import { useRouter } from "next/router";
import {
  mapApiCartRowsToReduxItems,
  getCartsFromResponse,
} from "helper-functions/normalizeCartListResponse";
import { getGuestId } from "helper-functions/getToken";
import { isAvailable } from "utils/CustomFunctions";
import {
  not_logged_in_message,
  out_of_stock,
  update_error_text,
  product_updated_in_cart_message,
} from "utils/toasterMessages";
import {
  setCart,
  setCartList,
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "redux/slices/cart";
import { addWishList, removeWishListItem } from "redux/slices/wishList";

const formatSoldLabel = (raw, t) => {
  const count = Number(raw);
  if (!Number.isFinite(count) || count <= 0) return null;
  if (count >= 1000) {
    const k = count / 1000;
    const value =
      k >= 10 ? String(Math.floor(k)) : k.toFixed(1).replace(/\.0$/, "");
    return `${value}K+ ${t("Sold")}`;
  }
  return `${count}+ ${t("Sold")}`;
};

const RatingStars = ({ rating = 0 }) => {
  const theme = useTheme();
  const filled = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <Stack direction="row" alignItems="center" spacing={0}>
      {Array.from({ length: 5 }).map((_, i) => {
        const Icon = i < filled ? StarIcon : StarBorderIcon;
        return (
          <Icon
            key={i}
            sx={{ fontSize: 11, color: theme.palette.warning.main }}
          />
        );
      })}
    </Stack>
  );
};

/** Marketplace card actions — balanced size, fills footer width */
const R = "2px";
const ACTION_SIZE = 36;

const InlineQty = ({ value, onDec, onInc, disabled, min = 1 }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        height: ACTION_SIZE,
        flex: 1,
        minWidth: 0,
        borderRadius: R,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        overflow: "hidden",
        bgcolor: alpha(theme.palette.grey[100], 0.75),
      }}
    >
      <Box
        component="button"
        type="button"
        disabled={disabled || value <= min}
        onClick={onDec}
        sx={{
          all: "unset",
          width: 34,
          height: ACTION_SIZE,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          cursor: disabled || value <= min ? "default" : "pointer",
          color: "text.secondary",
          opacity: disabled || value <= min ? 0.4 : 1,
          borderRadius: 0,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            color: "primary.main",
          },
        }}
      >
        <RemoveIcon sx={{ fontSize: 16 }} />
      </Box>
      <Typography
        sx={{
          flex: 1,
          textAlign: "center",
          fontSize: "13px",
          fontWeight: 700,
          lineHeight: 1,
          color: "text.primary",
        }}
      >
        {value}
      </Typography>
      <Box
        component="button"
        type="button"
        disabled={disabled}
        onClick={onInc}
        sx={{
          all: "unset",
          width: 34,
          height: ACTION_SIZE,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          cursor: disabled ? "default" : "pointer",
          color: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          opacity: disabled ? 0.4 : 1,
          borderRadius: 0,
          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.16) },
        }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </Box>
    </Stack>
  );
};

const LandingProductCard = ({ item, onRequestDetail }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const reduxDispatch = useDispatch();
  const { wishLists } = useSelector((state) => state.wishList);
  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const { configData } = useSelector((state) => state.configData);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [qty, setQty] = useState(1);
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate: removeFavoriteMutation } = useWishListDelete();
  const { mutate: addToMutate, isLoading: isAddingToCart } = useAddCartItem();
  const { mutate: updateMutate, isLoading: updateLoading } =
    useCartItemUpdate();
  const { mutate: cartItemRemoveMutate } = useDeleteCartItem();

  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const cartItem = aliasCartList?.find((cart) => String(cart.id) === String(item?.id));
  const isProductExist = Boolean(cartItem);
  const cartCount = cartItem?.quantity || 0;

  const parsedRating = Number(item?.avg_rating ?? item?.avgRating ?? 0);
  const hasRating = Number.isFinite(parsedRating) && parsedRating > 0;
  const reviewCount = Number(item?.rating_count ?? item?.review_count ?? 0);
  const soldLabel = formatSoldLabel(
    item?.order_count ?? item?.sold ?? item?.total_sold,
    t
  );
  const storeName = item?.store_name || item?.store?.name;
  const moduleName = item?.module_name || item?.module?.module_name;
  const moduleType = item?.module_type || item?.module?.module_type;
  const unit =
    item?.unit_type ||
    item?.unit?.unit ||
    (item?.unit ? String(item.unit) : null);

  const resolvedStock = Number(item?.stock);
  const isFoodItem = moduleType === "food";
  const isOutOfStock =
    !isFoodItem && Number.isFinite(resolvedStock) && resolvedStock <= 0;
  const maxQty =
    !isFoodItem && Number.isFinite(resolvedStock) && resolvedStock > 0
      ? resolvedStock
      : 99;

  const hasFreeDelivery =
    item?.free_delivery === true ||
    item?.store?.free_delivery === true ||
    configData?.admin_free_delivery?.type === "free_delivery_to_all_store";

  useEffect(() => {
    setIsWishlisted(
      Boolean(wishLists?.item?.some((wishItem) => wishItem.id === item?.id))
    );
  }, [wishLists, item?.id]);

  useEffect(() => {
    setQty(1);
  }, [item?.id]);

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error(t(not_logged_in_message));
      return;
    }
    addFavoriteMutation(item?.id, {
      onSuccess: (response) => {
        if (response) {
          reduxDispatch(addWishList(item));
          setIsWishlisted(true);
          toast.success(response?.message);
        }
      },
      onError: onErrorResponse,
    });
  };

  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    removeFavoriteMutation(item?.id, {
      onSuccess: (res) => {
        reduxDispatch(removeWishListItem(item?.id));
        setIsWishlisted(false);
        toast.success(res.message, { id: "wishlist" });
      },
      onError: onErrorResponse,
    });
  };

  const openProductModal = (e) => {
    e?.stopPropagation?.();
    router.push({
      pathname: "/product/[id]",
      query: {
        id: `${item?.slug ? item?.slug : item?.id}`,
        module_id: `${item?.module_id || item?.module?.id || ""}`,
      },
    }).then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleAddSuccess = (res) => {
    if (!res) return;
    let product = {};
    res.forEach((entry) => {
      product = {
        ...entry?.item,
        cartItemId: entry?.id,
        quantity: entry?.quantity,
        totalPrice: entry?.price,
        selectedOption: [],
      };
    });
    reduxDispatch(setCart({ ...product, isUpdate: true }));
    setQty(1);
    toast.success(t("Item added to cart"));
  };

  const clampQty = (value) => Math.min(Math.max(1, value), maxQty);

  const handleLocalIncrement = (e) => {
    e.stopPropagation();
    setQty((prev) => clampQty(prev + 1));
  };

  const handleLocalDecrement = (e) => {
    e.stopPropagation();
    setQty((prev) => clampQty(prev - 1));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!checkLocationBeforeCart()) {
      return;
    }
    if (isOutOfStock) {
      toast.error(t(out_of_stock));
      return;
    }

    const hasVariants =
      item?.variations?.length > 0 ||
      item?.has_variant ||
      item?.food_variations?.length > 0;

    if (moduleType === "food") {
      const foodAvailable = isAvailable(
        item?.available_time_starts,
        item?.available_time_ends
      );
      if (!foodAvailable && !item?.schedule_order) {
        toast.error(t("This food is not available right now."));
        return;
      }
    }

    if (hasVariants) {
      openProductModal(e);
      return;
    }

    const addQty = Math.min(Math.max(1, qty), maxQty);
    const resolvedPrice = Number(item?.price ?? item?.unit_price ?? item?.price_with_discount ?? 0) || 0;

    if (isProductExist && cartItem) {
      const currentQty = Number(cartItem?.quantity || 0);
      const remainingStock = Number.isFinite(resolvedStock) ? resolvedStock - currentQty : null;

      if (remainingStock !== null && remainingStock <= 0) {
        toast.error(t(out_of_stock));
        return;
      }

      const finalAddQty = remainingStock !== null ? Math.min(addQty, remainingStock) : addQty;
      if (finalAddQty <= 0) {
        toast.error(t(out_of_stock));
        return;
      }

      const updateQuantity = currentQty + finalAddQty;
      const updateItemObject = {
        cart_id: cartItem?.cartItemId || cartItem?.id,
        guest_id: getGuestId(),
        model: item?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids: [],
        add_on_qtys: [],
        item_id: item?.id,
        price: resolvedPrice * updateQuantity,
        quantity: updateQuantity,
        variation: [],
        moduleIdOverride: item?.module_id || item?.module?.id,
      };

      const tempProduct = {
        ...cartItem,
        quantity: updateQuantity,
        totalPrice: resolvedPrice * updateQuantity,
        isUpdate: true,
      };
      reduxDispatch(setCart(tempProduct));
      setQty(1);

      updateMutate(updateItemObject, {
        onSuccess: (res) => {
          toast.success(t("Item added to cart"), { id: "cart-toast" });
          if (res) {
            const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
            const itemModuleId = item?.module_id || item?.module?.id;
            const itemModuleType = item?.module_type || item?.module?.module_type;
            const otherModulesItems = aliasCartList.filter((c) => {
              const cModuleId = c?.module_id || c?.module?.id;
              const cModuleType = c?.module_type || c?.module?.module_type;
              if (itemModuleId && cModuleId) return String(cModuleId) !== String(itemModuleId);
              if (itemModuleType && cModuleType) return cModuleType !== itemModuleType;
              return true;
            });
            const normalizedApiItems = mappedFromApi.map((apiItem) => ({
              ...apiItem,
              module_id: apiItem?.module_id || itemModuleId,
              module_type: apiItem?.module_type || itemModuleType,
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
      return;
    }

    const itemModuleId = item?.module_id || item?.module?.id;
    const itemModuleType = item?.module_type || item?.module?.module_type;

    // Optimistic instant 0ms Add to Cart
    const tempProduct = {
      ...item,
      id: item?.id,
      cartItemId: item?.cartItemId || `temp_${item?.id}_${Date.now()}`,
      quantity: addQty,
      price: resolvedPrice,
      totalPrice: resolvedPrice * addQty,
      selectedOption: [],
      module_id: itemModuleId,
      module_type: itemModuleType,
      module: item?.module,
    };
    reduxDispatch(setCart(tempProduct));
    setQty(1);

    addToMutate(
      {
        guest_id: getGuestId(),
        model: item?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids: [],
        add_on_qtys: [],
        item_id: item?.id,
        price: resolvedPrice,
        quantity: addQty,
        variation: [],
        moduleIdOverride: itemModuleId,
      },
      {
        onSuccess: (res) => {
          toast.success(t("Item added to cart"), { id: "cart-toast" });
          if (res) {
            const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
            const otherModulesItems = aliasCartList.filter((c) => {
              const cModuleId = c?.module_id || c?.module?.id;
              const cModuleType = c?.module_type || c?.module?.module_type;
              if (itemModuleId && cModuleId) return String(cModuleId) !== String(itemModuleId);
              if (itemModuleType && cModuleType) return cModuleType !== itemModuleType;
              return true;
            });
            const normalizedApiItems = mappedFromApi.map((apiItem) => ({
              ...apiItem,
              module_id: apiItem?.module_id || itemModuleId,
              module_type: apiItem?.module_type || itemModuleType,
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
            onErrorResponse(err);
          }
        },
      }
    );
  };

  const handleUpdateExistingCart = (e) => {
    e.stopPropagation();
    if (!cartItem?.cartItemId) return;
    const targetQty = clampQty(qty);
    if (targetQty === cartCount) {
      toast.error(t(update_error_text));
      return;
    }
    if (targetQty > maxQty) {
      toast.error(t(out_of_stock));
      return;
    }
    const itemModuleId = item?.module_id || item?.module?.id || cartItem?.module_id;
    const itemModuleType = item?.module_type || item?.module?.module_type || cartItem?.module_type;

    // Optimistic instant UI update
    reduxDispatch(
      setIncrementToCartItem({
        ...cartItem,
        quantity: targetQty,
        module_id: itemModuleId,
        module_type: itemModuleType,
        isUpdate: true,
      })
    );
    toast.success(t(product_updated_in_cart_message), { id: "cart-update" });
    updateMutate(
      { cart_id: cartItem.cartItemId, quantity: targetQty, moduleIdOverride: itemModuleId },
      {
        onSuccess: (res) => {
          const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
          const otherModulesItems = cartList.filter((c) => {
            const cModuleId = c?.module_id || c?.module?.id;
            const cModuleType = c?.module_type || c?.module?.module_type;
            if (itemModuleId && cModuleId) return String(cModuleId) !== String(itemModuleId);
            if (itemModuleType && cModuleType) return cModuleType !== itemModuleType;
            return true;
          });
          reduxDispatch(setCartList([...otherModulesItems, ...mappedFromApi]));
        },
        onError: (err) => {
          const status = err?.response?.status;
          const msg = (err?.response?.data?.message || err?.response?.data?.errors?.[0]?.message || "").toLowerCase();
          const isNotFound = status === 404 || msg.includes("not found") || msg.includes("notfound");
          if (!isNotFound) {
            onErrorResponse(err);
          }
        },
      }
    );
  };

  const handleCartButtonClick = (e) => {
    e.stopPropagation();
    handleAddToCart(e);
  };

  const bumpPreAddQty = (delta) => (e) => {
    e.stopPropagation();
    setQty((prev) => Math.min(maxQty, Math.max(1, prev + delta)));
  };

  const busy = isAddingToCart || updateLoading;

  return (
    <Box
      onClick={() => openProductModal()}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: R,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
        boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.06)}`,
        cursor: "pointer",
        transition: "box-shadow 0.18s ease",
        position: "relative",
        "&:hover": {
          boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.1)}`,
          zIndex: 1,
        },
      }}
    >
      {/* Shorter image ratio (~4:3 feel via 85%) */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          flexShrink: 0,
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : "#fafafa",
          "&::before": {
            content: '""',
            display: "block",
            paddingTop: "85%",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            p: 0.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& img": { objectFit: "contain !important" },
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
            sizes="(max-width: 600px) 48vw, 18vw"
            objectFit="contain"
          />
        </Box>

        {isOutOfStock && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              bgcolor: alpha("#000", 0.4),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
              }}
            >
              {t("Out of Stock")}
            </Typography>
          </Box>
        )}
      </Box>

      <Stack sx={{ flex: 1, px: 1, pt: 0.6, pb: 0.85, gap: 0.3, minWidth: 0 }}>
        {/* Module + store */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ minWidth: 0 }}
        >
          {moduleName && (
            <Typography
              component="span"
              sx={{
                fontSize: "9px",
                fontWeight: 700,
                color: "primary.main",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                flexShrink: 0,
              }}
            >
              {moduleName}
            </Typography>
          )}
          {moduleName && storeName && (
            <Typography
              component="span"
              sx={{ fontSize: "9px", color: "text.disabled" }}
            >
              ·
            </Typography>
          )}
          {storeName && (
            <Typography
              component="span"
              sx={{
                fontSize: "10px",
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {storeName}
            </Typography>
          )}
        </Stack>

        <Typography
          component="h3"
          sx={{
            fontSize: { xs: "14px", md: "15px" },
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
          }}
        >
          {item?.name}
        </Typography>

        {/* Meta: unit / stock */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.6}
          flexWrap="wrap"
          useFlexGap
          sx={{ rowGap: 0.15 }}
        >
          {unit && (
            <Typography
              component="span"
              sx={{ fontSize: "10px", color: "text.secondary" }}
            >
              {unit}
            </Typography>
          )}
          {!isFoodItem && Number.isFinite(resolvedStock) && (
            <Typography
              component="span"
              sx={{
                fontSize: "10px",
                color: isOutOfStock ? "error.main" : "text.secondary",
              }}
            >
              {isOutOfStock
                ? t("Out of Stock")
                : `${resolvedStock} ${t("in stock")}`}
            </Typography>
          )}
        </Stack>

        <AmountWithDiscountedAmount item={item} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          flexWrap="wrap"
          useFlexGap
          sx={{ rowGap: 0.2 }}
        >
          {(hasRating || reviewCount > 0) && (
            <Stack direction="row" alignItems="center" spacing={0.35}>
              <RatingStars rating={hasRating ? parsedRating : 0} />
              {hasRating && (
                <Typography
                  component="span"
                  sx={{ fontSize: "10px", fontWeight: 600 }}
                >
                  {parsedRating.toFixed(1)}
                </Typography>
              )}
              {reviewCount > 0 && (
                <Typography
                  component="span"
                  sx={{ fontSize: "10px", color: "text.secondary" }}
                >
                  ({reviewCount})
                </Typography>
              )}
            </Stack>
          )}
          {soldLabel && (
            <Typography
              component="span"
              sx={{ fontSize: "10px", color: "text.secondary" }}
            >
              {soldLabel}
            </Typography>
          )}
        </Stack>

        {hasFreeDelivery && (
          <Stack direction="row" alignItems="center" spacing={0.3}>
            <LocalShippingOutlinedIcon
              sx={{ fontSize: 12, color: "success.main" }}
            />
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 600,
                color: "success.dark",
              }}
            >
              {t("Free Shipping")}
            </Typography>
          </Stack>
        )}

        {/* Actions: qty fills width → cart → fav */}
        <Box
          sx={{ mt: "auto", pt: 0.6 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Stack direction="row" alignItems="center" spacing={0.6} width="100%">
            <InlineQty
              value={qty}
              onDec={handleLocalDecrement}
              onInc={handleLocalIncrement}
              disabled={busy || (!isProductExist && isOutOfStock)}
              min={1}
            />

            <IconButton
              aria-label={t("Add to Cart")}
              disabled={busy || isOutOfStock}
              onClick={handleCartButtonClick}
              sx={{
                width: ACTION_SIZE,
                height: ACTION_SIZE,
                p: 0,
                flexShrink: 0,
                borderRadius: R,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": {
                  bgcolor: alpha(theme.palette.grey[500], 0.35),
                  color: "#fff",
                },
              }}
            >
              <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>

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
                width: ACTION_SIZE,
                height: ACTION_SIZE,
                p: 0,
                flexShrink: 0,
                borderRadius: R,
                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                bgcolor: "background.paper",
                color: isWishlisted ? "error.main" : "text.secondary",
                "&:hover": {
                  color: "error.main",
                  borderColor: alpha(theme.palette.error.main, 0.45),
                  bgcolor: alpha(theme.palette.error.main, 0.04),
                },
              }}
            >
              {isWishlisted ? (
                <FavoriteIcon sx={{ fontSize: 18 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LandingProductCard;
