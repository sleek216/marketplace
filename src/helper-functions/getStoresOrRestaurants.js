import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

export const getStoresOrRestaurants = () => {
  const moduleType = getCurrentModuleType();

  if (moduleType === ModuleTypes.FOOD) {
    return t("Restaurants");
  } else if (moduleType === ModuleTypes.RENTAL) {
    return t("Providers");
  } else {
    return t("Stores");
  }
};

/** Fixed module-home section title (not the total store count). */
export const getModuleStoreSectionTitle = () => {
  const moduleType = getCurrentModuleType();

  switch (moduleType) {
    case ModuleTypes.FOOD:
      return t("Restaurants");
    case ModuleTypes.GROCERY:
      return t("Grocery Stores");
    case ModuleTypes.PHARMACY:
      return t("Pharmacy Stores");
    case ModuleTypes.ECOMMERCE:
      return t("Stores");
    case ModuleTypes.RENTAL:
      return t("Providers");
    default:
      return t("Stores");
  }
};
