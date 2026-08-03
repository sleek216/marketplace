import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import EmptyCart from "./EmptyCart";
import CartActions from "./CartActions";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CartContents from "./CartContents";
import { getCartListModuleWise } from "../../helper-functions/getCartListModuleWise";
import { useRouter } from "next/router";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import DrawerHeader from "./DrawerHeader";
import CartIcon from "./assets/CartIcon";
import FreeDeliveryProgressBar from "./FreeDeliveryProgressBar";
import CartTotalPrice from "./CartTotalPrice";
import { useTheme } from "@emotion/react";
import { alpha } from "@mui/material";
import DotSpin from "../DotSpin";
import { Stack } from "@mui/system";
import useDeleteCartItem from "../../api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import { setCartList, clearCartMeta } from "redux/slices/cart";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  cartItemsTotalAmount,
  getStoreMinimumOrderAmount,
} from "utils/CustomFunctions";

const CardView = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { sideDrawerOpen, setSideDrawerOpen, cartList, refetch, isLoading } =
    props;
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const router = useRouter();
  const moduleWiseCartList = getCartListModuleWise(cartList);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const { mutateAsync: removeCartItemMutate, isLoading: removeSelectedLoading } =
    useDeleteCartItem();
  const closeHandler = () => {
    setSideDrawerOpen(false);
  };

  useEffect(() => {
    const currentIds = moduleWiseCartList?.map((item) => item?.cartItemId) || [];
    setSelectedCartIds((prev) => {
      const validPrev = prev.filter((id) => currentIds.includes(id));
      if (validPrev.length > 0) return validPrev;
      return currentIds;
    });
  }, [cartList]);

  const selectedCartList = useMemo(
    () =>
      moduleWiseCartList.filter((item) =>
        selectedCartIds.includes(item?.cartItemId)
      ),
    [moduleWiseCartList, selectedCartIds]
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
    const id = cartItem?.cartItemId;
    if (!id) return;
    setSelectedCartIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedCartIds?.length) return;
    const shouldDelete = window.confirm(
      t("Remove selected item(s) from cart?")
    );
    if (!shouldDelete) return;

    const guestId =
      typeof window !== "undefined" ? localStorage.getItem("guest_id") : "";
    const results = await Promise.allSettled(
      selectedCartIds.map((cartId) =>
        removeCartItemMutate({
          cart_id: cartId,
          guestId,
        })
      )
    );

    const successIds = selectedCartIds.filter(
      (_, index) => results[index]?.status === "fulfilled"
    );
    if (!successIds.length) return;

    const nextCartList = moduleWiseCartList.filter(
      (item) => !successIds.includes(item?.cartItemId)
    );
    dispatch(setCartList(nextCartList));
    dispatch(clearCartMeta());
    setSelectedCartIds((prev) => prev.filter((id) => !successIds.includes(id)));
    toast.success(t("Selected items removed from cart"));
    refetch?.();
  };

  const getModuleWiseCartContent = () => {
    return (
      <CartContents
        cartList={moduleWiseCartList}
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
          title="Shopping Cart"
          closeHandler={closeHandler}
          onDeleteSelected={handleDeleteSelected}
          disableDelete={selectedCartIds.length === 0 || removeSelectedLoading}
          showDeleteAction
        />
        {isLoading ? (
          <Stack height="214px" width="100%" justifyContent="center">
            <DotSpin />
          </Stack>
        ) : moduleWiseCartList?.length === 0 ? (
          <EmptyCart
            cartList={moduleWiseCartList}
            setSideDrawerOpen={setSideDrawerOpen}
          />
        ) : (
          <Stack sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
            {getModuleWiseCartContent()}
          </Stack>
        )}

        {moduleWiseCartList.length > 0 && (
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
            <CartTotalPrice cartList={selectedCartList} />
            <CartActions
              setSideDrawerOpen={setSideDrawerOpen}
              cartList={moduleWiseCartList}
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
