import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import LandingProductCard from "components/landing-page/LandingProductCard";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const readStoredModule = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("module") || "null");
  } catch {
    return null;
  }
};

/**
 * Exact landing-page product card for module homes
 * (same UI as landing Recently Viewed / Flash Deals).
 */
const ModuleMarketplaceProductCard = ({ item, sx }) => {
  const { configData } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const [modalPayload, setModalPayload] = useState(null);

  const storedModule = useMemo(() => readStoredModule(), []);
  const activeModule = selectedModule || storedModule;

  const enrichedItem = useMemo(() => {
    if (!item) return null;

    const moduleType =
      item?.module_type ||
      item?.module?.module_type ||
      activeModule?.module_type ||
      getCurrentModuleType();
    const moduleName =
      item?.module_name ||
      item?.module?.module_name ||
      activeModule?.module_name;
    const moduleId =
      item?.module_id || item?.module?.id || activeModule?.id;

    return {
      ...item,
      module_type: moduleType,
      module_name: moduleName,
      module_id: moduleId,
      store_name: item?.store_name || item?.store?.name,
      module:
        typeof item?.module === "object" && item?.module
          ? {
              ...item.module,
              module_type: item.module.module_type || moduleType,
              module_name: item.module.module_name || moduleName,
              id: item.module.id || moduleId,
            }
          : {
              id: moduleId,
              module_type: moduleType,
              module_name: moduleName,
            },
    };
  }, [item, activeModule]);

  const itemModuleType = enrichedItem?.module_type;
  const isFood =
    itemModuleType === ModuleTypes.FOOD ||
    itemModuleType === "food" ||
    getCurrentModuleType() === ModuleTypes.FOOD;

  const closeModal = useCallback(() => setModalPayload(null), []);

  const handleRequestDetail = useCallback((bundle) => {
    setModalPayload(bundle);
  }, []);

  const isWishlisted = Boolean(
    wishLists?.item?.some((wishItem) => wishItem?.id === modalPayload?.item?.id)
  );

  if (!enrichedItem) return null;

  return (
    <Box sx={{ width: "100%", height: "100%", ...sx }}>
      <LandingProductCard
        item={enrichedItem}
        onRequestDetail={handleRequestDetail}
      />

      {modalPayload && isFood && (
        <FoodDetailModal
          product={modalPayload.item}
          imageBaseUrl={modalPayload.imageBaseUrl}
          open
          handleModalClose={closeModal}
          setOpen={(value) => {
            if (!value) closeModal();
          }}
          addToWishlistHandler={modalPayload.addToWishlistHandler}
          removeFromWishlistHandler={modalPayload.removeFromWishlistHandler}
          isWishlisted={isWishlisted}
        />
      )}

      {modalPayload && !isFood && (
        <ModuleModal
          open
          handleModalClose={closeModal}
          configData={configData}
          productDetailsData={modalPayload.item}
          addToWishlistHandler={modalPayload.addToWishlistHandler}
          removeFromWishlistHandler={modalPayload.removeFromWishlistHandler}
          isWishlisted={isWishlisted}
        />
      )}
    </Box>
  );
};

export default ModuleMarketplaceProductCard;
