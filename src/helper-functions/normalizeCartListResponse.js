import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";

const getSelectedVariations = (variations) => {
  const selectedItem = [];
  if (variations?.length > 0) {
    variations?.forEach((item, index) => {
      item?.values?.forEach((value, optionIndex) => {
        if (value?.isSelected) {
          selectedItem.push({
            choiceIndex: index,
            isSelected: value?.isSelected,
            label: value?.label,
            optionIndex,
            optionPrice: value?.optionPrice,
          });
        }
      });
    });
  }
  return selectedItem;
};

const getOtherModuleVariation = (itemVariations, selectedVariation) => {
  const selectedItem = [];
  itemVariations?.forEach((item) => {
    selectedVariation?.forEach((sVari) => {
      if (sVari?.type === item?.type) {
        selectedItem.push(item);
      }
    });
  });
  return selectedItem;
};

const resolveCartRowModuleType = (cartRow, product) =>
  product?.module_type ||
  product?.module?.module_type ||
  cartRow?.module_type ||
  cartRow?.module?.module_type;

const resolveCartRowModuleId = (cartRow, product) =>
  product?.module_id ||
  product?.module?.id ||
  cartRow?.module_id ||
  cartRow?.module?.id;

/**
 * Cart list API may return a flat array (legacy) or a grouped payload:
 * { carts, store_groups, total_delivery_charge, grand_subtotal, grand_total, is_multi_store }
 */
export const getCartsFromResponse = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.carts)) return res.carts;
  return [];
};

export const getCartMetaFromResponse = (res) => {
  if (!res || Array.isArray(res)) {
    return {
      store_groups: [],
      total_delivery_charge: 0,
      grand_subtotal: null,
      grand_total: null,
      is_multi_store: false,
    };
  }

  return {
    store_groups: Array.isArray(res.store_groups) ? res.store_groups : [],
    total_delivery_charge: Number(res.total_delivery_charge) || 0,
    grand_subtotal:
      res.grand_subtotal === null || res.grand_subtotal === undefined
        ? null
        : Number(res.grand_subtotal),
    grand_total:
      res.grand_total === null || res.grand_total === undefined
        ? null
        : Number(res.grand_total),
    is_multi_store: Boolean(res.is_multi_store),
  };
};

/** Map GET /cart rows to Redux cart items (all modules, preserves module_id). */
export const mapApiCartRowsToReduxItems = (carts) => {
  if (!Array.isArray(carts)) return [];

  return carts.map((cartRow) => {
    const product = cartRow?.item || {};
    const moduleType = resolveCartRowModuleType(cartRow, product);
    const moduleId = resolveCartRowModuleId(cartRow, product);
    const isFood = moduleType === "food";
    const selectedOption = isFood
      ? getSelectedVariations(product?.food_variations)
      : getOtherModuleVariation(product?.variations, cartRow?.variation);

    return {
      ...product,
      module_id: moduleId ?? product?.module_id,
      module_type: moduleType ?? product?.module_type,
      module:
        typeof product?.module === "object" && product?.module
          ? {
              ...product.module,
              id: product.module.id ?? moduleId,
              module_type: product.module.module_type ?? moduleType,
            }
          : moduleId || moduleType
            ? {
                id: moduleId,
                module_type: moduleType,
                module_name: product?.module_name,
              }
            : product?.module,
      cartItemId: cartRow?.id,
      totalPrice:
        handleProductValueWithOutDiscount({
          ...product,
          selectedOption,
        }) * cartRow?.quantity,
      selectedAddons: product?.addons,
      quantity: cartRow?.quantity,
      food_variations: product?.food_variations,
      itemBasePrice: product?.price,
      selectedOption,
    };
  });
};

export const getCustomerLatLng = () => {
  if (typeof window === "undefined") return { lat: null, lng: null };
  try {
    const loc = JSON.parse(localStorage.getItem("currentLatLng"));
    const lat = loc?.lat ?? loc?.latitude ?? null;
    const lng = loc?.lng ?? loc?.longitude ?? null;
    return { lat, lng };
  } catch {
    return { lat: null, lng: null };
  }
};
