import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import EmptyCart from "./EmptyCart";
import CartActions from "./CartActions";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CartContents from "./CartContents";
import { useRouter } from "next/router";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import DrawerHeader from "./DrawerHeader";
import CartIcon from "./assets/CartIcon";
import FreeDeliveryProgressBar from "./FreeDeliveryProgressBar";
import CartTotalPrice from "./CartTotalPrice";
import { useTheme } from "@emotion/react";
import { alpha, Box, Stack, Typography } from "@mui/material";
import DotSpin from "../DotSpin";
import useDeleteCartItem from "../../api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import useGetAllCartList from "../../api-manage/hooks/react-query/add-cart/useGetAllCartList";
import { setCartList, clearCartMeta, setCartMeta } from "redux/slices/cart";
import { getCartMetaFromResponse } from "helper-functions/normalizeCartListResponse";
import { getGuestId } from "helper-functions/getToken";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  cartItemsTotalAmount,
  getStoreMinimumOrderAmount,
} from "utils/CustomFunctions";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import LandingCartModuleList from "./LandingCartModuleList";

const CardView = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { sideDrawerOpen, setSideDrawerOpen, cartList, refetch, isLoading } =
    props;
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const router = useRouter();
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const { mutateAsync: removeCartItemMutate, isLoading: removeSelectedLoading } =
    useDeleteCartItem();

  // Fire server API request with selected_cart_ids on every checkbox selection change
  const cartListSuccessHandler = (res) => {
    if (res) {
      dispatch(setCartMeta(getCartMetaFromResponse(res)));
    }
  };

  useGetAllCartList(getGuestId(), cartListSuccessHandler, selectedCartIds);

  // Landing page: show modules first, then drill into a selected module
  const isLandingPage =
    router.pathname === "/" ||
    (router.pathname === "/home" && !router.query?.module_id);
  const [selectedModuleGroup, setSelectedModuleGroup] = useState(null);

  // Reset module selection whenever drawer opens or route changes
  useEffect(() => {
    if (sideDrawerOpen && isLandingPage) {
      setSelectedModuleGroup(null);
    }
  }, [sideDrawerOpen, isLandingPage, router.asPath]);

  // Reset module selection when drawer closes
  useEffect(() => {
    if (!sideDrawerOpen) {
      setSelectedModuleGroup(null);
    }
  }, [sideDrawerOpen]);

  const closeHandler = () => {
    setSideDrawerOpen(false);
  };

  const handleBackToModules = () => {
    setSelectedModuleGroup(null);
  };

  // On landing page: if a module is selected, show only its items.
  // Otherwise, use regular module-wise filtering (for non-landing pages).
  const visibleCartList = useMemo(() => {
    if (isLandingPage && selectedModuleGroup) {
      // Show items belonging to the selected module group
      return selectedModuleGroup.items;
    }
    if (isLandingPage && !selectedModuleGroup) {
      // On landing page before selecting a module — return all (for count in modules view)
      return Array.isArray(cartList) ? cartList : [];
    }
    return getCartListModuleWise(cartList);
  }, [cartList, isLandingPage, selectedModuleGroup]);

  // For cart actions / totals (only the "drill-in" items when on landing page)
  const activeCartList = useMemo(() => {
    if (isLandingPage && !selectedModuleGroup) return [];
    return visibleCartList;
  }, [isLandingPage, selectedModuleGroup, visibleCartList]);

  useEffect(() => {
    const currentIds = activeCartList?.map((item) => item?.cartItemId || item?.id).filter(Boolean) || [];
    setSelectedCartIds((prev) => {
      const validPrev = prev.filter((id) => currentIds.some((cId) => String(cId) === String(id)));
      if (validPrev.length > 0) return validPrev;
      return currentIds;
    });
  }, [activeCartList]);

  const selectedCartList = useMemo(
    () =>
      activeCartList.filter((item) =>
        selectedCartIds.some((id) => String(id) === String(item?.cartItemId || item?.id))
      ),
    [activeCartList, selectedCartIds]
  );

  const cartSubtotal = useMemo(
    () => cartItemsTotalAmount(selectedCartList),
    [selectedCartList]
  );
  const storeId = selectedCartList?.[0]?.store_id;
  const { data: storeData } = useGetStoreDetails(storeId, {
    enabled: Boolean(storeId && selectedCartList.length > 0),
  });
  const minimumOrderBlocked = useMemo(() => {
    const minimum = getStoreMinimumOrderAmount(storeData);
    if (!minimum || minimum <= 0) return false;
    return cartSubtotal < minimum;
  }, [cartSubtotal, storeData]);

  const handleToggleSelect = (cartItem) => {
    const id = cartItem?.cartItemId || cartItem?.id;
    if (!id) return;
    dispatch(clearCartMeta());
    const targetStr = String(id);
    setSelectedCartIds((prev) => {
      const exists = prev.some((itemId) => String(itemId) === targetStr);
      return exists
        ? prev.filter((itemId) => String(itemId) !== targetStr)
        : [...prev, id];
    });
  };

  const handleDeleteSelected = async () => {
    if (!selectedCartIds?.length) return;
    const shouldDelete = window.confirm(
      t("Remove selected item(s) from cart?")
    );
    if (!shouldDelete) return;

    const guestId =
      typeof window !== "undefined" ? localStorage.getItem("guest_id") : "";
    const idsToDelete = [...selectedCartIds];

    // Optimistic instant UI deletion (0ms)
    const nextCartList = cartList.filter(
      (item) => !idsToDelete.includes(item?.cartItemId) && !idsToDelete.includes(item?.id)
    );
    dispatch(setCartList(nextCartList));
    dispatch(clearCartMeta());
    setSelectedCartIds([]);
    toast.success(t("Selected items removed from cart"));

    // Backend deletion in background
    try {
      await Promise.all(
        idsToDelete.map((cartId) =>
          removeCartItemMutate({
            cart_id: cartId,
            guestId,
          })
        )
      );
      refetch?.();
    } catch (err) {
      console.error("Cart deletion error:", err);
      refetch?.();
    }
  };

  const allCartItems = Array.isArray(cartList) ? cartList : [];
  // On landing page, show module list even if there are items across modules.
  // hasAnyItems guards against showing the module list when cart is truly empty.
  const hasAnyItems = allCartItems.length > 0;

  // Items for the selected module (on landing page drill-in)
  const selectedModuleHasItems =
    isLandingPage && selectedModuleGroup
      ? selectedModuleGroup.items.length > 0
      : true;

  // Whether to show the products view (not modules list)
  const showProductsView =
    !isLandingPage || (isLandingPage && selectedModuleGroup);

  const getModuleWiseCartContent = () => {
    return (
      <CartContents
        cartList={activeCartList}
        imageBaseUrl={imageBaseUrl}
        refetch={refetch}
        selectedCartIds={selectedCartIds}
        onToggleSelect={handleToggleSelect}
      />
    );
  };

  return (
    <CustomSideDrawer
      anchor="right"
      open={sideDrawerOpen}
      onClose={closeHandler}
      variant="temporary"
      maxWidth="480px"
      width="100%"
      height="100vh"
    >
      <CustomStackFullWidth
        alignItems="center"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <DrawerHeader
          CartIcon={
            <CartIcon
              width="18px"
              height="18px"
              color={theme.palette.primary.main}
            />
          }
          title={
            isLandingPage && selectedModuleGroup
              ? selectedModuleGroup.moduleName
              : "Shopping Cart"
          }
          closeHandler={closeHandler}
          onDeleteSelected={handleDeleteSelected}
          disableDelete={selectedCartIds.length === 0 || removeSelectedLoading}
          showDeleteAction={showProductsView}
          showBackButton={isLandingPage && !!selectedModuleGroup}
          onBack={handleBackToModules}
        />

        {isLoading && !hasAnyItems && !isLandingPage ? (
          <Stack height="214px" width="100%" justifyContent="center">
            <DotSpin />
          </Stack>
        ) : isLandingPage && !selectedModuleGroup ? (
          // ── Landing page: show ALL modules (Instant 0ms API-driven) ──
          <LandingCartModuleList
            cartList={allCartItems}
            onSelectModule={setSelectedModuleGroup}
          />
        ) : !hasAnyItems ? (
          // Truly empty cart (no items in any module)
          <EmptyCart
            cartList={[]}
            setSideDrawerOpen={setSideDrawerOpen}
          />
        ) : isLandingPage && selectedModuleGroup && !selectedModuleHasItems ? (
          // ── Module selected but 0 items → empty state for this module ──
          <EmptyCart
            cartList={[]}
            setSideDrawerOpen={setSideDrawerOpen}
            text={t("Browse Products")}
            subTitle={t(
              "You haven't added any items from {{module}} yet.",
              { module: selectedModuleGroup.moduleName }
            )}
          />
        ) : activeCartList.length === 0 ? (
          // ── Current module has no items (but other modules might) ──
          <EmptyCart
            cartList={[]}
            setSideDrawerOpen={setSideDrawerOpen}
          />
        ) : (
          // ── Products view ──
          <Stack sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
            {getModuleWiseCartContent()}
          </Stack>
        )}

        {showProductsView && activeCartList.length > 0 && (
          <Stack
            sx={{
              width: "100%",
              flexShrink: 0,
              mt: "auto",
              backgroundColor: theme.palette.background.paper,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              pt: 1,
            }}
          >
            {configData?.free_delivery_over && (
              <FreeDeliveryProgressBar
                configData={configData}
                cartList={selectedCartList}
              />
            )}
            <CartTotalPrice cartList={selectedCartList} allCartList={activeCartList} />
            <CartActions
              setSideDrawerOpen={setSideDrawerOpen}
              cartList={activeCartList}
              selectedCartIds={selectedCartIds}
              selectedCartList={selectedCartList}
              minimumOrderBlocked={minimumOrderBlocked}
              storeData={storeData}
              cartSubtotal={cartSubtotal}
            />
          </Stack>
        )}
      </CustomStackFullWidth>
    </CustomSideDrawer>
  );
};

export default CardView;
