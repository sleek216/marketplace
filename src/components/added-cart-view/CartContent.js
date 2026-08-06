import React, { useState } from "react";
import { alpha, Box, Checkbox, Typography } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartList,
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "redux/slices/cart";
import {
  mapApiCartRowsToReduxItems,
  getCartsFromResponse,
} from "helper-functions/normalizeCartListResponse";
import FoodDetailModal from "../food-details/foodDetail-modal/FoodDetailModal";
import VariationContent from "./VariationContent";
import { toast } from "react-hot-toast";
import { t } from "i18next";
import {
  cart_item_remove,
  out_of_limits,
  out_of_stock,
} from "utils/toasterMessages";
import { resolveCartItemModuleId } from "helper-functions/getCartListModuleWise";
import ModuleModal from "../cards/ModuleModal";
import { CartIncrementStack } from "./Cart.style";
import { useTheme } from "@emotion/react";
import useDeleteCartItem from "../../api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useCartItemUpdate from "../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import { getItemDataForAddToCart } from "../product-details/product-details-section/helperFunction";
import Loading from "../custom-loading/Loading";
import {
  getTotalVariationsPrice,
  handleTotalAmountWithAddons,
} from "utils/CustomFunctions";

const CartContent = (props) => {
  const { cartItem, imageBaseUrl, isSelected, onToggleSelect, refetch } = props;
  const { configData } = useSelector((state) => state.configData);
  const { cartList } = useSelector((state) => state.cart);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const guestId = localStorage.getItem("guest_id");
  const { mutate, isLoading: removeIsLoading } = useDeleteCartItem();
  const { mutate: updateMutate, isLoading } = useCartItemUpdate();
  const updateTimerRef = React.useRef(null);
  const latestRequestVersionRef = React.useRef(0);

  React.useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  const handleSyncFromApi = (res) => {
    if (!res) return;
    const carts = getCartsFromResponse(res);
    if (Array.isArray(carts) && carts.length > 0) {
      const mapped = mapApiCartRowsToReduxItems(carts);
      const itemModuleId = cartItem?.module_id || cartItem?.module?.id;
      const itemModuleType = cartItem?.module_type || cartItem?.module?.module_type;
      const otherModulesItems = (cartList || []).filter((c) => {
        const cModuleId = c?.module_id || c?.module?.id;
        const cModuleType = c?.module_type || c?.module?.module_type;
        if (itemModuleId && cModuleId) return String(cModuleId) !== String(itemModuleId);
        if (itemModuleType && cModuleType) return cModuleType !== itemModuleType;
        return true;
      });
      const normalizedApiItems = mapped.map((apiItem) => ({
        ...apiItem,
        module_id: apiItem?.module_id || itemModuleId,
        module_type: apiItem?.module_type || itemModuleType,
      }));
      dispatch(setCartList([...otherModulesItems, ...normalizedApiItems]));
    }
  };

  const cartUpdateHandleSuccess = (res) => {
    handleSyncFromApi(res);
    refetch?.();
  };

  /**
   * Resolve the authoritative per-unit price for a cart item.
   * Priority (per API doc: cartRow.price = unit price):
   * 1. itemBasePrice  — set from cartRow.price by normalizeCartListResponse
   * 2. price          — top-level price field (also from API)
   * 3. totalPrice÷qty — derive from what we know
   * 4. selectedOption[0].price — last resort for variation-only items
   */
  const getSingleUnitPrice = (item) => {
    if (Number(item?.itemBasePrice) > 0) return Number(item.itemBasePrice);
    if (Number(item?.price) > 0) return Number(item.price);
    const qty = Number(item?.quantity);
    if (qty > 0 && Number(item?.totalPrice) > 0) {
      return Number(item.totalPrice) / qty;
    }
    if (item?.selectedOption?.length > 0 && Number(item?.selectedOption?.[0]?.price) > 0) {
      return Number(item.selectedOption[0].price);
    }
    return Number(item?.item?.price || 0);
  };

  /**
   * Sync quantity change to backend.
   * IMPORTANT: API POST /cart/update-quantity expects `price` = UNIT price (not total).
   * cartRow.price in GET response is also unit price — they must match.
   */
  const syncQuantityWithApi = (targetItem, targetQuantity, targetTotalPrice, targetUnitPrice) => {
    latestRequestVersionRef.current += 1;
    const currentVersion = latestRequestVersionRef.current;

    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
    }

    updateTimerRef.current = setTimeout(() => {
      // Send unit price to backend (NOT total price). Backend stores this as cartRow.price.
      const priceForApi = targetUnitPrice ?? targetTotalPrice;
      const itemObject = {
        ...getItemDataForAddToCart(
          targetItem,
          targetQuantity,
          priceForApi,
          guestId
        ),
        moduleIdOverride: resolveCartItemModuleId(targetItem),
      };

      updateMutate(itemObject, {
        onSuccess: (res) => {
          if (currentVersion === latestRequestVersionRef.current) {
            cartUpdateHandleSuccess(res);
          }
        },
        onError: (err) => {
          if (currentVersion === latestRequestVersionRef.current) {
            refetch?.();
            onErrorResponse(err);
          }
        },
      });
    }, 1200);
  };

  const handleIncrement = (cartItem) => {
    const updateQuantity = (cartItem?.quantity || 1) + 1;
    const unitPrice = getSingleUnitPrice(cartItem);
    const mainPrice = unitPrice * updateQuantity;

    const isFoodItem =
      cartItem?.module_type === "food" ||
      cartItem?.module?.module_type === "food";
    const optionStock = Number(cartItem?.selectedOption?.[0]?.stock);
    const itemStock = Number(cartItem?.stock);
    const hasOptionStock = Number.isFinite(optionStock);
    const hasItemStock = Number.isFinite(itemStock);
    const effectiveStock = hasOptionStock
      ? optionStock
      : !isFoodItem && hasItemStock
      ? itemStock
      : null;

    if (effectiveStock !== null && cartItem?.quantity >= effectiveStock) {
      toast.error(t(out_of_stock));
      return;
    }
    if (cartItem?.maximum_cart_quantity) {
      if (cartItem?.maximum_cart_quantity <= cartItem?.quantity) {
        toast.error(t(out_of_limits));
        return;
      }
    }

    // Optimistically update Redux store immediately for 0ms UI response
    const product = {
      ...cartItem,
      totalPrice: mainPrice,
      quantity: updateQuantity,
    };
    dispatch(setIncrementToCartItem({ ...product, isUpdate: true }));

    // Debounce server API sync — send UNIT PRICE (not total) to backend
    syncQuantityWithApi(cartItem, updateQuantity, mainPrice, unitPrice);
  };

  const handleDecrement = () => {
    const updateQuantity = cartItem?.quantity - 1;
    if (updateQuantity < 1) return;
    const unitPrice = getSingleUnitPrice(cartItem);
    const mainPrice = unitPrice * updateQuantity;

    // Optimistically update Redux store immediately for 0ms UI response
    const decProduct = {
      ...cartItem,
      totalPrice: mainPrice,
      quantity: updateQuantity,
    };
    dispatch(setDecrementToCartItem({ ...decProduct, isUpdate: true }));

    // Debounce server API sync — send UNIT PRICE (not total) to backend
    syncQuantityWithApi(cartItem, updateQuantity, mainPrice, unitPrice);
  };

  const handleSuccess = () => {
    dispatch(setRemoveItemFromCart(cartItem));
    toast.success(t(cart_item_remove));
    refetch?.();
  };
  const handleRemove = () => {
    const cartIdAndGuestId = {
      cart_id: cartItem?.cartItemId,
      guestId: guestId,
      moduleIdOverride: resolveCartItemModuleId(cartItem),
    };
    mutate(cartIdAndGuestId, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };
  const handleUpdateModalOpen = () => {
    setUpdateModalOpen(true);
  };
  const handleFoodItemTotalPriceWithAddons = () => {
    if (cartItem?.selectedAddons?.length > 0) {
      const addOnsTotalPrice = cartItem?.selectedAddons?.reduce(
        (prev, addOn) => addOn?.price * addOn?.quantity + prev,
        0
      );
      return addOnsTotalPrice + cartItem?.totalPrice;
    } else {
      return cartItem?.totalPrice;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
          width: "100%",
          p: 1.25,
          mb: 1,
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.65)}`,
          bgcolor: theme.palette.background.paper,
          transition: "border-color 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.35),
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          },
        }}
      >
        <Stack justifyContent="center" sx={{ pt: 0.5 }}>
          <Checkbox
            checked={Boolean(isSelected)}
            onChange={() => onToggleSelect?.(cartItem)}
            size="small"
            sx={{
              padding: "2px",
              borderRadius: "2px",
              color: theme.palette.divider,
              "&.Mui-checked": {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Stack>
        <Box
          onClick={() => handleUpdateModalOpen()}
          sx={{
            width: 72,
            height: 72,
            minWidth: 72,
            flexShrink: 0,
            borderRadius: "2px",
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            cursor: "pointer",
          }}
        >
          <CustomImageContainer
            height="100%"
            width="100%"
            src={cartItem?.image_full_url}
            borderRadius="2px"
            objectfit="cover"
          />
        </Box>
        <Stack flex={1} minWidth={0} justifyContent="center" spacing={0.35}>
          <Typography
            fontWeight={600}
            fontSize={{ xs: "14px", sm: "15px" }}
            lineHeight={1.35}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              cursor: "pointer",
            }}
            onClick={() => handleUpdateModalOpen()}
          >
            {cartItem?.name}
          </Typography>
          {cartItem?.module_type === "pharmacy" && cartItem?.generic_name && (
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
              }}
              variant="body2"
              color="text.secondary"
              fontSize="12px"
            >
              {Array.isArray(cartItem?.generic_name)
                ? cartItem?.generic_name[0]
                : cartItem?.generic_name}
            </Typography>
          )}
          {cartItem?.is_prescription_required == 1 && (
            <Typography
              color={theme.palette.error.main}
              fontSize="11px"
              textTransform="capitalize"
            >
              {t("prescription is required")}
            </Typography>
          )}
          <VariationContent cartItem={cartItem} />
          {/* ── Item price: discount → unit price → × qty → addons ── */}
          <Typography
            fontWeight={700}
            fontSize={{ xs: "14px", sm: "15px" }}
            color="primary.main"
            lineHeight={1.2}
          >
            {(() => {
              const qty = cartItem?.quantity || 1;
              /**
               * Unit price priority (same as getSingleUnitPrice):
               * 1. itemBasePrice (API cartRow.price — authoritative)
               * 2. price field
               * 3. totalPrice÷qty
               * 4. selectedOption[0].price (variation fallback)
               */
              const unitPrice =
                Number(cartItem?.itemBasePrice) > 0
                  ? Number(cartItem.itemBasePrice)
                  : Number(cartItem?.price) > 0
                  ? Number(cartItem.price)
                  : qty > 0 && Number(cartItem?.totalPrice) > 0
                  ? Number(cartItem.totalPrice) / qty
                  : Number(cartItem?.selectedOption?.[0]?.price) > 0
                  ? Number(cartItem.selectedOption[0].price)
                  : 0;

              // Apply per-unit discount (amount OR percent/fixed)
              let discountedUnitPrice = unitPrice;
              const discount = Number(cartItem?.discount);
              const discountType = cartItem?.discount_type;
              if (discount > 0) {
                if (discountType === "amount") {
                  discountedUnitPrice = Math.max(0, unitPrice - discount);
                } else if (discountType === "percent" || discountType === "fixed") {
                  discountedUnitPrice = unitPrice - (discount / 100) * unitPrice;
                }
              }

              // Total for all units + addons
              const lineTotal = discountedUnitPrice * qty;
              const addonsTotal = handleTotalAmountWithAddons(0, cartItem?.selectedAddons);
              return getAmountWithSign(lineTotal + addonsTotal);
            })()}
          </Typography>
        </Stack>
        <CartIncrementStack>
          {cartItem?.quantity === 1 ? (
            <IconButton
              disabled={removeIsLoading}
              aria-label="delete"
              size="small"
              color="error"
              sx={{ padding: "2px", borderRadius: "2px" }}
              onClick={() => handleRemove()}
            >
              <DeleteIcon sx={{ width: "16px" }} />
            </IconButton>
          ) : (
            <IconButton
              aria-label="decrease"
              size="small"
              sx={{ padding: "2px", borderRadius: "2px" }}
              disabled={isLoading}
              onClick={() => handleDecrement()}
            >
              <RemoveIcon
                size="small"
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  width: "16px",
                }}
              />
            </IconButton>
          )}
          {isLoading ? (
            <Stack width="16px" height="18px">
              <Loading color={theme.palette.primary.main} />
            </Stack>
          ) : (
            <Typography fontSize="12px" fontWeight={600}>
              {cartItem?.quantity}
            </Typography>
          )}

          <IconButton
            aria-label="increase"
            sx={{ padding: "2px", borderRadius: "2px" }}
            disabled={isLoading}
            onClick={() => handleIncrement(cartItem)}
          >
            <AddIcon
              sx={{
                color: (theme) => theme.palette.primary.main,
                width: "16px",
              }}
              size="small"
            />
          </IconButton>
        </CartIncrementStack>
      </Box>
      {updateModalOpen && cartItem?.module_type === "food" ? (
        <FoodDetailModal
          open={updateModalOpen}
          product={{
            ...cartItem,
            cart_id: cartItem?.cartItemId,
            add_ons: cartItem?.addons,
          }}
          handleModalClose={() => setUpdateModalOpen(false)}
          imageBaseUrl={imageBaseUrl}
          productUpdate
        />
      ) : (
        <ModuleModal
          open={updateModalOpen}
          handleModalClose={() => setUpdateModalOpen(false)}
          configData={configData}
          productDetailsData={{
            ...cartItem,
            cart_id: cartItem?.cartItemId,
          }}
          productUpdate
        />
      )}
    </>
  );
};

CartContent.propTypes = {};

export default CartContent;
