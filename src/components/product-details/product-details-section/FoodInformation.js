import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Box, Grid, Stack, Typography, useMediaQuery, IconButton } from "@mui/material";
import { Heart as FavoriteIcon, HeartOff as FavoriteBorderIcon } from "lucide-react";

import StartPriceView from "../../food-details/foodDetail-modal/StartPriceView";
import { handleProductVariationRequirementsToaster } from "../../food-details/foodDetail-modal/SomeHelperFuctions";
import AddUpdateOrderToCart from "../../food-details/foodDetail-modal/AddUpdateOrderToCart";
import AddOrderToCart from "../../food-details/foodDetail-modal/AddOrderToCart";
import TotalAmountVisibility from "../../food-details/foodDetail-modal/TotalAmountVisibility";
import AddOnsManager from "../../food-details/foodDetail-modal/AddOnsManager";
import VariationsManager from "../../food-details/foodDetail-modal/VariationsManager";
import IncrementDecrementManager from "../../food-details/foodDetail-modal/IncrementDecrementManager";
import { handleInitialTotalPriceVarPriceQuantitySet } from "../../food-details/foodDetail-modal/helper-functions/handleDataOnFirstMount";
import { calculateItemBasePrice, getIndexFromArrayByComparision, isAvailable } from "utils/CustomFunctions";
import { getDiscountedAmount } from "helper-functions/CardHelpers";
import { setBuyNowItemList, setCampaignItemList, setCart, setClearCart, setUpdateVariationToCart } from "redux/slices/cart";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CartClearModal from "./CartClearModal";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import CustomModal from "../../modal";
import { not_logged_in_message, out_of_limits, out_of_stock } from "utils/toasterMessages";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import useAddCartItem from "../../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { handleValuesFromCartItems } from "./helperFunction";
import useCartItemUpdate from "../../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import { getGuestId, getToken, hasValidAuthToken } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { OPEN_AUTH_MODAL_EVENT } from "components/header/second-navbar/SecondNavbar";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";
import useTrackRecentlyViewed from "api-manage/hooks/react-query/recently-viewed/useTrackRecentlyViewed";
import CustomRatingBox from "../../CustomRatingBox";
import { FoodHalalHaram, FoodVegNonVegFlag } from "../../cards/SpecialCard";
import { CustomFavICon } from "../../food-details/food-card/FoodCard.style";

