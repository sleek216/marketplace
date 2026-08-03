import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import MainApi from "api-manage/MainApi";
import { item_details_api } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import ModuleModal from "components/cards/ModuleModal";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getToken } from "helper-functions/getToken";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import { setModules } from "redux/slices/configData";
import { setSelectedModule } from "redux/slices/utils";
import { not_logged_in_message } from "utils/toasterMessages";

const SharedProductDeepLink = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const processedRef = useRef(null);
  const [sharedProduct, setSharedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { configData, modules } = useSelector((state) => state.configData);
  const { wishLists } = useSelector((state) => state.wishList);
  const { data: moduleList, refetch: refetchModules } = useGetModule();

  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate: removeFavoriteMutation } = useWishListDelete();

  const isWishlisted = Boolean(
    sharedProduct?.id &&
      wishLists?.item?.some((wishItem) => wishItem.id === sharedProduct.id)
  );

  useEffect(() => {
    if (moduleList?.length > 0) {
      dispatch(setModules(moduleList));
    }
  }, [moduleList, dispatch]);

  const applyModuleFromQuery = useCallback(
    (moduleId) => {
      if (!moduleId) return false;
      const list = modules?.length ? modules : moduleList;
      const selected = list?.find((item) => String(item.id) === String(moduleId));
      if (!selected) return false;
      localStorage.setItem("module", JSON.stringify(selected));
      dispatch(setSelectedModule(selected));
      return true;
    },
    [modules, moduleList, dispatch]
  );

  const clearShareQuery = useCallback(() => {
    const { product_id, product, module_id, ...rest } = router.query;
    router.replace({ pathname: "/home", query: rest }, undefined, {
      shallow: true,
    });
  }, [router]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSharedProduct(null);
  }, []);

  const addToWishlistHandler = useCallback(
    (e) => {
      e?.stopPropagation?.();
      const token = getToken();
      if (!token) {
        toast.error(t(not_logged_in_message));
        return;
      }
      addFavoriteMutation(sharedProduct?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatch(addWishList(sharedProduct));
            toast.success(response?.message);
          }
        },
        onError: onSingleErrorResponse,
      });
    },
    [sharedProduct, addFavoriteMutation, dispatch, t]
  );

  const removeFromWishlistHandler = useCallback(
    (e) => {
      e?.stopPropagation?.();
      removeFavoriteMutation(sharedProduct?.id, {
        onSuccess: (res) => {
          dispatch(removeWishListItem(sharedProduct?.id));
          toast.success(res.message, { id: "wishlist" });
        },
        onError: onSingleErrorResponse,
      });
    },
    [sharedProduct, removeFavoriteMutation, dispatch]
  );

  useEffect(() => {
    if (!router.isReady) return;

    const productId = router.query.product_id || router.query.product;
    if (!productId) return;

    const key = `${productId}:${router.query.module_id || ""}`;
    if (processedRef.current === key) return;

    const moduleId = router.query.module_id;
    const availableModules = modules?.length ? modules : moduleList;

    if (moduleId && !availableModules?.length) {
      refetchModules();
      return;
    }

    let cancelled = false;

    const openSharedProduct = async () => {
      try {
        if (moduleId) {
          const applied = applyModuleFromQuery(moduleId);
          if (!applied) {
            toast.error(t("Product not found"));
            clearShareQuery();
            return;
          }
        }

        const { data } = await MainApi.get(`${item_details_api}/${productId}`);
        if (cancelled) return;

        if (!data?.id) {
          toast.error(t("Product not found"));
          clearShareQuery();
          return;
        }

        if (data?.module_id && !moduleId) {
          applyModuleFromQuery(data.module_id);
        }

        processedRef.current = key;
        setSharedProduct(data);
        setModalOpen(true);
        clearShareQuery();
      } catch (error) {
        if (!cancelled) {
          onSingleErrorResponse(error);
          clearShareQuery();
        }
      }
    };

    openSharedProduct();

    return () => {
      cancelled = true;
    };
  }, [
    router.isReady,
    router.query.product_id,
    router.query.product,
    router.query.module_id,
    modules,
    moduleList,
    applyModuleFromQuery,
    clearShareQuery,
    refetchModules,
    t,
  ]);

  if (!modalOpen || !sharedProduct) return null;

  const isFoodProduct =
    sharedProduct?.module?.module_type === ModuleTypes.FOOD ||
    sharedProduct?.module_type === ModuleTypes.FOOD;

  if (isFoodProduct) {
    return (
      <FoodDetailModal
        product={sharedProduct}
        imageBaseUrl={configData?.base_urls?.item_image_url}
        open={modalOpen}
        handleModalClose={closeModal}
        setOpen={(value) => {
          if (!value) closeModal();
        }}
        addToWishlistHandler={addToWishlistHandler}
        removeFromWishlistHandler={removeFromWishlistHandler}
        isWishlisted={isWishlisted}
      />
    );
  }

  return (
    <ModuleModal
      open={modalOpen}
      handleModalClose={closeModal}
      configData={configData}
      productDetailsData={sharedProduct}
      addToWishlistHandler={addToWishlistHandler}
      removeFromWishlistHandler={removeFromWishlistHandler}
      isWishlisted={isWishlisted}
    />
  );
};

export default SharedProductDeepLink;
