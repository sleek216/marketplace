/** Helpers to keep recently viewed scoped to the active module. */

export const getItemModuleType = (item) =>
  item?.module?.module_type || item?.module_type || null;

export const getItemModuleId = (item) =>
  item?.module_id || item?.module?.id || null;

export const itemBelongsToModule = (item, moduleType, moduleId) => {
  if (!item) return false;

  const itemType = getItemModuleType(item);
  const itemId = getItemModuleId(item);

  if (moduleType && itemType && itemType !== moduleType) {
    return false;
  }
  if (moduleId && itemId && Number(itemId) !== Number(moduleId)) {
    return false;
  }

  return true;
};

export const filterHistoriesForModule = (histories, moduleType) => {
  if (!Array.isArray(histories)) return [];
  if (!moduleType) return histories;
  return histories.filter((entry) => !entry?.module || entry.module === moduleType);
};
