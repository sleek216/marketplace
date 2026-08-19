/** Order details API may return a line-item array or an object with details/items. */
export const getOrderDetailsMeta = (data) =>
  Array.isArray(data) ? null : data ?? null;

export const getOrderDetailsLineItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const items = data.details ?? data.items ?? [];
  return Array.isArray(items) ? items : [];
};

export const getOrderDetailsModuleType = (data, trackOrderData) =>
  getOrderDetailsMeta(data)?.module_type ?? trackOrderData?.module_type;

const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

const isUsableVariationText = (value) => {
  if (value == null) return false;
  const text = String(value).trim().toLowerCase();
  return Boolean(text) && text !== "null" && text !== "undefined" && text !== "nan";
};

const asList = (value) => {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.filter((item) => item != null);
  if (typeof value === "object") return [value];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!isUsableVariationText(trimmed)) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed == null) return [];
      if (Array.isArray(parsed)) return parsed.filter((item) => item != null);
      if (typeof parsed === "object") return [parsed];
      if (isUsableVariationText(parsed)) return [{ type: String(parsed) }];
    } catch (_) {
      return [{ type: trimmed }];
    }
  }
  return [];
};

const collectLabels = (raw) => {
  if (!isUsableVariationText(raw) && (raw == null || typeof raw !== "object")) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => collectLabels(item)).filter(isUsableVariationText);
  }
  if (typeof raw === "object") {
    return [raw.label, raw.name, raw.type, raw.value]
      .filter(isUsableVariationText)
      .map((part) => String(part).trim());
  }
  return [String(raw).trim()].filter(isUsableVariationText);
};

/** Selected variant labels from an order line (ecommerce + food). */
export const getOrderItemVariationLabels = (product) => {
  const details = product?.item_details || {};
  const labels = [];
  const push = (name, value) => {
    if (!isUsableVariationText(value)) return;
    const text = String(value).trim();
    const key = text.toLowerCase();
    const optionName = isUsableVariationText(name) ? String(name).trim() : "";
    if (labels.some((row) => row.value.toLowerCase() === key && (!optionName || row.name === optionName))) {
      return;
    }
    labels.push({ name: optionName, value: text });
  };

  const variations = asList(product?.variation);
  const choiceOptions = details?.choice_options || product?.choice_options || [];
  variations.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      push("", entry);
      return;
    }
    if (isUsableVariationText(entry.type) && choiceOptions.length > 0) {
      const parts = String(entry.type).split("-");
      choiceOptions.forEach((option, index) => {
        push(option?.title || option?.name, parts[index] || (index === 0 ? entry.type : ""));
      });
      return;
    }
    if (isUsableVariationText(entry.type)) {
      push(entry.name || entry.title, entry.type);
      return;
    }
    const selectedValues = asList(entry.values).filter(
      (item) => item && typeof item === "object" && item.isSelected
    );
    if (selectedValues.length > 0) {
      selectedValues.forEach((item) =>
        push(entry.name, item.label || item.name || item.type)
      );
      return;
    }
    const fromLabel = collectLabels(entry.values?.label);
    if (fromLabel.length > 0) {
      fromLabel.forEach((value) => push(entry.name, value));
    }
  });

  if (isUsableVariationText(product?.variant)) {
    String(product.variant)
      .split(",")
      .forEach((part) => push("", part));
  }

  const foodVariations = details?.food_variations || product?.food_variations || [];
  asList(foodVariations).forEach((group) => {
    asList(group?.values)
      .filter((item) => item?.isSelected)
      .forEach((item) => push(group?.name, item?.label || item?.name));
  });

  return labels;
};

/** Per-unit base, discount, and charged price for an order line. */
export const getOrderItemPriceParts = (product) => {
  const details = product?.item_details || {};
  const variationPrice = Number(asList(product?.variation)?.[0]?.price);
  const catalogPrice = Number(details.price);
  const chargedUnit = Number(product?.price);
  const baseUnit = roundMoney(
    Number.isFinite(variationPrice) && variationPrice > 0
      ? variationPrice
      : Number.isFinite(catalogPrice) && catalogPrice > 0
        ? catalogPrice
        : chargedUnit
  );

  const discountType = product?.discount_type || details.discount_type;
  const discountOnItem = Number(product?.discount_on_item);
  const catalogDiscount = Number(details.discount);
  let discountPerUnit = 0;
  if (Number.isFinite(discountOnItem) && discountOnItem > 0) {
    discountPerUnit = discountOnItem;
  } else if (Number.isFinite(catalogDiscount) && catalogDiscount > 0) {
    discountPerUnit =
      discountType === "percent"
        ? (catalogDiscount / 100) * baseUnit
        : catalogDiscount;
  } else if (
    Number.isFinite(baseUnit) &&
    Number.isFinite(chargedUnit) &&
    baseUnit > chargedUnit
  ) {
    discountPerUnit = baseUnit - chargedUnit;
  }
  discountPerUnit = roundMoney(Math.max(0, discountPerUnit));

  let finalUnit;
  if (discountPerUnit > 0) {
    if (
      Number.isFinite(chargedUnit) &&
      chargedUnit >= 0 &&
      roundMoney(chargedUnit) < baseUnit
    ) {
      finalUnit = chargedUnit;
    } else {
      finalUnit = Math.max(0, baseUnit - discountPerUnit);
    }
  } else {
    finalUnit =
      Number.isFinite(chargedUnit) && chargedUnit > 0 ? chargedUnit : baseUnit;
  }

  return {
    baseUnit,
    discountPerUnit,
    finalUnit: roundMoney(finalUnit),
    isPercent: discountType === "percent",
    discountPercent:
      discountType === "percent" && Number.isFinite(catalogDiscount)
        ? catalogDiscount
        : 0,
  };
};
