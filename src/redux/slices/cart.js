import { createSlice } from "@reduxjs/toolkit";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getCartSkuKey } from "helper-functions/cartItemMatch";

const persistCartUnitPrice = (stateItem, payload, nextQty) => {
  const nextTotal = Number(payload?.totalPrice);
  const currentUnit = Number(
    stateItem?.itemBasePrice || stateItem?.price || stateItem?.unit_price || 0
  );
  const payloadPrice = Number(payload?.itemBasePrice || payload?.price);
  if (currentUnit > 0 && (nextQty <= 1 || Math.abs(currentUnit - nextTotal) > 0.01)) {
    return currentUnit;
  }
  if (payloadPrice > 0 && nextQty > 1 && nextTotal > 0 && Math.abs(payloadPrice - nextTotal) < 0.01) {
    return payloadPrice / nextQty;
  }
  if (
    payloadPrice > 0 &&
    nextQty > 1 &&
    currentUnit > 0 &&
    Math.abs(payloadPrice - currentUnit * nextQty) < 0.01
  ) {
    return currentUnit;
  }
  if (payloadPrice > 0) return payloadPrice;
  if (nextQty > 1 && nextTotal > 0) return nextTotal / nextQty;
  return currentUnit;
};

const initialCartMeta = {
  store_groups: [],
  total_delivery_charge: 0,
  grand_subtotal: null,
  grand_total: null,
  is_multi_store: false,
};

const saveCartToStorage = (cartList) => {
  if (typeof window !== "undefined") {
    try {
      if (Array.isArray(cartList)) {
        window.localStorage.setItem("cartList", JSON.stringify(cartList));
      }
    } catch (e) {}
  }
};

const getInitialCartList = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("cartList");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return [];
};

const initialState = {
  cartItem: null,
  cartList: getInitialCartList(),
  cartMeta: initialCartMeta,
  pendingCartQty: {},
  deliveryChargeRefreshing: false,
  campaignItemList: [],
  buyNowItemList: [],
  campaignItem: null,
  type: "regular",
  totalAmount: null,
  walletAmount: null,
};
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const PENDING_QTY_TTL_MS = 12000;

const getCartItemIds = (item) =>
  [item?.cartItemId, item?.id].filter((v) => v != null && v !== "").map(String);

const markPendingQty = (state, item, quantity) => {
  if (!state.pendingCartQty) state.pendingCartQty = {};
  const qty = Number(quantity);
  if (!item || !Number.isFinite(qty)) return;
  const entry = { qty, at: Date.now() };
  getCartItemIds(item).forEach((id) => {
    state.pendingCartQty[id] = entry;
  });
};

const getPendingQtyValue = (entry) => {
  if (entry == null) return null;
  if (typeof entry === "object") return Number(entry.qty);
  return Number(entry);
};

const isPendingQtyFresh = (entry) => {
  if (entry == null) return false;
  const at = typeof entry === "object" ? Number(entry.at) : 0;
  if (!at) return true;
  return Date.now() - at < PENDING_QTY_TTL_MS;
};

