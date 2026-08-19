import React, { useState } from "react";
import { alpha, Box, Checkbox, Typography } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import {
  getAmountWithSign,
} from "helper-functions/CardHelpers";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
  setDeliveryChargeRefreshing,
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
import { getCartItemDiscountedUnitPrice, getCartItemUnitPrice } from "utils/CustomFunctions";

const CartContent = (props) => {
  const { cartItem, imageBaseUrl, isSelected, onToggleSelect, refetch } = props;
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const guestId = localStorage.getItem("guest_id");
  const { mutate, isLoading: removeIsLoading } = useDeleteCartItem();
  const { mutate: updateMutate } = useCartItemUpdate();
  const updateTimerRef = React.useRef(null);
  const deliveryRefetchTimerRef = React.useRef(null);
  const latestRequestVersionRef = React.useRef(0);
  const rollbackItemRef = React.useRef(null);
  const latestQtyRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      if (deliveryRefetchTimerRef.current) {
        clearTimeout(deliveryRefetchTimerRef.current);
      }
    };
  }, []);

  const refreshDeliveryFromCartApi = () => {
    if (deliveryRefetchTimerRef.current) {
      clearTimeout(deliveryRefetchTimerRef.current);
    }
    deliveryRefetchTimerRef.current = setTimeout(() => {
      refetch?.();
    }, 0);
  };

  const cartUpdateHandleSuccess = (res) => {
    if (!res) {
      refetch?.();
      return;
    }
    refreshDeliveryFromCartApi();
    const carts = getCartsFromResponse(res);
    if (!Array.isArray(carts) || carts.length === 0) return;

    const mapped = mapApiCartRowsToReduxItems(carts);
    const currentId = String(cartItem?.cartItemId || cartItem?.id);
    const matched = mapped.find(
      (row) =>
        String(row?.cartItemId) === currentId ||
        String(row?.id) === String(cartItem?.id)
    );
    if (!matched?.cartItemId) return;
    if (String(matched.cartItemId) === currentId) return;

    const quantity = latestQtyRef.current ?? cartItem?.quantity;
    const unitPrice = getSingleUnitPrice(cartItem);
    dispatch(
      setIncrementToCartItem({
        ...cartItem,
        cartItemId: matched.cartItemId,
        quantity,
        totalPrice: unitPrice > 0 ? unitPrice * Number(quantity) : cartItem?.totalPrice,
        isUpdate: true,
      })
    );
  };

  /**
   * Resolve the authoritative per-unit price for a cart item (includes food variations).
   */
  const getSingleUnitPrice = (item) => getCartItemUnitPrice(item);

  /**
   * Sync quantity change to backend.
   * IMPORTANT: API POST /cart/update-quantity expects `price` = UNIT price (not total).
   * cartRow.price in GET response is also unit price — they must match.
   */
  const syncQuantityWithApi = (targetItem, targetQuantity, targetTotalPrice, targetUnitPrice) => {
    latestQtyRef.current = targetQuantity;
    latestRequestVersionRef.current += 1;
    const currentVersion = latestRequestVersionRef.current;

    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
    }

    updateTimerRef.current = setTimeout(() => {
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
          if (currentVersion !== latestRequestVersionRef.current) return;
          if (rollbackItemRef.current) {
            latestQtyRef.current = rollbackItemRef.current.quantity;
            dispatch(
              setIncrementToCartItem({
                ...rollbackItemRef.current,
                isUpdate: true,
              })
            );
          }
          dispatch(setDeliveryChargeRefreshing(false));
          onErrorResponse(err);
        },
      });
    }, 120);
  };

  const handleIncrement = (cartItem) => {
    const updateQuantity = (cartItem?.quantity || 1) + 1;
    const unitPrice = getCartItemUnitPrice(cartItem) || getSingleUnitPrice(cartItem);
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

    rollbackItemRef.current = {
      ...cartItem,
      quantity: cartItem?.quantity,
      totalPrice: cartItem?.totalPrice,
    };

    const product = {
      ...cartItem,
      price: unitPrice,
      itemBasePrice: unitPrice,
      totalPrice: mainPrice,
      quantity: updateQuantity,
    };
    dispatch(setDeliveryChargeRefreshing(true));
    dispatch(setIncrementToCartItem({ ...product, isUpdate: true }));
    syncQuantityWithApi(cartItem, updateQuantity, mainPrice, unitPrice);
  };

  const handleDecrement = () => {
    const updateQuantity = cartItem?.quantity - 1;
    if (updateQuantity < 1) return;
    const unitPrice = getCartItemUnitPrice(cartItem) || getSingleUnitPrice(cartItem);
    const mainPrice = unitPrice * updateQuantity;

    rollbackItemRef.current = {
      ...cartItem,
      quantity: cartItem?.quantity,
      totalPrice: cartItem?.totalPrice,
    };

    const decProduct = {
      ...cartItem,
      price: unitPrice,
      itemBasePrice: unitPrice,
      totalPrice: mainPrice,
      quantity: updateQuantity,
    };
    dispatch(setDeliveryChargeRefreshing(true));
    dispatch(setDecrementToCartItem({ ...decProduct, isUpdate: true }));
    syncQuantityWithApi(cartItem, updateQuantity, mainPrice, unitPrice);
  };

  const handleSuccess = () => {
    toast.success(t(cart_item_remove));
  };
  const handleRemove = () => {
    dispatch(setRemoveItemFromCart(cartItem));
    const cartIdAndGuestId = {
      cart_id: cartItem?.cartItemId,
      guestId: guestId,
      moduleIdOverride: resolveCartItemModuleId(cartItem),
    };
    mutate(cartIdAndGuestId, {
      onSuccess: handleSuccess,
      onError: (err) => {
        refetch?.();
        onErrorResponse(err);
      },
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
          <Typography
            fontWeight={500}
            fontSize="12px"
            color="text.secondary"
            lineHeight={1.3}
            sx={{ mt: 0.15 }}
          >
            {getAmountWithSign(getCartItemDiscountedUnitPrice(cartItem))}
            {" × "}
            {cartItem?.quantity || 1}
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
          <Typography fontSize="12px" fontWeight={600} minWidth="14px" textAlign="center">
            {cartItem?.quantity}
          </Typography>

          <IconButton
            aria-label="increase"
            sx={{ padding: "2px", borderRadius: "2px" }}
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
