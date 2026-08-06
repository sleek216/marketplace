import { createSlice } from "@reduxjs/toolkit";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

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
  campaignItemList: [],
  buyNowItemList: [],
  campaignItem: null,
  type: "regular",
  totalAmount: null,
  walletAmount: null,
};
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartList: (state = initialState, action) => {
      state.cartList = action.payload;
      saveCartToStorage(state.cartList);
    },
    setCartMeta: (state = initialState, action) => {
      state.cartMeta = {
        ...initialCartMeta,
        ...(action.payload || {}),
      };
    },
    clearCartMeta: (state = initialState) => {
      state.cartMeta = initialCartMeta;
    },
    setCart: (state = initialState, action) => {
      const payload = action.payload;
      if (!payload) return;
      const isFood = payload?.module_type === "food" || payload?.module?.module_type === "food";
      
      const getVariantsString = (item) => {
        if (isFood) {
          const foodVars = item?.food_variations;
          if (!foodVars || (Array.isArray(foodVars) && foodVars.length === 0)) return "";
          return JSON.stringify(foodVars);
        }
        const opts = item?.selectedOption || item?.variation || item?.variations;
        if (!opts || (Array.isArray(opts) && opts.length === 0)) return "";
        return JSON.stringify(opts);
      };

      const payloadVarStr = getVariantsString(payload);
      const existingIndex = state.cartList?.findIndex(
        (item) => String(item?.id) === String(payload?.id) && getVariantsString(item) === payloadVarStr
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
        }
      } else {
        // If new product OR product with DIFFERENT variant -> add as new item entry!
        state.cartList = [...(state.cartList || []), { ...payload }];
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
          if (
            String(stateItem?.id) === String(action.payload?.id) &&
            JSON.stringify(stateItem?.selectedOption || []) ===
              JSON.stringify(action.payload?.selectedOption || [])
          ) {
            return {
              ...action.payload,
              price: action.payload.price,
              quantity: action.payload.isUpdate
                ? action.payload.quantity
                : (stateItem.quantity || 0) + (action.payload.quantity || 1),
              totalPrice: action.payload.totalPrice,
            };
          } else {
            return stateItem;
          }
        });
      }
      state.cartList = newData;
    },
    setDecrementToCartItem: (state = initialState, action) => {
      let newData;
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
          if (
            String(stateItem?.id) === String(action.payload?.id) &&
            JSON.stringify(stateItem?.selectedOption || []) ===
              JSON.stringify(action.payload?.selectedOption || [])
          ) {
            return {
              ...action.payload,
              price: action.payload.price,
              quantity: action.payload.quantity,
              totalPrice: action.payload.totalPrice,
            };
          } else {
            return stateItem;
          }
        });
      }

      state.cartList = newData;
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
      saveCartToStorage(state.cartList);
    },
    resetEntireCart: (state) => {
      state.cartList = [];
      state.cartMeta = initialCartMeta;
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
  clearCartMeta,
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
