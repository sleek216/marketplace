/**
 * Unified marketplace cart — all modules and stores in one list.
 * (Previously filtered to the active module only.)
 */
export const getCartListModuleWise = (cartList) => {
  if (!Array.isArray(cartList)) return [];
  return cartList;
};

/** module_id for add/update/delete when the active sidebar module differs. */
export const resolveCartItemModuleId = (item) =>
  item?.module_id ||
  item?.module?.id ||
  item?.item?.module_id ||
  item?.item?.module?.id ||
  undefined;
