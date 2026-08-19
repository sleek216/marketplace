import { handleProductValueWithOutDiscount, coerceToUnitPrice, getTotalVariationsPrice } from "utils/CustomFunctions";
import { getCurrentModuleId, getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { applySelectedFoodVariations } from "helper-functions/cartItemMatch";

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
  cartRow?.module?.module_type ||
  getCurrentModuleType();

const resolveCartRowModuleId = (cartRow, product) =>
  product?.module_id ||
  product?.module?.id ||
  cartRow?.module_id ||
  cartRow?.module?.id ||
  getCurrentModuleId();

const resolveSelectedAddons = (cartRow, product) => {
  if (Array.isArray(cartRow?.add_ons) && cartRow.add_ons.length > 0) {
    return cartRow.add_ons;
  }
  const ids = cartRow?.add_on_ids;
  const qtys = cartRow?.add_on_qtys;
  const catalog = Array.isArray(product?.addons) ? product.addons : [];
  if (Array.isArray(ids) && ids.length > 0) {
    return ids.map((id, index) => {
      const found = catalog.find((addon) => String(addon?.id) === String(id));
      const quantity = Number(qtys?.[index]) || 1;
      return found
        ? { ...found, quantity }
        : { id, quantity, price: 0 };
    });
  }
  return [];
};

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
      selection_applied: false,
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
    selection_applied: Boolean(res.selection_applied),
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
    const foodVariations = isFood
      ? applySelectedFoodVariations(product?.food_variations, cartRow?.variation)
      : product?.food_variations;
    const selectedOption = isFood
      ? getSelectedVariations(foodVariations)
      : getOtherModuleVariation(product?.variations, cartRow?.variation);

    const qty = Number(cartRow?.quantity) || 1;
    const catalogUnit = Number(product?.price || product?.unit_price || 0);
    let rowUnitPrice =
      coerceToUnitPrice(
        Number(cartRow?.price) > 0
          ? Number(cartRow.price)
          : handleProductValueWithOutDiscount({
              ...product,
              selectedOption,
            }),
        qty,
        { unit_price: catalogUnit, catalogPrice: catalogUnit }
      ) || catalogUnit;

    if (isFood && foodVariations?.length > 0) {
      const variationExtra = getTotalVariationsPrice(foodVariations);
      if (variationExtra > 0 && catalogUnit > 0) {
        const expectedFull = catalogUnit + variationExtra;
        if (rowUnitPrice < expectedFull - 0.01) {
          rowUnitPrice = expectedFull;
        }
      }
    }

    return {
      ...product,
      store_id: cartRow?.store_id || product?.store_id,
      store_name: cartRow?.store_name || product?.store_name,
      delivery_charge: cartRow?.delivery_charge ?? product?.delivery_charge,
      minimum_shipping_charge: cartRow?.minimum_shipping_charge ?? product?.minimum_shipping_charge,
      minimum_delivery_charge: cartRow?.minimum_delivery_charge ?? product?.minimum_delivery_charge,
      free_delivery: cartRow?.free_delivery ?? product?.free_delivery,
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
      is_selected: cartRow?.is_selected !== undefined ? Boolean(cartRow.is_selected) : true,
      price: rowUnitPrice,
      unit_price: catalogUnit || rowUnitPrice,
      totalPrice: rowUnitPrice * qty,
      variation: cartRow?.variation,
      selectedAddons: resolveSelectedAddons(cartRow, product),
      quantity: qty,
      food_variations: foodVariations,
      itemBasePrice: rowUnitPrice,
      selectedOption,
    };
  });
};

export const getCustomerLatLng = () => {
  if (typeof window === "undefined") return { lat: null, lng: null };
  try {
    const rawCurrent = localStorage.getItem("currentLatLng");
    const rawLoc = localStorage.getItem("location");
    const loc = rawCurrent ? JSON.parse(rawCurrent) : rawLoc ? JSON.parse(rawLoc) : null;
    const lat = loc?.lat ?? loc?.latitude ?? null;
    const lng = loc?.lng ?? loc?.longitude ?? null;
    return { lat, lng };
  } catch {
    return { lat, lng };
  }
};
