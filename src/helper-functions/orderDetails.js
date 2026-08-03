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
