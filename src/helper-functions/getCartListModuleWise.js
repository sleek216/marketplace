import { getCurrentModuleId, getCurrentModuleType } from "helper-functions/getCurrentModuleType";

/**
 * Returns the cart items for the currently selected module.
 * Falls back to the full list only when no module is selected yet.
 */
export const getCartListModuleWise = (cartList) => {
  if (!Array.isArray(cartList)) return [];

  const currentModuleType = getCurrentModuleType();
  const currentModuleId = getCurrentModuleId();

  if (!currentModuleType && !currentModuleId) {
    return cartList;
  }

  return cartList.filter((item) => {
    const itemModuleType = item?.module_type || item?.module?.module_type;
    const itemModuleId = item?.module_id || item?.module?.id;

    if (currentModuleId != null && String(itemModuleId) === String(currentModuleId)) {
      return true;
    }

    if (currentModuleType && itemModuleType === currentModuleType) {
      return true;
    }

    return false;
  });
};

/** module_id for add/update/delete when the active sidebar module differs. */
export const resolveCartItemModuleId = (item) =>
  item?.module_id ||
  item?.module?.id ||
  item?.item?.module_id ||
  item?.item?.module?.id ||
  undefined;