const mergeIncomingCartList = (incoming, localList, pending) => {
  if (!pending || Object.keys(pending).length === 0) {
    return { next: incoming, stillPending: pending || {} };
  }

  const stillPending = { ...pending };
  const localById = {};
  (Array.isArray(localList) ? localList : []).forEach((item) => {
    getCartItemIds(item).forEach((id) => {
      localById[id] = item;
    });
  });

  const next = incoming.map((item) => {
    const ids = getCartItemIds(item);
    const pendingKey = ids.find((id) => stillPending[id] != null);
    if (!pendingKey) return item;

    const pendingEntry = stillPending[pendingKey];
    if (!isPendingQtyFresh(pendingEntry)) {
      ids.forEach((id) => delete stillPending[id]);
      return item;
    }

    const pendingQty = getPendingQtyValue(pendingEntry);
    const apiQty = Number(item.quantity);
    if (apiQty === pendingQty) {
      return item;
    }

    const local = ids.map((id) => localById[id]).find(Boolean);
    if (local && Number(local.quantity) === pendingQty) {
      return {
        ...item,
        quantity: local.quantity,
        totalPrice: local.totalPrice,
        cartItemId: item.cartItemId || local.cartItemId,
      };
    }

    const unit = Number(item.itemBasePrice || item.price || 0);
    return {
      ...item,
      quantity: pendingQty,
      totalPrice: unit > 0 ? unit * pendingQty : item.totalPrice,
    };
  });

  return { next, stillPending };
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartList: (state = initialState, action) => {
      const incoming = action.payload;
      if (!Array.isArray(incoming)) {
        state.cartList = incoming;
        saveCartToStorage(state.cartList);
        return;
      }
      const { next, stillPending } = mergeIncomingCartList(
        incoming,
        state.cartList,
        state.pendingCartQty
      );
      state.pendingCartQty = stillPending;
      state.cartList = next;
      saveCartToStorage(state.cartList);
    },
    clearPendingCartQty: (state = initialState, action) => {
      const ids = action.payload;
      if (ids == null) {
        state.pendingCartQty = {};
        return;
      }
      const list = Array.isArray(ids) ? ids : [ids];
      list.filter((id) => id != null && id !== "").forEach((id) => {
        if (state.pendingCartQty) delete state.pendingCartQty[String(id)];
      });
    },
    setCartMeta: (state = initialState, action) => {
      state.cartMeta = {
        ...initialCartMeta,
        ...(action.payload || {}),
      };
      state.deliveryChargeRefreshing = false;
    },
    setDeliveryChargeRefreshing: (state = initialState, action) => {
      state.deliveryChargeRefreshing = Boolean(action.payload);
    },
    clearCartMeta: (state = initialState) => {
      state.cartMeta = initialCartMeta;
    },
    setCart: (state = initialState, action) => {
      const payload = action.payload;
      if (!payload) return;

      const payloadKey = getCartSkuKey(payload);
      const existingIndex = state.cartList?.findIndex(
        (item) => getCartSkuKey(item) === payloadKey
      );

      if (existingIndex !== -1 && existingIndex !== undefined && existingIndex !== null) {
        const currentItem = state.cartList[existingIndex];
        const isUpdateMode =
          Boolean(payload?.isUpdate) ||
          (Boolean(payload?.cartItemId) && Number(payload?.quantity) > Number(currentItem?.quantity || 0));

        // If same product with SAME variant already exists in cart
        if (isUpdateMode) {
          state.cartList[existingIndex] = {
            ...state.cartList[existingIndex],
            ...payload,
            quantity: payload.quantity,
            totalPrice: payload.totalPrice,
          };
          markPendingQty(state, state.cartList[existingIndex], payload.quantity);
        } else {
          // If adding again with same variant, update quantity and price
          const newQty = (currentItem.quantity || 0) + (payload.quantity || 1);
          const unitPrice = Number(payload.price || currentItem.price || 0);
          state.cartList[existingIndex] = {
            ...currentItem,
            ...payload,
            cartItemId: payload.cartItemId || currentItem.cartItemId,
            quantity: newQty,
            totalPrice: unitPrice > 0 ? unitPrice * newQty : (currentItem.totalPrice || 0) + (payload.totalPrice || 0),
          };
          markPendingQty(state, state.cartList[existingIndex], newQty);
        }
      } else {
        // If new product OR product with DIFFERENT variant -> add as new item entry!
        const nextItem = { ...payload };
        state.cartList = [...(state.cartList || []), nextItem];
        markPendingQty(state, nextItem, nextItem.quantity);
      }
      saveCartToStorage(state.cartList);
    },
    setVariationToCart: (state = initialState, action) => {
      let isAvailable = state.cartList.filter(
        (item) => item.id === action.payload.id
      );
      if (isAvailable.length > 0) {
        let isA = isAvailable.filter((item) =>
          item.variation.some(
            (va) =>
              JSON.stringify(va) === JSON.stringify(action.payload.variation[0])
          )
        );
        if (isA.length === 0) {
          state.cartList.push(action.payload);
        }
      }
    },
    setUpdateItemToCart: (state = initialState, action) => {
      let index = state.cartList.findIndex(
        (item) =>
          item.id === action.payload.id &&
          JSON.stringify(item?.selectedOption) ===
            JSON.stringify(action.payload?.selectedOption)
      );
      state.cartList = action.payload;
    },
    setUpdateVariationToCart: (state = initialState, action) => {
      if (action.payload.newObj.module_type === "food") {
        const index = state.cartList.findIndex(
          (item, index) => index === action.payload.indexNumber
        );
        const newData = state.cartList.map((item, i) =>
          i === index ? action.payload.newObj : item
        );
        state.cartList = newData;
      }
    },
    setIncrementToCartItem: (state = initialState, action) => {
      let newData;
      const targetId = action.payload?.cartItemId || action.payload?.id;
      if (getCurrentModuleType() === "food") {
        if (action.payload.food_variations?.length > 0) {
          let index = state.cartList.findIndex((item) =>
            isEqual(item.food_variations, action.payload.food_variations)
          );
          newData = state.cartList.map((item, i) =>
            i === index
              ? {
                  ...item,
                  totalPrice: action.payload.totalPrice,
                  quantity: action.payload.isUpdate
                    ? action.payload.quantity
                    : (item.quantity || 0) + (action.payload.quantity || 1),
                }
              : item
          );
        } else {
          newData = state.cartList.map((item) =>
            String(item?.cartItemId || item?.id) === String(targetId) ||
            String(item?.id) === String(action.payload?.id)
              ? {
                  ...item,
                  totalPrice: action.payload.totalPrice,
                  quantity: action.payload.isUpdate
                    ? action.payload.quantity
                    : (item.quantity || 0) + (action.payload.quantity || 1),
                }
              : item
          );
        }
      } else {
        newData = state.cartList.map((stateItem) => {
          const isItemMatch =
            (targetId && String(stateItem?.cartItemId || stateItem?.id) === String(targetId)) ||
            (stateItem?.id && action.payload?.id && String(stateItem.id) === String(action.payload.id));
          if (isItemMatch) {
            const nextQty = action.payload.isUpdate
              ? action.payload.quantity
              : (stateItem.quantity || 0) + (action.payload.quantity || 1);
            const unit = persistCartUnitPrice(stateItem, action.payload, nextQty);
            return {
              ...stateItem,
              ...action.payload,
              price: unit,
              itemBasePrice: unit,
              quantity: nextQty,
              totalPrice: action.payload.totalPrice ?? unit * nextQty,
            };
          } else {
            return stateItem;
          }
        });
      }
      state.cartList = newData;
      const updatedItem =
        newData?.find(
          (item) =>
            String(item?.cartItemId || item?.id) === String(targetId) ||
            String(item?.id) === String(action.payload?.id)
        ) || action.payload;
      markPendingQty(state, updatedItem, updatedItem?.quantity);
      saveCartToStorage(state.cartList);
    },
    setDecrementToCartItem: (state = initialState, action) => {
      let newData;
      const targetId = action.payload?.cartItemId || action.payload?.id;
      if (getCurrentModuleType() === "food") {
        if (action.payload.food_variations?.length > 0) {
          let index = state.cartList.findIndex((item) =>
            isEqual(item.food_variations, action.payload.food_variations)
          );

          newData = state.cartList.map((item, i) =>
            i === index
              ? {
                  ...item,
                  totalPrice: action.payload.totalPrice,
                  quantity: action.payload.quantity,
                }
              : item
          );
        } else {
          newData = state.cartList.map((item) =>
            String(item?.cartItemId || item?.id) === String(targetId) ||
            String(item?.id) === String(action.payload?.id)
              ? {
                  ...item,
                  totalPrice: action.payload.totalPrice,
                  quantity: action.payload.quantity,
                }
              : item
          );
        }
      } else {
        newData = state.cartList.map((stateItem) => {
          const isItemMatch =
            (targetId && String(stateItem?.cartItemId || stateItem?.id) === String(targetId)) ||
            (stateItem?.id && action.payload?.id && String(stateItem.id) === String(action.payload.id));
          if (isItemMatch) {
            const nextQty = action.payload.quantity;
            const unit = persistCartUnitPrice(stateItem, action.payload, nextQty);
            return {
              ...stateItem,
              ...action.payload,
              price: unit,
              itemBasePrice: unit,
              quantity: nextQty,
              totalPrice: action.payload.totalPrice ?? unit * nextQty,
            };
          } else {
            return stateItem;
          }
        });
      }
      state.cartList = newData;
      const updatedItem =
        newData?.find(
          (item) =>
            String(item?.cartItemId || item?.id) === String(targetId) ||
            String(item?.id) === String(action.payload?.id)
        ) || action.payload;
      markPendingQty(state, updatedItem, updatedItem?.quantity);
      saveCartToStorage(state.cartList);
    },
    setRemoveItemFromCart: (state = initialState, action) => {
      state.cartList = state.cartList.filter((cartItem) =>
        cartItem.module_type === action.payload.module_type
          ? String(cartItem?.id) === String(action.payload?.id)
            ? JSON.stringify(cartItem?.selectedOption || []) !==
              JSON.stringify(action.payload?.selectedOption || [])
            : true
          : true
      );
      saveCartToStorage(state.cartList);
    },
    setCampaignItemList: (state = initialState, action) => {
      state.campaignItemList = [action.payload];
    },
    setBuyNowItemList: (state = initialState, action) => {
      state.buyNowItemList = [action.payload];
    },
    setCampaignItem: (state = initialState, action) => {
      state.campaignItem = action.payload;
    },
    setClearCart: (state = initialState, action) => {
      const currentModule = getCurrentModuleType();
      if (Array.isArray(state.cartList)) {
        state.cartList = state.cartList.filter(
          (item) => item?.module_type !== currentModule
        );
      } else {
        console.error("cartList is not an array", state.cartList);
        state.cartList = []; // Reset to an empty array if invalid
      }
      state.cartMeta = initialCartMeta;
      state.pendingCartQty = {};
      saveCartToStorage(state.cartList);
    },
    resetEntireCart: (state) => {
      state.cartList = [];
      state.cartMeta = initialCartMeta;
      state.pendingCartQty = {};
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("cartList");
        } catch (e) {}
      }
    },

    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    setWalletAmount: (state, action) => {
      state.walletAmount = action.payload;
    },
  },
});
export const {
  cart,
  setCartList,
  setCartMeta,
  setDeliveryChargeRefreshing,
  clearCartMeta,
  clearPendingCartQty,
  setCart,
  setUpdateItemToCart,
  setVariationToCart,
  setCampaignItemList,
  setBuyNowItemList,
  setCampaignItem,
  setClearCart,
  resetEntireCart,
  setIncrementToCartItem,
  setDecrementToCartItem,
  setRemoveItemFromCart,
  setUpdateVariationToCart,
  setTotalAmount,
  setWalletAmount,
} = cartSlice.actions;
export default cartSlice.reducer;