const FoodInformation = ({
  productDetailsData: fromCard,
  handleModalClose,
  configData,
  productUpdate,
  isSmall,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [product, setProduct] = useState(fromCard);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [varPrice, setVarPrice] = useState(null);
  const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(null);
  const [selectedAddons, setSelectedAddOns] = useState([]);
  const { cartList: allCartList } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [clearCartModal, setClearCartModal] = React.useState(false);
  const [otherSelectedOption, setOtherSelectedOption] = useState([]);
  const cartList = getCartListModuleWise(allCartList);
  const handleClearCartModalOpen = () => setClearCartModal(true);
  const { wishLists } = useSelector((state) => state.wishList);
  const [modalData, setModalData] = useState([]);

  // Wishlist handler state locally for the UI since we don't have it passed properly like the modal does sometimes
  const [isWishlisted, setIsWishlisted] = useState(
    !!wishLists?.food?.find((wishFood) => wishFood.id === (fromCard?.id || product?.id))
  );

  const isFoodModuleItem =
    modalData?.[0]?.module_type === "food" ||
    modalData?.[0]?.module?.module_type === "food" ||
    getCurrentModuleType() === "food";
  const productModuleId =
    product?.module_id ||
    product?.module?.id ||
    modalData?.[0]?.module_id ||
    modalData?.[0]?.module?.id;
  
  const { mutate: updateMutate, updateIsLoading } = useCartItemUpdate();
  const { mutate, isLoading } = useAddCartItem();
  const guestId = getGuestId();
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const handleSuccessItem = (resData) => {};
  const params = { id: fromCard?.id };
  const { data } = useGetItemDetails(params, handleSuccessItem, productUpdate);
  const { mutate: trackRecentlyViewed } = useTrackRecentlyViewed();

  useEffect(() => {
    if (productUpdate) {
      handleInitialTotalPriceVarPriceQuantitySet(
        fromCard,
        setModalData,
        productUpdate,
        setTotalPrice,
        setVarPrice,
        setQuantity,
        setSelectedOptions,
        setTotalWithoutDiscount,
        setSelectedAddOns,
        setOtherSelectedOption
      );
    } else {
      if (data) {
        handleInitialTotalPriceVarPriceQuantitySet(
          data,
          setModalData,
          productUpdate,
          setTotalPrice,
          setVarPrice,
          setQuantity,
          setSelectedOptions,
          setTotalWithoutDiscount,
          setSelectedAddOns,
          setOtherSelectedOption
        );
      }
    }
  }, [fromCard, data]);

  const itemValuesHandler = (itemIndex, variationValues) => {
    const isThisValExistWithinSelectedValues = selectedOptions.filter(
      (sItem) => sItem.choiceIndex === itemIndex
    );
    if (variationValues.length > 0) {
      let newVariation = variationValues.map((vVal, vIndex) => {
        let exist =
          isThisValExistWithinSelectedValues.length > 0 &&
          isThisValExistWithinSelectedValues.find(
            (item) => item.optionIndex === vIndex
          );
        if (exist) {
          return exist;
        } else {
          return { ...vVal, isSelected: false };
        }
      });
      return newVariation;
    } else {
      return variationValues;
    }
  };

  const getNewVariationForDispatch = () => {
    const newVariations =
      modalData?.[0]?.food_variations.length > 0
        ? modalData?.[0]?.food_variations?.map((item, index) => {
            if (selectedOptions.length > 0) {
              return {
                ...item,
                values:
                  item.values.length > 0
                    ? itemValuesHandler(index, item.values)
                    : item.values,
              };
            } else {
              return item;
            }
          })
        : modalData?.[0]?.food_variations;
    return newVariations;
  };

  const getNewObj = () => ({
    ...modalData[0],
    totalPrice: getDiscountedAmount(
      totalPrice,
      product?.discount,
      product?.discount_type,
      product?.store_discount,
      quantity
    ),
    quantity: quantity,
    food_variations: getNewVariationForDispatch(),
    selectedAddons: selectedAddons,
    itemBasePrice: getDiscountedAmount(
      calculateItemBasePrice(modalData[0], selectedOptions),
      product?.discount,
      product?.discount_type,
      product?.store_discount,
      quantity
    ),
  });

  const handleSuccess = (res) => {
    if (res) {
      let product = {};
      res?.forEach((item) => {
        product = {
          ...item?.item,
          cartItemId: item?.id,
          totalPrice: item?.price,
          quantity: item?.quantity,
          food_variations: item?.item?.food_variations,
          selectedAddons: selectedAddons,
          selectedOption: selectedOptions,
          itemBasePrice: item?.item?.price,
        };
      });
        dispatch(setCart({ ...product, isUpdate: true }));
      toast.success(t("Item added to cart"));
    }
  };

  const updateCartSuccessHandler = (res) => {
    if (res && res.length > 0) {
      const updatedProducts = res.map((item) => {
        const indexNumber = getIndexFromArrayByComparision(cartList, item?.item);
        return {
          product: {
            ...item?.item,
            cartItemId: item?.id,
            totalPrice: item?.price,
            quantity: item?.quantity,
            food_variations: item?.item?.food_variations,
            selectedAddons: selectedAddons,
            selectedOption: selectedOptions,
            itemBasePrice: item?.item?.price,
          },
          indexNumber,
        };
      });

      updatedProducts.forEach(({ product, indexNumber }) => {
        dispatch(
          setUpdateVariationToCart({
            newObj: product,
            indexNumber,
          })
        );
      });
      toast.success(t("Item updated successfully"));
      handleModalClose?.();
    }
  };

  const addOrUpdateToCartByDispatch = () => {
    const resolvedStock = Number(modalData?.[0]?.stock);
    const hasFiniteStock = Number.isFinite(resolvedStock);
    if (!isFoodModuleItem && hasFiniteStock && (resolvedStock <= 0 || quantity > resolvedStock)) {
      toast.error(t(out_of_stock));
      return;
    }
    if (productUpdate) {
      const itemObject = {
        cart_id: product?.cart_id,
        guest_id: getGuestId(),
        model: product?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids: selectedAddons?.length > 0 ? selectedAddons?.map((add) => add.id) : [],
        add_on_qtys: selectedAddons?.length > 0 ? selectedAddons.map((add) => add.quantity) : [],
        item_id: product?.id,
        price: totalPrice,
        quantity: quantity,
        variation: getNewVariationForDispatch()?.length > 0 ? getNewVariationForDispatch()?.map((variation) => ({
            name: variation.name,
            values: { label: handleValuesFromCartItems(variation.values) },
          })) : [],
        moduleIdOverride: productModuleId,
      };

      updateMutate(itemObject, {
        onSuccess: updateCartSuccessHandler,
        onError: onErrorResponse,
      });
    } else {
      const itemObject = {
        guest_id: guestId,
        model: modalData[0]?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids: selectedAddons?.length > 0 ? selectedAddons?.map((add) => add.id) : [],
        add_on_qtys: selectedAddons?.length > 0 ? selectedAddons.map((add) => add.quantity) : [],
        item_id: modalData[0]?.id,
        price: totalPrice,
        quantity: quantity,
        variation: getNewVariationForDispatch()?.length > 0 ? getNewVariationForDispatch()?.map((variation) => ({
            name: variation.name,
            values: { label: handleValuesFromCartItems(variation.values) },
          })) : [],
        moduleIdOverride: productModuleId,
      };
      mutate(itemObject, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    }
  };

  const handleBuyOrOrderNow = (status) => {
    if (!hasValidAuthToken(getToken())) {
      toast.error(t(not_logged_in_message));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(OPEN_AUTH_MODAL_EVENT));
      }
      return;
    }
    const product = getNewObj();
    if (status === "buy_now") {
      dispatch(setBuyNowItemList(product));
      router.push(`/checkout?page=buy_now`, undefined, { shallow: true });
    } else {
      dispatch(setCampaignItemList(product));
      router.push(`/checkout?page=campaign`, undefined, { shallow: true });
    }
  };

  const handleProductAddUpdate = (checkingFor) => {
    if (checkingFor === "cart") {
      addOrUpdateToCartByDispatch();
    } else if (checkingFor === "campaign" || checkingFor === "buy_now") {
      handleBuyOrOrderNow(checkingFor);
    }
  };

  const handleRequiredItemsToaster = (itemsArray, selectedOptions) => {
    itemsArray?.forEach((item) => {
      if (selectedOptions.length > 0) {
        selectedOptions?.forEach((sOption) => {
          if (sOption.choiceIndex !== item.indexNumber) {
            handleProductVariationRequirementsToaster(item.name, false, t);
          }
        });
      } else {
        handleProductVariationRequirementsToaster(item.name, false, t);
      }
    });
  };

  const optionalVariationSelectionMinMax = () => {
    const selectedValues = selectedOptions.filter((item) => item.type === "optional");
    let isTrue = false;
    if (selectedValues.length > 0) {
      const selectedIndexCount = [];
      selectedValues.forEach((item) => selectedIndexCount.push(item.choiceIndex));
      const indexWithoutDuplicates = [...new Set(selectedIndexCount)];
      if (indexWithoutDuplicates.length > 0) {
        indexWithoutDuplicates.forEach((itemIndex) => {
          let optionalItemIndex = modalData?.[0]?.food_variations?.find((mItem, index) => index === itemIndex);
          if (optionalItemIndex) {
            if (optionalItemIndex.type === "multi") {
              let indexNum = modalData[0]?.food_variations?.findIndex((mItem) => mItem.name === optionalItemIndex.name);
              let count = 0;
              selectedIndexCount.forEach((indexN) => {
                if (indexN === indexNum) count += 1;
              });

              if (count >= Number.parseInt(optionalItemIndex.min) && count <= Number.parseInt(optionalItemIndex.max)) {
                isTrue = true;
              } else {
                const text = { name: optionalItemIndex.name, min: optionalItemIndex.min, max: optionalItemIndex.max };
                isTrue = false;
                handleProductVariationRequirementsToaster(text, true, t, true);
              }
            } else {
              isTrue = true;
            }
          } else {
            isTrue = true;
          }
        });
      } else {
        isTrue = true;
      }
    } else {
      isTrue = true;
    }
    return isTrue;
  };

  const handleAddToCartOnDispatch = (checkingFor) => {
    let requiredItemsList = [];
    if (modalData?.[0]?.food_variations?.length > 0) {
      modalData?.[0]?.food_variations?.forEach((item, index) => {
        if (item.required === "on") {
          requiredItemsList.push({ indexNumber: index, type: item.type, max: item.max, min: item.min, name: item.name });
        }
      });
    }
    if (requiredItemsList.length > 0) {
      if (selectedOptions.length === 0) {
        handleRequiredItemsToaster(requiredItemsList, selectedOptions);
      } else {
        let itemCount = 0;
        requiredItemsList?.forEach((item, index) => {
          const isExistInSelection = selectedOptions?.find((sitem) => sitem.choiceIndex === item.indexNumber);
          if (isExistInSelection) {
            if (item.type === "single") {
              itemCount += 1;
            } else {
              let selectedOptionCount = 0;
              selectedOptions?.forEach((i) => {
                if (i.choiceIndex === isExistInSelection?.choiceIndex) selectedOptionCount += 1;
              });
              if (selectedOptionCount >= Number.parseInt(item.min) && selectedOptionCount <= Number.parseInt(item.max)) {
                itemCount += 1;
              } else {
                const text = { name: item.name, min: item.min, max: item.max };
                handleProductVariationRequirementsToaster(text, true, t);
              }
            }
            if (itemCount === requiredItemsList.length && optionalVariationSelectionMinMax(selectedOptions, modalData)) {
              handleProductAddUpdate(checkingFor);
            }
          } else {
            handleRequiredItemsToaster(requiredItemsList, selectedOptions);
          }
        });
      }
    } else {
      handleProductAddUpdate(checkingFor);
    }
  };

  const addToCard = (status) => {
    const checkingFor = status ? status : "cart";
    handleAddToCartOnDispatch(checkingFor);
  };

  const clearCartAlert = () => {
    dispatch(setClearCart());
    setClearCartModal(false);
    toast.success(t("Previously added restaurant foods have been removed from cart. Now, try again."), { duration: 6000 });
  };

  const changeChoices = (e, option, optionIndex, choiceIndex, isRequired, choiceType, checked) => {
    if (choiceType === "single") {
      if (checked) {
        if (selectedOptions.length > 0) {
          const isExist = selectedOptions.find((item) => item.choiceIndex === choiceIndex && item.optionIndex === optionIndex);
          if (isExist) {
            const newSelectedOptions = selectedOptions.filter((sOption) => sOption.choiceIndex === choiceIndex && sOption.label !== isExist.label);
            setSelectedOptions(newSelectedOptions);
            setTotalPrice((prevState) => prevState - Number.parseInt(option.optionPrice) * quantity);
            setVarPrice((prevPrice) => prevPrice - Number.parseInt(option.optionPrice) * quantity);
          } else {
            const isItemExistFromSameVariation = selectedOptions.find((item) => item.choiceIndex === choiceIndex);
            if (isItemExistFromSameVariation) {
              const newObjs = selectedOptions.map((item) => {
                if (item.choiceIndex === choiceIndex) {
                  return { choiceIndex: choiceIndex, ...option, optionIndex: optionIndex, isSelected: true, type: isRequired === "on" ? "required" : "optional" };
                } else {
                  return item;
                }
              });
              setSelectedOptions(newObjs);
              setTotalPrice((prevState) => prevState - Number.parseInt(isItemExistFromSameVariation.optionPrice) * quantity + Number.parseInt(option.optionPrice) * quantity);
              setVarPrice((prevPrice) => prevPrice - Number.parseInt(isItemExistFromSameVariation.optionPrice) * quantity + Number.parseInt(option.optionPrice) * quantity);
            } else {
              const newObj = { choiceIndex: choiceIndex, ...option, optionIndex: optionIndex, isSelected: true, type: isRequired === "on" ? "required" : "optional" };
              setSelectedOptions([...selectedOptions, newObj]);
              setTotalPrice((prevState) => prevState + Number.parseInt(option.optionPrice) * quantity);
              setVarPrice((prevPrice) => prevPrice + Number.parseInt(option.optionPrice) * quantity);
            }
          }
        } else {
          const newObj = { choiceIndex: choiceIndex, ...option, optionIndex: optionIndex, isSelected: true, type: isRequired === "on" ? "required" : "optional" };
          setSelectedOptions([newObj]);
          setTotalPrice((prevState) => prevState + Number.parseInt(option.optionPrice) * quantity);
          setVarPrice((prevPrice) => prevPrice + Number.parseInt(option.optionPrice) * quantity);
        }
      } else {
        const filtered = selectedOptions.filter((item) => {
          if (item.choiceIndex === choiceIndex) {
            if (item.label !== option.label) return item;
          } else {
            return item;
          }
        });
        setSelectedOptions(filtered);
        setTotalPrice((prevState) => prevState - Number.parseInt(option.optionPrice) * quantity);
        setVarPrice((prevPrice) => prevPrice - Number.parseInt(option.optionPrice) * quantity);
      }
    } else {
      if (e.target.checked) {
        setSelectedOptions((prevState) => [...prevState, { choiceIndex: choiceIndex, ...option, optionIndex: optionIndex, isSelected: true, type: isRequired === "on" ? "required" : "optional" }]);
        setTotalPrice((prevState) => prevState + Number.parseInt(option.optionPrice) * quantity);
        setVarPrice((prevPrice) => prevPrice + Number.parseInt(option.optionPrice) * quantity);
      } else {
        const filtered = selectedOptions.filter((item) => {
          if (item.choiceIndex === choiceIndex) {
            if (item.label !== option.label) return item;
          } else {
            return item;
          }
        });
        setSelectedOptions(filtered);
        setTotalPrice((prevState) => prevState - Number.parseInt(option.optionPrice) * quantity);
        setVarPrice((prevPrice) => prevPrice - Number.parseInt(option.optionPrice) * quantity);
      }
    }
  };

  const radioCheckHandler = useCallback((choiceIndex, option, optionIndex) => {
    const isExist = selectedOptions.find((sOption) => sOption.choiceIndex === choiceIndex && sOption.optionIndex === optionIndex);
    return !!isExist;
  }, [selectedOptions]);

  const changeAddOns = (addOn) => {
    if (addOn?.isChecked && addOn?.quantity > 0) {
      let newArray = [];
      if (selectedAddons?.length > 0) {
        newArray = [...selectedAddons];
        const existIndex = newArray.findIndex((item) => item.id === addOn.id);
        if (existIndex !== -1) {
          newArray[existIndex] = addOn;
        } else {
          newArray.push(addOn);
        }
      } else {
        newArray.push(addOn);
      }
      setSelectedAddOns(newArray);
    } else {
      let filter = selectedAddons.filter((item) => item.id !== addOn.id);
      setSelectedAddOns(filter);
    }
  };

  const handleTotalPrice = () => {
    let price;
    if (productUpdate) {
      if (modalData.length > 0) price = modalData?.[0]?.price;
    } else {
      price = product?.price;
    }
    if (selectedOptions?.length > 0) {
      selectedOptions?.forEach((item) => (price += Number.parseInt(item?.optionPrice)));
    }
    setTotalPrice(price * quantity);
  };

  useEffect(() => {
    if (product) handleTotalPrice();
  }, [quantity, modalData]);

  const decrementPrice = () => setQuantity((prevQty) => prevQty - 1);
  const incrementPrice = () => {
    const resolvedStock = Number(modalData?.[0]?.stock);
    const hasFiniteStock = Number.isFinite(resolvedStock);
    if (!isFoodModuleItem && hasFiniteStock && quantity >= resolvedStock) {
      toast.error(t(out_of_stock));
      return;
    }
    if (modalData[0]?.maximum_cart_quantity) {
      if (modalData[0]?.maximum_cart_quantity <= quantity) {
        toast.error(t(out_of_limits));
      } else {
        setQuantity((prevQty) => prevQty + 1);
      }
    } else {
      setQuantity((prevQty) => prevQty + 1);
    }
  };

  const isInCart = (id) => {
    if (productUpdate) {
      const isInCart = cartList.filter((item) => item.id === id);
      return isInCart.length > 0;
    }
    return !!cartList.find((item) => item.id === id);
  };

  const orderNow = () => {
    let checkingFor = "campaign";
    if (token) {
      handleAddToCartOnDispatch(checkingFor);
    } else {
      toast.error(not_logged_in_message);
    }
  };
  
  const handleRouteToStore = () => {
    if (router.pathname !== `/store/[id]`) {
      router.push({
        pathname: `/store/[id]`,
        query: {
          id: modalData[0]?.store_id,
          module_id: `${modalData[0]?.module_id}`,
          module_type: getCurrentModuleType(),
          store_zone_id: `${modalData[0].zone_id}`,
        },
      });
    }
  };

  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(product?.id, {
        onSuccess: (response) => {
          if (response) {
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => toast.error(error.response.data.message),
      });
    } else toast.error(t(not_logged_in_message));
  };

  return (
    <CustomStackFullWidth spacing={2} sx={{ pt: 1 }}>
      {/* Title & Tags */}
      <Stack spacing={1}>
        <Typography fontSize="24px" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2 }}>
          {modalData.length > 0 && modalData[0].name}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <CustomRatingBox rating={product?.avg_rating} />
          {modalData.length > 0 && modalData[0]?.module?.module_type === "food" && configData?.toggle_veg_non_veg && (
            <FoodVegNonVegFlag veg={modalData[0]?.veg === 0 ? "false" : "true"} />
          )}
          {modalData?.[0]?.halal_tag_status && modalData?.[0]?.is_halal ? (
            <FoodHalalHaram position="relative" />
          ) : (
            ""
          )}
        </Stack>
      </Stack>

      <Box sx={{ borderBottom: "1px solid", borderColor: "neutral.200", pb: 2 }}>
         {modalData.length > 0 && (
            <StartPriceView data={modalData[0]} configData={configData} />
         )}
      </Box>

      {/* Variations & Addons */}
      <Stack spacing={2}>
        {modalData.length > 0 && modalData[0].food_variations?.length > 0 && (
          <VariationsManager
            t={t}
            modalData={modalData}
            radioCheckHandler={radioCheckHandler}
            changeChoices={changeChoices}
          />
        )}
        {modalData.length > 0 && modalData[0].add_ons?.length > 0 && (
          <AddOnsManager
            t={t}
            modalData={modalData}
            changeAddOns={changeAddOns}
            selectedAddons={selectedAddons}
          />
        )}
      </Stack>

      <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.neutral[100], borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <TotalAmountVisibility
            modalData={modalData}
            totalPrice={totalPrice}
            t={t}
            productDiscount={product?.discount}
            productDiscountType={product?.discount_type}
            productRestaurantDiscount={product?.store_discount}
            productQuantity={quantity}
            selectedAddOns={selectedAddons}
          />
          <IncrementDecrementManager
            decrementPrice={decrementPrice}
            totalPrice={totalPrice}
            quantity={quantity}
            incrementPrice={incrementPrice}
          />
        </Stack>
      </Box>

      <Box mt={2}>
        {modalData.length > 0 && isAvailable(modalData[0].available_time_starts, modalData[0].available_time_ends) && !modalData[0]?.available_date_starts && (
          <AddOrderToCart
            isInCart={isInCart}
            product={product}
            t={t}
            addToCard={addToCard}
            orderNow={orderNow}
            router={router}
            isLoading={isLoading}
            updateIsLoading={updateIsLoading}
          />
        )}
        {modalData.length > 0 && !isAvailable(modalData[0].available_time_starts, modalData[0].available_time_ends) && !modalData[0]?.available_date_starts && (
          <AddOrderToCart
            isLoading={isLoading}
            isInCart={isInCart}
            product={product}
            t={t}
            addToCard={addToCard}
            orderNow={orderNow}
            router={router}
            isScheduled={modalData[0].schedule_order ? "true" : "false"}
            updateIsLoading={updateIsLoading}
          />
        )}
        {modalData.length > 0 && isAvailable(modalData[0].available_time_starts, modalData[0].available_time_ends) && modalData[0]?.available_date_starts && (
          <AddUpdateOrderToCart
            modalData={modalData}
            isInCart={isInCart}
            addToCard={addToCard}
            t={t}
            product={product}
            orderNow={orderNow}
            isCampaign
            isLoading={isLoading}
            updateIsLoading={updateIsLoading}
          />
        )}
      </Box>

      {clearCartModal && (
        <CustomModal openModal={clearCartModal} handleClose={() => cartResetHandler()}>
          <CartClearModal handleClose={() => cartResetHandler()} dispatchRedux={dispatch} />
        </CustomModal>
      )}
    </CustomStackFullWidth>
  );
};

export default FoodInformation;
