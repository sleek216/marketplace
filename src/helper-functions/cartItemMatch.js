/**
 * Daraz-style cart SKU: same product + same variant + same addons → one line.
 * Used by every module (food, grocery, ecommerce, pharmacy, etc).
 */

const norm = (value) => String(value ?? "").trim().toLowerCase();

const toLabelList = (value) => {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.map((v) => norm(v)).filter(Boolean).sort();
  if (typeof value === "object") {
    if (Array.isArray(value.label)) return toLabelList(value.label);
    if (value.label) return [norm(value.label)];
  }
  return [norm(value)];
};

export const getCartProductId = (item) =>
  String(item?.id || item?.item?.id || item?.item_id || "");

const getCartModuleId = (item) =>
  String(item?.module_id || item?.module?.id || item?.item?.module_id || "");

const getCartModuleType = (item) =>
  item?.module_type ||
  item?.module?.module_type ||
  item?.item?.module_type ||
  "";

const isFoodCartItem = (item) =>
  getCartModuleType(item) === "food" ||
  Boolean(item?.food_variations?.length || item?.item?.food_variations?.length);

const foodVariationKey = (item) => {
  const vars = item?.food_variations || item?.item?.food_variations;
  if (Array.isArray(vars) && vars.length > 0) {
    const fromFlags = vars
      .map((group) => {
        const labels = (group?.values || [])
          .filter((val) => val?.isSelected)
          .map((val) => norm(val?.label))
          .filter(Boolean)
          .sort()
          .join(",");
        return labels ? `${norm(group?.name)}:${labels}` : "";
      })
      .filter(Boolean)
      .sort()
      .join("|");
    if (fromFlags) return fromFlags;
  }

  const selected = item?.selectedOption || item?.selectedOptions;
  if (Array.isArray(selected) && selected.length > 0) {
    const fromSelected = selected
      .filter((opt) => opt?.label || opt?.isSelected)
      .map((opt) => {
        const name = norm(opt?.name || opt?.choiceIndex);
        const label = norm(opt?.label);
        return label ? `${name}:${label}` : "";
      })
      .filter(Boolean)
      .sort()
      .join("|");
    if (fromSelected) return fromSelected;
  }

  const variation = item?.variation;
  if (Array.isArray(variation) && variation.length > 0) {
    const fromRow = variation
      .map((group) => {
        const labels = toLabelList(group?.values?.label ?? group?.values ?? group?.label).join(",");
        return labels ? `${norm(group?.name)}:${labels}` : "";
      })
      .filter(Boolean)
      .sort()
      .join("|");
    if (fromRow) return fromRow;
  }

  return "";
};

const otherModuleVariationKey = (item) => {
  const opts = item?.selectedOption || item?.variation || item?.variations || [];
  if (!Array.isArray(opts) || opts.length === 0) return "";
  return opts
    .map((opt) => {
      if (opt == null) return "";
      if (typeof opt !== "object") return norm(opt);
      const name = norm(opt.type || opt.name || "");
      const label = norm(opt.label || opt.value || opt.option || opt.type || "");
      return label || name ? `${name}:${label}` : "";
    })
    .filter(Boolean)
    .sort()
    .join("|");
};

const addonKey = (item) => {
  const addons = item?.selectedAddons || item?.addons || item?.item?.addons || [];
  if (!Array.isArray(addons)) return "";
  return addons
    .filter((addon) => addon?.isChecked || Number(addon?.quantity) > 0)
    .map((addon) => `${addon.id || addon.name}:${addon.quantity || 1}`)
    .sort()
    .join("|");
};

export const getCartSkuKey = (item) => {
  if (!item) return "";
  const productId = getCartProductId(item);
  if (!productId) return `row:${item?.cartItemId || ""}`;
  const variantKey = isFoodCartItem(item)
    ? foodVariationKey(item)
    : otherModuleVariationKey(item);
  return [getCartModuleId(item), productId, variantKey, addonKey(item)].join("::");
};

export const findMatchingCartItem = (cartList, candidate) => {
  if (!Array.isArray(cartList) || !candidate) return null;
  const key = getCartSkuKey(candidate);
  if (!key) return null;
  return cartList.find((item) => getCartSkuKey(item) === key) || null;
};

export const applySelectedFoodVariations = (foodVariations, cartVariation) => {
  if (!Array.isArray(foodVariations) || foodVariations.length === 0) {
    return foodVariations || [];
  }

  const selectedByName = new Map();
  if (Array.isArray(cartVariation)) {
    cartVariation.forEach((group) => {
      const name = norm(group?.name);
      const labels = toLabelList(group?.values?.label ?? group?.values ?? group?.label);
      if (name) selectedByName.set(name, new Set(labels));
    });
  }

  const hasCartSelection = selectedByName.size > 0;

  return foodVariations.map((group) => {
    const selected = selectedByName.get(norm(group?.name));
    return {
      ...group,
      values: (group?.values || []).map((val) => ({
        ...val,
        isSelected: hasCartSelection
          ? Boolean(selected?.has(norm(val?.label)))
          : Boolean(val?.isSelected),
      })),
    };
  });
};
